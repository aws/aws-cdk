/* eslint-disable @typescript-eslint/no-require-imports */
import { execSync } from 'child_process';

const url = process.env.TEST_URL;
const setupBrowser = async () => {
  execSync('HOME=/tmp npm install puppeteer-core @sparticuz/chromium --omit=dev --no-package-lock --no-save --prefix /tmp');
  const puppeteer = require('/tmp/node_modules/puppeteer-core');
  const chromium = require('/tmp/node_modules/@sparticuz/chromium');
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  return browser;
};

export const handler: AWSLambda.Handler = async (_event) => {
  const browser = await setupBrowser();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: ['load', 'networkidle0'],
    timeout: 30000,
  });
  await page.type("div.visible-lg input[name='username']", process.env.TEST_USERNAME);
  await page.type("div.visible-lg input[name='password']", process.env.TEST_PASSWORD);
  await page.click("div.visible-lg input[type='submit']");
  const body = await page.waitForSelector('body');
  const textContent = await body.evaluate((el: any) => el.textContent);
  return textContent;
};
