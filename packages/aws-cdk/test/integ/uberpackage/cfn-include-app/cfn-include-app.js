const path = require('path');

const uberPackage = process.env.UBERPACKAGE;
if (!uberPackage) {
  throw new Error('The UBERPACKAGE environment variable is required for running this app!');
}

const cfn_inc = require(`${uberPackage}/cloudformation-include`);
const core = require(`${uberPackage}`);

const app = new core.App();
const stack = new core.Stack(app, 'Stack');
const cfnInclude = new cfn_inc.CfnInclude(stack, 'Template', {
  templateFile: path.join(__dirname, 'example-template.json'),
});
const cfnBucket = cfnInclude.getResource('Bucket');
if (cfnBucket.bucketName !== 'my-example-bucket') {
  throw new Error(`Expected bucketName to be 'my-example-bucket', got: '${cfnBucket.bucketName}'`);
}

app.synth();
