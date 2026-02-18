const synthetics = require('Synthetics');

const handler = async () => {
  return await synthetics.executeStep('step1', async function () {
    // Test step for puppeteer 11.0+ root-level validation
    console.log('Testing puppeteer 11.0+ with root-level JS file');
  });
};

exports.handler = handler;