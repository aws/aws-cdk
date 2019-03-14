import React from 'react';

const map = {
  'AWS::IAM::Role': 'AWS-Identity-and-Access-Management-IAM_Role',
  'AWS::CloudFormation::CustomResource': 'AWS-CloudFormation_Template',
  'AWS::CloudFormation::Stack': 'AWS-CloudFormation_Stack',
  'AWS::S3::Bucket': 'Amazon-Simple-Storage-Service-S3_Bucket',
  'AWS::SQS::Queue': 'Amazon-Simple-Queue-Service-SQS_Queue',
  'AWS::Lambda::Function': 'AWS-Lambda_Lambda-Function',
  'AWS::CloudWatch::Alarm': 'Amazon-CloudWatch_Alarm',
  'AWS::Events::Rule': 'Amazon-CloudWatch_Rule',
  'AWS::IAM::Policy': 'IoT_Policy',
  'AWS::Lambda::Permission': 'AWS-Identity-and-Access-Management-IAM_Permissions',
}

export function constructIcon(constructData, light, fn) {
  const type = constructData.metadata && constructData.metadata.resourceType;
  if (!type || !(type in map)) { return ''; }
  const path = '/icons/' + map[type] + '_' + (light ? 'light' : 'dark') + '-bg.png';
  return fn(path);
}

export function image(path) {
  return <img src={path} style={{ width: 32, verticalAlign: 'text-bottom' }} />;
}

export function smallImage(path) {
  return <img src={path} style={{ width: 16, verticalAlign: 'text-bottom', marginRight: 5 }} />;
}
