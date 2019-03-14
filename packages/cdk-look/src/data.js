'use strict';

const appdata = require('./app.json');


function constructDataToTreeData(constructData, prefix) {
  const path = prefix + '/' + constructData.id;

  const isStack = path.split('/').length === 3; // HAAAACK

  // Treat the child named 'Resource' as this node
  const resourceChild = findResourceChild(constructData);
  const children = (constructData.children || []).filter(c => c.id !== 'Resource');

  if (isStack) {
    constructData.metadata = constructData.metadata || {};
    constructData.metadata.resourceType = 'AWS::CloudFormation::Stack';
  }

  return {
    name: constructData.id,
    children: noEmptyList(children.map(c => constructDataToTreeData(c, path))),
    // Copy the original app node in there but remove the children
    constructData: {
      ...(resourceChild || constructData),
      id: constructData.id, // Use id from current resource always
      path,
      children: undefined
    },
  };
}

function findResourceChild(constructData) {
  return (constructData.children || []).find(c => c.id === 'Resource');
}

function noEmptyList(x) {
  if (Array.isArray(x) && x.length === 0) { return undefined; }
  return x;
}

const data = constructDataToTreeData(appdata, '');
data.toggled = true;
export default data;