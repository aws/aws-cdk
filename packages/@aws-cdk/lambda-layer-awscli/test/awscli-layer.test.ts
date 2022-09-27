import * as fs from 'fs';
import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { AwsCliLayer } from '../lib';

const PACKAGE_NAME = '@aws-cdk/asset-awscli-v1';
const PACKAGE_TARBALL_PREFIX = 'aws-cdk-asset-awscli-v1-';

describe('create a layer version', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('using already installed package', () => {
    //GIVEN
    const stack = new Stack();

    // WHEN
    new AwsCliLayer(stack, 'MyLayer');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
      Description: '/opt/awscli/aws',
    });
  });

  test('downloading and installing package', () => {
    //GIVEN
    // Makes require('asset-awscli-v1') fail
    jest.mock(PACKAGE_NAME, () => undefined);
    const stack = new Stack();

    // WHEN
    new AwsCliLayer(stack, 'MyLayer');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
      Description: '/opt/awscli/aws',
    });
  });

  test('using the fallback', () => {
    //GIVEN
    // Makes require('asset-awscli-v1') fail
    jest.mock(PACKAGE_NAME, () => undefined);
    // Make the downloaded location not exist, so logic has to fallback
    const cdkHomeDir = cxapi.cdkHomeDir();
    const downloadDir = path.join(cdkHomeDir, 'npm-cache');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const targetVersion = require(path.join(__dirname, '../package.json')).devDependencies[PACKAGE_NAME];
    const downloadPath = path.join(downloadDir, `${PACKAGE_TARBALL_PREFIX}${targetVersion}.tgz`);
    const spy = jest.spyOn(fs, 'existsSync');
    spy.mockImplementation((p) => p !== downloadPath);

    const stack = new Stack();

    // WHEN
    new AwsCliLayer(stack, 'MyLayer');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
      Description: '/opt/awscli/aws',
    });
  });
});