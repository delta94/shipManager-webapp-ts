import React from 'react';

const fieldLabels = {
  name: '船舶名',
  carrierIdentifier: '船舶识别号',
  owner: '船舶所有人',
  shareInfo: '船舶共有情况',
  harbor: '船籍港',
  formerName: '曾用名',
  registerIdentifier: '初次登记号',
  examineIdentifier: '船检登记号',
  material: '船舶材质',
  buildAt: '建造完工日期',
  assembleAt: '安放龙骨日期',
  type: '船舶类型',
  power: '发动机功率',
  grossTone: '总吨位 (吨)',
  netTone: '净吨位 (吨)',
  length: '船身长 (米)',
  width: '船身宽 (米)',
  depth: '船身深 (米)',
  height: '船身高 (米)',
};

const mockData = {
  name: '章云号',
  typeId: 1,
  materialId: 2,
  owner: '李星',
  shareInfo: '托管',
  registerIdentifier: '2148932',
  examineIdentifier: '3820311',
  carrierIdentifier: '3233333',
  buildAt: '2018-10-09',
  assembleAt: '2018-10-09',
  harbor: '珠海港',
  formerName: '',
  grossTone: 138,
  netTone: 234,
  length: 12,
  width: 12,
  height: 32,
  depth: 32,
  createAt: '2018-10-09 22:39:05',
  updateAt: '2018-10-09 22:40:47',
};

class ShipUpdate extends React.Component {
  render() {
    return <div>ShipUpdate</div>;
  }
}

export default ShipUpdate;
