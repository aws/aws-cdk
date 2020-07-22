import * as cdk from '@aws-cdk/core';
import * as synthetics from '../lib';

/*
 * Stack verification steps:
 *
 * -- aws synthetics get-canary --name myfirstcanary has a state of 'RUNNING'
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-canary-test');

new synthetics.Canary(stack, 'mycanary', {
  name: 'myfirstcanary',
  test: synthetics.Test.custom(stack, {
    code: synthetics.Code.fromInline('var synthetics = require(\'Synthetics\');\nconst log = require(\'SyntheticsLogger\');\n\nconst pageLoadBlueprint = async function () {\n\n    // INSERT URL here\n    const URL = \"https://amazon.com\";\n\n    let page = await synthetics.getPage();\n    const response = await page.goto(URL, {waitUntil: \'domcontentloaded\', timeout: 30000});\n    //Wait for page to render.\n    //Increase or decrease wait time based on endpoint being monitored.\n    await page.waitFor(15000);\n    await synthetics.takeScreenshot(\'loaded\', \'loaded\');\n    let pageTitle = await page.title();\n    log.info(\'Page title: \' + pageTitle);\n    if (response.status() !== 200) {\n        throw \"Failed to load page!\";\n    }\n};\n\nexports.handler = async () => {\n    return await pageLoadBlueprint();\n};\n'),
    handler: 'index.handler',
  }),
});

app.synth();