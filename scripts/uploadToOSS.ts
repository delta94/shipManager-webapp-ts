const fs = require('fs');
const path = require('path');
const configs = require('../secret.config');
const OSS = require('ali-oss');

const client = new OSS({
  region: configs.region,
  bucket: configs.bucket,
  accessKeyId: configs.accessKeyId,
  accessKeySecret: configs.accessKeySecret,
});

function is_dir(str: string): boolean {
  let pathx = path.resolve(__dirname, '../', str);
  try {
    let stat = fs.lstatSync(pathx);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

function parseFolder(dir: string): any {
  if (!is_dir(dir)) return;
  let files = fs.readdirSync(dir);
  return files.filter((file: string) => !is_dir(dir + '/' + file));
}

let distFolder = parseFolder('./dist');
let staticFolder = parseFolder('./dist/static');
let iconsFolder = parseFolder('./dist/icons');

async function uploadDistFolder() {
  for (let i = 0; i < distFolder.length; i++) {
    let name = distFolder[i];
    let key = `${name}`;
    let pathName = path.resolve(__dirname, '../dist', name);
    await client.multipartUpload(key, pathName);
    console.log(pathName, 'has been uploaded');
  }
}

async function uploadStaticFolder() {
  for (let i = 0; i < staticFolder.length; i++) {
    let name = staticFolder[i];
    let key = `static/${name}`;
    let pathName = path.resolve(__dirname, '../dist/static', name);
    await client.multipartUpload(key, pathName);

    console.log(pathName, 'has been uploaded');
  }
}

async function uploadIconsFolder() {
  for (let i = 0; i < iconsFolder.length; i++) {
    let name = iconsFolder[i];
    let key = `icons/${name}`;
    let pathName = path.resolve(__dirname, '../dist/icons', name);
    await client.multipartUpload(key, pathName);

    console.log(pathName, 'has been uploaded');
  }
}

uploadDistFolder();
uploadStaticFolder();
uploadIconsFolder();
