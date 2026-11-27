import * as fs from 'fs';
import * as path from 'path';

// The bundle is built by `yarn bundle` (the cdk-build `pre` step).
const bundlePath = path.join(__dirname, '..', '..', '..', 'lib', 'assertions', 'providers', 'lambda-handler.bundle', 'index.js');
const bundle = fs.readFileSync(bundlePath, 'utf-8');

test('assertions handler bundle loads the AWS SDK from the Lambda runtime', () => {
  expect(bundle).toContain('require("@aws-sdk/client-sfn")');
  expect(bundle).not.toContain('node_modules/@aws-sdk/');
  expect(bundle).not.toContain('node_modules/@smithy/');
});
