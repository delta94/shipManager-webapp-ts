const path = require('path');
const SftpUpload = require('sftp-upload');
const configs = require('../secret.config').config;

const localPath = path.resolve(__dirname, '../dist/index.html');
const remotePath = '/var/www/';

const options = {
  host: configs.host,
  username: configs.username,
  password: configs.password,
  path: localPath,
  remoteDir: remotePath,
};

const client = new SftpUpload(options);

client
  .on('error', function(err: any) {
    throw err;
  })
  .on('uploading', function(progress: any) {
    console.log('Uploading', progress.file);
    console.log(progress.percent + '% completed');
  })
  .on('completed', function() {
    console.log('Upload Completed');
  })
  .upload();
