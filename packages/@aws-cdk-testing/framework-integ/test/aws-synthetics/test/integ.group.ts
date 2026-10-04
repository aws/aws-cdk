/// !cdk-integ synthetics-group

import * as cdk from 'aws-cdk-lib/core';
import { Canary, Code, Group, Runtime, Test } from 'aws-cdk-lib/aws-synthetics';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'synthetics-group');

const canary1 = new Canary(stack, 'TestCanary1', {
  test: Test.custom({
    code: Code.fromInline(`
      const synthetics = require('Synthetics');
      const log = require('SyntheticsLogger');
      
      const basicCustomEntryPoint = async function () {
        log.info('Starting basic canary test');
        return await synthetics.executeStep('checkHomepage', async function () {
          const page = await synthetics.getPage();
          const response = await page.goto('https://example.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
          await synthetics.takeScreenshot('homepage', 'loaded');
          if (response.status() !== 200) {
            throw 'Failed to load page!';
          }
        });
      };
      
      exports.handler = async () => {
        return await synthetics.executeStep('basicCustomEntryPoint', basicCustomEntryPoint);
      };
    `),
    handler: 'index.handler',
  }),
  runtime: Runtime.SYNTHETICS_NODEJS_PUPPETEER_6_2,
  canaryName: 'test-canary-1-for-group',
});

const canary2 = new Canary(stack, 'TestCanary2', {
  test: Test.custom({
    code: Code.fromInline(`
      const synthetics = require('Synthetics');
      const log = require('SyntheticsLogger');
      
      const basicCustomEntryPoint = async function () {
        log.info('Starting second canary test');
        return await synthetics.executeStep('checkAPI', async function () {
          const page = await synthetics.getPage();
          const response = await page.goto('https://httpbin.org/get', { waitUntil: 'domcontentloaded', timeout: 30000 });
          await synthetics.takeScreenshot('api', 'loaded');
          if (response.status() !== 200) {
            throw 'Failed to load API!';
          }
        });
      };
      
      exports.handler = async () => {
        return await synthetics.executeStep('basicCustomEntryPoint', basicCustomEntryPoint);
      };
    `),
    handler: 'index.handler',
  }),
  runtime: Runtime.SYNTHETICS_NODEJS_PUPPETEER_6_2,
  canaryName: 'test-canary-2-for-group',
});

new Group(stack, 'TestGroup', {
  groupName: 'test-canary-group',
  canaries: [canary1, canary2],
});

new IntegTest(app, 'SyntheticsGroupIntegTest', {
  testCases: [stack],
});
