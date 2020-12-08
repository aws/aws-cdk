const path = require('path');
const cdkHelpers = require('./cdk-helpers');

describe('mono CDK', () => {
    beforeAll(() => {
        // disallow requiring @aws-cdk/core,
        // so that these tests work from the repository too
        jest.mock('@aws-cdk/core', () => {
            throw new Error('@aws-cdk/core is not available in monocdk tests!');
        });
    });

    beforeAll(async () => {
        const frameworkVersion = process.env.FRAMEWORK_VERSION;
        const packageVersion = frameworkVersion ? `@${frameworkVersion}` : '';
        await cdkHelpers.shell(['npm', 'install', `monocdk${packageVersion}`]);
    });

    test('cloudformation-include works with monocdk module', () => {
        const module = 'monocdk';
        const core = require(`${module}`);
        const cfn_inc = require(`${module}/cloudformation-include`);

        const stack = new core.Stack();
        const cfnInclude = new cfn_inc.CfnInclude(stack, 'Template', {
            templateFile: path.join(__dirname, 'cfn-include', 'example-template.json'),
        });
        const cfnBucket = cfnInclude.getResource('Bucket');

        expect(cfnBucket.bucketName).toEqual('my-example-bucket');
    });
});
