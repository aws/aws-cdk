"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const evaluate_cfn_1 = require("./evaluate-cfn");
const util_1 = require("./util");
const lib_1 = require("../lib");
const intrinsic_1 = require("../lib/private/intrinsic");
describe('arn', () => {
    test('create from components with defaults', () => {
        const stack = new lib_1.Stack();
        const arn = stack.formatArn({
            service: 'sqs',
            resource: 'myqueuename',
        });
        const pseudo = new lib_1.ScopedAws(stack);
        expect(stack.resolve(arn)).toEqual(stack.resolve(`arn:${pseudo.partition}:sqs:${pseudo.region}:${pseudo.accountId}:myqueuename`));
    });
    test('cannot rely on defaults when stack not known', () => {
        expect(() => lib_1.Arn.format({
            service: 'sqs',
            resource: 'myqueuename',
        })).toThrow(/must all be passed if stack is not/);
    });
    test('create from components with specific values for the various components', () => {
        const stack = new lib_1.Stack();
        const arn = stack.formatArn({
            service: 'dynamodb',
            resource: 'table',
            account: '123456789012',
            region: 'us-east-1',
            partition: 'aws-cn',
            resourceName: 'mytable/stream/label',
        });
        expect(stack.resolve(arn)).toEqual('arn:aws-cn:dynamodb:us-east-1:123456789012:table/mytable/stream/label');
    });
    test('allow empty string in components', () => {
        const stack = new lib_1.Stack();
        const arn = stack.formatArn({
            service: 's3',
            resource: 'my-bucket',
            account: '',
            region: '',
            partition: 'aws-cn',
        });
        expect(stack.resolve(arn)).toEqual('arn:aws-cn:s3:::my-bucket');
    });
    cdk_build_tools_1.testDeprecated('resourcePathSep can be set to ":" instead of the default "/"', () => {
        const stack = new lib_1.Stack();
        const arn = stack.formatArn({
            service: 'codedeploy',
            resource: 'application',
            sep: ':',
            resourceName: 'WordPress_App',
        });
        const pseudo = new lib_1.ScopedAws(stack);
        expect(stack.resolve(arn)).toEqual(stack.resolve(`arn:${pseudo.partition}:codedeploy:${pseudo.region}:${pseudo.accountId}:application:WordPress_App`));
    });
    cdk_build_tools_1.testDeprecated('resourcePathSep can be set to "" instead of the default "/"', () => {
        const stack = new lib_1.Stack();
        const arn = stack.formatArn({
            service: 'ssm',
            resource: 'parameter',
            sep: '',
            resourceName: '/parameter-name',
        });
        const pseudo = new lib_1.ScopedAws(stack);
        expect(stack.resolve(arn)).toEqual(stack.resolve(`arn:${pseudo.partition}:ssm:${pseudo.region}:${pseudo.accountId}:parameter/parameter-name`));
    });
    test('fails if resourcePathSep is neither ":" nor "/"', () => {
        const stack = new lib_1.Stack();
        expect(() => stack.formatArn({
            service: 'foo',
            resource: 'bar',
            sep: 'x',
        })).toThrow();
    });
    cdk_build_tools_1.describeDeprecated('Arn.parse(s)', () => {
        describe('fails', () => {
            test('if doesn\'t start with "arn:"', () => {
                const stack = new lib_1.Stack();
                expect(() => stack.parseArn('barn:foo:x:a:1:2')).toThrow(/ARNs must start with "arn:".*barn:foo/);
            });
            test('if the ARN doesnt have enough components', () => {
                const stack = new lib_1.Stack();
                expect(() => stack.parseArn('arn:is:too:short')).toThrow(/The `resource` component \(6th component\) of an ARN is required/);
            });
            test('if "service" is not specified', () => {
                const stack = new lib_1.Stack();
                expect(() => stack.parseArn('arn:aws::4:5:6')).toThrow(/The `service` component \(3rd component\) of an ARN is required/);
            });
            test('if "resource" is not specified', () => {
                const stack = new lib_1.Stack();
                expect(() => stack.parseArn('arn:aws:service:::')).toThrow(/The `resource` component \(6th component\) of an ARN is required/);
            });
        });
        test('various successful parses', () => {
            const stack = new lib_1.Stack();
            const tests = {
                'arn:aws:a4b:region:accountid:resourcetype/resource': {
                    partition: 'aws',
                    service: 'a4b',
                    region: 'region',
                    account: 'accountid',
                    resource: 'resourcetype',
                    resourceName: 'resource',
                    sep: '/',
                    arnFormat: lib_1.ArnFormat.SLASH_RESOURCE_NAME,
                },
                'arn:aws:apigateway:us-east-1::a123456789012bc3de45678901f23a45:/test/mydemoresource/*': {
                    partition: 'aws',
                    service: 'apigateway',
                    region: 'us-east-1',
                    account: '',
                    resource: 'a123456789012bc3de45678901f23a45',
                    sep: ':',
                    resourceName: '/test/mydemoresource/*',
                    arnFormat: lib_1.ArnFormat.COLON_RESOURCE_NAME,
                },
                'arn:aws-cn:cloud9::123456789012:environment:81e900317347585a0601e04c8d52eaEX': {
                    partition: 'aws-cn',
                    service: 'cloud9',
                    region: '',
                    account: '123456789012',
                    resource: 'environment',
                    resourceName: '81e900317347585a0601e04c8d52eaEX',
                    sep: ':',
                    arnFormat: lib_1.ArnFormat.COLON_RESOURCE_NAME,
                },
                'arn:aws:cognito-sync:::identitypool/us-east-1:1a1a1a1a-ffff-1111-9999-12345678:bla': {
                    service: 'cognito-sync',
                    region: '',
                    account: '',
                    partition: 'aws',
                    resource: 'identitypool',
                    resourceName: 'us-east-1:1a1a1a1a-ffff-1111-9999-12345678:bla',
                    sep: '/',
                    arnFormat: lib_1.ArnFormat.SLASH_RESOURCE_NAME,
                    // ToDo: does not work currently, because we split on ':' first, which are present in resourceName here
                    checkCfnEncoding: false,
                },
                'arn:aws:servicecatalog:us-east-1:123456789012:/applications/0aqmvxvgmry0ecc4mjhwypun6i': {
                    resource: 'applications',
                    resourceName: '0aqmvxvgmry0ecc4mjhwypun6i',
                    sep: '/',
                    service: 'servicecatalog',
                    region: 'us-east-1',
                    account: '123456789012',
                    partition: 'aws',
                    arnFormat: lib_1.ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME,
                },
                'arn:aws:s3:::my_corporate_bucket': {
                    partition: 'aws',
                    service: 's3',
                    region: '',
                    account: '',
                    resource: 'my_corporate_bucket',
                    arnFormat: lib_1.ArnFormat.NO_RESOURCE_NAME,
                },
                'arn:aws:s3:::my_corporate_bucket/object.zip': {
                    partition: 'aws',
                    service: 's3',
                    region: '',
                    account: '',
                    resource: 'my_corporate_bucket/object.zip',
                    arnFormat: lib_1.ArnFormat.NO_RESOURCE_NAME,
                },
            };
            for (const [arn, expectedComponents] of Object.entries(tests)) {
                const skipCheckingCfnEncoding = expectedComponents.checkCfnEncoding === false;
                // delete the extra field so it doesn't screw up the equality comparison
                delete expectedComponents.checkCfnEncoding;
                // test the basic case
                const parsedComponents = stack.splitArn(arn, expectedComponents.arnFormat);
                expect(parsedComponents).toEqual(expectedComponents);
                // test the round-trip
                expect(stack.formatArn(parsedComponents)).toEqual(arn);
                // test that the CloudFormation functions we generate evaluate to the correct value
                if (skipCheckingCfnEncoding) {
                    continue;
                }
                const tokenArnComponents = stack.splitArn(lib_1.Token.asString(new intrinsic_1.Intrinsic({ Ref: 'TheArn' })), parsedComponents.arnFormat);
                const cfnArnComponents = stack.resolve(tokenArnComponents);
                const evaluatedArnComponents = evaluate_cfn_1.evaluateCFN(cfnArnComponents, { TheArn: arn });
                expect(evaluatedArnComponents).toEqual(parsedComponents);
            }
        });
        test('a Token with : separator', () => {
            const stack = new lib_1.Stack();
            const theToken = { Ref: 'SomeParameter' };
            const parsed = stack.parseArn(new intrinsic_1.Intrinsic(theToken).toString(), ':');
            expect(stack.resolve(parsed.partition)).toEqual({ 'Fn::Select': [1, { 'Fn::Split': [':', theToken] }] });
            expect(stack.resolve(parsed.service)).toEqual({ 'Fn::Select': [2, { 'Fn::Split': [':', theToken] }] });
            expect(stack.resolve(parsed.region)).toEqual({ 'Fn::Select': [3, { 'Fn::Split': [':', theToken] }] });
            expect(stack.resolve(parsed.account)).toEqual({ 'Fn::Select': [4, { 'Fn::Split': [':', theToken] }] });
            expect(stack.resolve(parsed.resource)).toEqual({ 'Fn::Select': [5, { 'Fn::Split': [':', theToken] }] });
            expect(stack.resolve(parsed.resourceName)).toEqual({ 'Fn::Select': [6, { 'Fn::Split': [':', theToken] }] });
            expect(parsed.sep).toEqual(':');
        });
        test('a Token with / separator', () => {
            const stack = new lib_1.Stack();
            const theToken = { Ref: 'SomeParameter' };
            const parsed = stack.parseArn(new intrinsic_1.Intrinsic(theToken).toString());
            expect(parsed.sep).toEqual('/');
            // eslint-disable-next-line max-len
            expect(stack.resolve(parsed.resource)).toEqual({ 'Fn::Select': [0, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', theToken] }] }] }] });
            // eslint-disable-next-line max-len
            expect(stack.resolve(parsed.resourceName)).toEqual({ 'Fn::Select': [1, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', theToken] }] }] }] });
        });
        test('extracting resource name from a complex ARN', () => {
            // GIVEN
            const stack = new lib_1.Stack();
            const theToken = lib_1.Token.asString({ Ref: 'SomeParameter' });
            // WHEN
            const parsed = lib_1.Arn.extractResourceName(theToken, 'role');
            // THEN
            expect(evaluate_cfn_1.evaluateCFN(stack.resolve(parsed), {
                SomeParameter: 'arn:aws:iam::111111111111:role/path/to/role/name',
            })).toEqual('path/to/role/name');
        });
        test('extractResourceName validates resource type if possible', () => {
            // WHEN
            expect(() => {
                lib_1.Arn.extractResourceName('arn:aws:iam::111111111111:banana/rama', 'role');
            }).toThrow(/Expected resource type/);
        });
        test('returns empty string ARN components', () => {
            const stack = new lib_1.Stack();
            const arn = 'arn:aws:iam::123456789012:role/abc123';
            const expected = {
                partition: 'aws',
                service: 'iam',
                region: '',
                account: '123456789012',
                resource: 'role',
                resourceName: 'abc123',
                sep: '/',
                arnFormat: lib_1.ArnFormat.SLASH_RESOURCE_NAME,
            };
            expect(stack.parseArn(arn)).toEqual(expected);
        });
    });
    test('can use a fully specified ARN from a different stack without incurring an import', () => {
        // GIVEN
        const stack1 = new lib_1.Stack(undefined, 'Stack1', { env: { account: '12345678', region: 'us-turbo-5' } });
        const stack2 = new lib_1.Stack(undefined, 'Stack2', { env: { account: '87654321', region: 'us-turbo-1' } });
        // WHEN
        const arn = stack1.formatArn({
            // No partition specified here
            service: 'bla',
            resource: 'thing',
            resourceName: 'thong',
        });
        new lib_1.CfnOutput(stack2, 'SomeValue', { value: arn });
        // THEN
        expect(util_1.toCloudFormation(stack2)).toEqual({
            Outputs: {
                SomeValue: {
                    Value: {
                        // Look ma, no Fn::ImportValue!
                        'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':bla:us-turbo-5:12345678:thing/thong']],
                    },
                },
            },
        });
    });
    cdk_build_tools_1.testDeprecated('parse other fields if only some are tokens', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        // WHEN
        const parsed = stack.parseArn(`arn:${lib_1.Aws.PARTITION}:iam::123456789012:role/S3Access`);
        // THEN
        expect(stack.resolve(parsed.partition)).toEqual({ Ref: 'AWS::Partition' });
        expect(stack.resolve(parsed.service)).toEqual('iam');
        expect(stack.resolve(parsed.region)).toEqual('');
        expect(stack.resolve(parsed.account)).toEqual('123456789012');
        expect(stack.resolve(parsed.resource)).toEqual('role');
        expect(stack.resolve(parsed.resourceName)).toEqual('S3Access');
        expect(parsed.sep).toEqual('/');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJuLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcm4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhEQUE4RTtBQUM5RSxpREFBNkM7QUFDN0MsaUNBQTBDO0FBQzFDLGdDQUFnRztBQUNoRyx3REFBcUQ7QUFFckQsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDbkIsSUFBSSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtRQUNoRCxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBRTFCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDMUIsT0FBTyxFQUFFLEtBQUs7WUFDZCxRQUFRLEVBQUUsYUFBYTtTQUN4QixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVwQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FDaEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLFFBQVEsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ25HLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtRQUN4RCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQ1YsU0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNULE9BQU8sRUFBRSxLQUFLO1lBQ2QsUUFBUSxFQUFFLGFBQWE7U0FDeEIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsd0VBQXdFLEVBQUUsR0FBRyxFQUFFO1FBQ2xGLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFFMUIsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUMxQixPQUFPLEVBQUUsVUFBVTtZQUNuQixRQUFRLEVBQUUsT0FBTztZQUNqQixPQUFPLEVBQUUsY0FBYztZQUN2QixNQUFNLEVBQUUsV0FBVztZQUNuQixTQUFTLEVBQUUsUUFBUTtZQUNuQixZQUFZLEVBQUUsc0JBQXNCO1NBQ3JDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUNoQyx1RUFBdUUsQ0FBQyxDQUFDO0lBQzdFLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtRQUM1QyxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBRTFCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDMUIsT0FBTyxFQUFFLElBQUk7WUFDYixRQUFRLEVBQUUsV0FBVztZQUNyQixPQUFPLEVBQUUsRUFBRTtZQUNYLE1BQU0sRUFBRSxFQUFFO1lBQ1YsU0FBUyxFQUFFLFFBQVE7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQ2hDLDJCQUEyQixDQUFDLENBQUM7SUFDakMsQ0FBQyxDQUFDLENBQUM7SUFFSCxnQ0FBYyxDQUFDLDhEQUE4RCxFQUFFLEdBQUcsRUFBRTtRQUNsRixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBRTFCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDMUIsT0FBTyxFQUFFLFlBQVk7WUFDckIsUUFBUSxFQUFFLGFBQWE7WUFDdkIsR0FBRyxFQUFFLEdBQUc7WUFDUixZQUFZLEVBQUUsZUFBZTtTQUM5QixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVwQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FDaEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLGVBQWUsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7SUFDeEgsQ0FBQyxDQUFDLENBQUM7SUFFSCxnQ0FBYyxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtRQUNqRixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBRTFCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDMUIsT0FBTyxFQUFFLEtBQUs7WUFDZCxRQUFRLEVBQUUsV0FBVztZQUNyQixHQUFHLEVBQUUsRUFBRTtZQUNQLFlBQVksRUFBRSxpQkFBaUI7U0FDaEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFcEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQ2hDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxNQUFNLENBQUMsU0FBUyxRQUFRLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDO0lBQ2hILENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlEQUFpRCxFQUFFLEdBQUcsRUFBRTtRQUMzRCxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBRTFCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQzNCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsUUFBUSxFQUFFLEtBQUs7WUFDZixHQUFHLEVBQUUsR0FBRztTQUNULENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBRUgsb0NBQWtCLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUV0QyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNyQixJQUFJLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO2dCQUN6QyxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO2dCQUMxQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7WUFFcEcsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO2dCQUNwRCxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO2dCQUMxQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtFQUFrRSxDQUFDLENBQUM7WUFDL0gsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO2dCQUN6QyxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO2dCQUMxQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlFQUFpRSxDQUFDLENBQUM7WUFDNUgsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO2dCQUMxQyxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO2dCQUMxQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtFQUFrRSxDQUFDLENBQUM7WUFDakksQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7WUFNckMsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLEtBQUssR0FBeUM7Z0JBQ2xELG9EQUFvRCxFQUFFO29CQUNwRCxTQUFTLEVBQUUsS0FBSztvQkFDaEIsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLE9BQU8sRUFBRSxXQUFXO29CQUNwQixRQUFRLEVBQUUsY0FBYztvQkFDeEIsWUFBWSxFQUFFLFVBQVU7b0JBQ3hCLEdBQUcsRUFBRSxHQUFHO29CQUNSLFNBQVMsRUFBRSxlQUFTLENBQUMsbUJBQW1CO2lCQUN6QztnQkFDRCx1RkFBdUYsRUFBRTtvQkFDdkYsU0FBUyxFQUFFLEtBQUs7b0JBQ2hCLE9BQU8sRUFBRSxZQUFZO29CQUNyQixNQUFNLEVBQUUsV0FBVztvQkFDbkIsT0FBTyxFQUFFLEVBQUU7b0JBQ1gsUUFBUSxFQUFFLGtDQUFrQztvQkFDNUMsR0FBRyxFQUFFLEdBQUc7b0JBQ1IsWUFBWSxFQUFFLHdCQUF3QjtvQkFDdEMsU0FBUyxFQUFFLGVBQVMsQ0FBQyxtQkFBbUI7aUJBQ3pDO2dCQUNELDhFQUE4RSxFQUFFO29CQUM5RSxTQUFTLEVBQUUsUUFBUTtvQkFDbkIsT0FBTyxFQUFFLFFBQVE7b0JBQ2pCLE1BQU0sRUFBRSxFQUFFO29CQUNWLE9BQU8sRUFBRSxjQUFjO29CQUN2QixRQUFRLEVBQUUsYUFBYTtvQkFDdkIsWUFBWSxFQUFFLGtDQUFrQztvQkFDaEQsR0FBRyxFQUFFLEdBQUc7b0JBQ1IsU0FBUyxFQUFFLGVBQVMsQ0FBQyxtQkFBbUI7aUJBQ3pDO2dCQUNELG9GQUFvRixFQUFFO29CQUNwRixPQUFPLEVBQUUsY0FBYztvQkFDdkIsTUFBTSxFQUFFLEVBQUU7b0JBQ1YsT0FBTyxFQUFFLEVBQUU7b0JBQ1gsU0FBUyxFQUFFLEtBQUs7b0JBQ2hCLFFBQVEsRUFBRSxjQUFjO29CQUN4QixZQUFZLEVBQUUsZ0RBQWdEO29CQUM5RCxHQUFHLEVBQUUsR0FBRztvQkFDUixTQUFTLEVBQUUsZUFBUyxDQUFDLG1CQUFtQjtvQkFDeEMsdUdBQXVHO29CQUN2RyxnQkFBZ0IsRUFBRSxLQUFLO2lCQUN4QjtnQkFDRCx3RkFBd0YsRUFBRTtvQkFDeEYsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFlBQVksRUFBRSw0QkFBNEI7b0JBQzFDLEdBQUcsRUFBRSxHQUFHO29CQUNSLE9BQU8sRUFBRSxnQkFBZ0I7b0JBQ3pCLE1BQU0sRUFBRSxXQUFXO29CQUNuQixPQUFPLEVBQUUsY0FBYztvQkFDdkIsU0FBUyxFQUFFLEtBQUs7b0JBQ2hCLFNBQVMsRUFBRSxlQUFTLENBQUMsa0NBQWtDO2lCQUN4RDtnQkFDRCxrQ0FBa0MsRUFBRTtvQkFDbEMsU0FBUyxFQUFFLEtBQUs7b0JBQ2hCLE9BQU8sRUFBRSxJQUFJO29CQUNiLE1BQU0sRUFBRSxFQUFFO29CQUNWLE9BQU8sRUFBRSxFQUFFO29CQUNYLFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFNBQVMsRUFBRSxlQUFTLENBQUMsZ0JBQWdCO2lCQUN0QztnQkFDRCw2Q0FBNkMsRUFBRTtvQkFDN0MsU0FBUyxFQUFFLEtBQUs7b0JBQ2hCLE9BQU8sRUFBRSxJQUFJO29CQUNiLE1BQU0sRUFBRSxFQUFFO29CQUNWLE9BQU8sRUFBRSxFQUFFO29CQUNYLFFBQVEsRUFBRSxnQ0FBZ0M7b0JBQzFDLFNBQVMsRUFBRSxlQUFTLENBQUMsZ0JBQWdCO2lCQUN0QzthQUNGLENBQUM7WUFFRixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM3RCxNQUFNLHVCQUF1QixHQUFHLGtCQUFrQixDQUFDLGdCQUFnQixLQUFLLEtBQUssQ0FBQztnQkFDOUUsd0VBQXdFO2dCQUN4RSxPQUFPLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDO2dCQUUzQyxzQkFBc0I7Z0JBQ3RCLE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLENBQUMsU0FBVSxDQUFDLENBQUM7Z0JBQzVFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUVyRCxzQkFBc0I7Z0JBQ3RCLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXZELG1GQUFtRjtnQkFDbkYsSUFBSSx1QkFBdUIsRUFBRTtvQkFDM0IsU0FBUztpQkFDVjtnQkFDRCxNQUFNLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxRQUFRLENBQ3ZDLFdBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxxQkFBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFDaEQsZ0JBQWdCLENBQUMsU0FBVSxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLHNCQUFzQixHQUFHLDBCQUFXLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDOUUsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7YUFDMUQ7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDcEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLFFBQVEsR0FBRyxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsQ0FBQztZQUMxQyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUkscUJBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUV2RSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN6RyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN2RyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0RyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN2RyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4RyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFD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QyxDQUFDO1FBQy9ELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZXNjcmliZURlcHJlY2F0ZWQsIHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCB7IGV2YWx1YXRlQ0ZOIH0gZnJvbSAnLi9ldmFsdWF0ZS1jZm4nO1xuaW1wb3J0IHsgdG9DbG91ZEZvcm1hdGlvbiB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBBcm4sIEFybkNvbXBvbmVudHMsIEFybkZvcm1hdCwgQXdzLCBDZm5PdXRwdXQsIFNjb3BlZEF3cywgU3RhY2ssIFRva2VuIH0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IEludHJpbnNpYyB9IGZyb20gJy4uL2xpYi9wcml2YXRlL2ludHJpbnNpYyc7XG5cbmRlc2NyaWJlKCdhcm4nLCAoKSA9PiB7XG4gIHRlc3QoJ2NyZWF0ZSBmcm9tIGNvbXBvbmVudHMgd2l0aCBkZWZhdWx0cycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgYXJuID0gc3RhY2suZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdzcXMnLFxuICAgICAgcmVzb3VyY2U6ICdteXF1ZXVlbmFtZScsXG4gICAgfSk7XG5cbiAgICBjb25zdCBwc2V1ZG8gPSBuZXcgU2NvcGVkQXdzKHN0YWNrKTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGFybikpLnRvRXF1YWwoXG4gICAgICBzdGFjay5yZXNvbHZlKGBhcm46JHtwc2V1ZG8ucGFydGl0aW9ufTpzcXM6JHtwc2V1ZG8ucmVnaW9ufToke3BzZXVkby5hY2NvdW50SWR9Om15cXVldWVuYW1lYCkpO1xuICB9KTtcblxuICB0ZXN0KCdjYW5ub3QgcmVseSBvbiBkZWZhdWx0cyB3aGVuIHN0YWNrIG5vdCBrbm93bicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT5cbiAgICAgIEFybi5mb3JtYXQoe1xuICAgICAgICBzZXJ2aWNlOiAnc3FzJyxcbiAgICAgICAgcmVzb3VyY2U6ICdteXF1ZXVlbmFtZScsXG4gICAgICB9KSkudG9UaHJvdygvbXVzdCBhbGwgYmUgcGFzc2VkIGlmIHN0YWNrIGlzIG5vdC8pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgZnJvbSBjb21wb25lbnRzIHdpdGggc3BlY2lmaWMgdmFsdWVzIGZvciB0aGUgdmFyaW91cyBjb21wb25lbnRzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBhcm4gPSBzdGFjay5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2R5bmFtb2RiJyxcbiAgICAgIHJlc291cmNlOiAndGFibGUnLFxuICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgcGFydGl0aW9uOiAnYXdzLWNuJyxcbiAgICAgIHJlc291cmNlTmFtZTogJ215dGFibGUvc3RyZWFtL2xhYmVsJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGFybikpLnRvRXF1YWwoXG4gICAgICAnYXJuOmF3cy1jbjpkeW5hbW9kYjp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOnRhYmxlL215dGFibGUvc3RyZWFtL2xhYmVsJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93IGVtcHR5IHN0cmluZyBpbiBjb21wb25lbnRzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBhcm4gPSBzdGFjay5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ3MzJyxcbiAgICAgIHJlc291cmNlOiAnbXktYnVja2V0JyxcbiAgICAgIGFjY291bnQ6ICcnLFxuICAgICAgcmVnaW9uOiAnJyxcbiAgICAgIHBhcnRpdGlvbjogJ2F3cy1jbicsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShhcm4pKS50b0VxdWFsKFxuICAgICAgJ2Fybjphd3MtY246czM6OjpteS1idWNrZXQnKTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ3Jlc291cmNlUGF0aFNlcCBjYW4gYmUgc2V0IHRvIFwiOlwiIGluc3RlYWQgb2YgdGhlIGRlZmF1bHQgXCIvXCInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGFybiA9IHN0YWNrLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnY29kZWRlcGxveScsXG4gICAgICByZXNvdXJjZTogJ2FwcGxpY2F0aW9uJyxcbiAgICAgIHNlcDogJzonLFxuICAgICAgcmVzb3VyY2VOYW1lOiAnV29yZFByZXNzX0FwcCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBwc2V1ZG8gPSBuZXcgU2NvcGVkQXdzKHN0YWNrKTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGFybikpLnRvRXF1YWwoXG4gICAgICBzdGFjay5yZXNvbHZlKGBhcm46JHtwc2V1ZG8ucGFydGl0aW9ufTpjb2RlZGVwbG95OiR7cHNldWRvLnJlZ2lvbn06JHtwc2V1ZG8uYWNjb3VudElkfTphcHBsaWNhdGlvbjpXb3JkUHJlc3NfQXBwYCkpO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgncmVzb3VyY2VQYXRoU2VwIGNhbiBiZSBzZXQgdG8gXCJcIiBpbnN0ZWFkIG9mIHRoZSBkZWZhdWx0IFwiL1wiJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBhcm4gPSBzdGFjay5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ3NzbScsXG4gICAgICByZXNvdXJjZTogJ3BhcmFtZXRlcicsXG4gICAgICBzZXA6ICcnLFxuICAgICAgcmVzb3VyY2VOYW1lOiAnL3BhcmFtZXRlci1uYW1lJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBzZXVkbyA9IG5ldyBTY29wZWRBd3Moc3RhY2spO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYXJuKSkudG9FcXVhbChcbiAgICAgIHN0YWNrLnJlc29sdmUoYGFybjoke3BzZXVkby5wYXJ0aXRpb259OnNzbToke3BzZXVkby5yZWdpb259OiR7cHNldWRvLmFjY291bnRJZH06cGFyYW1ldGVyL3BhcmFtZXRlci1uYW1lYCkpO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiByZXNvdXJjZVBhdGhTZXAgaXMgbmVpdGhlciBcIjpcIiBub3IgXCIvXCInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGV4cGVjdCgoKSA9PiBzdGFjay5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2ZvbycsXG4gICAgICByZXNvdXJjZTogJ2JhcicsXG4gICAgICBzZXA6ICd4JyxcbiAgICB9KSkudG9UaHJvdygpO1xuICB9KTtcblxuICBkZXNjcmliZURlcHJlY2F0ZWQoJ0Fybi5wYXJzZShzKScsICgpID0+IHtcblxuICAgIGRlc2NyaWJlKCdmYWlscycsICgpID0+IHtcbiAgICAgIHRlc3QoJ2lmIGRvZXNuXFwndCBzdGFydCB3aXRoIFwiYXJuOlwiJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgICBleHBlY3QoKCkgPT4gc3RhY2sucGFyc2VBcm4oJ2Jhcm46Zm9vOng6YToxOjInKSkudG9UaHJvdygvQVJOcyBtdXN0IHN0YXJ0IHdpdGggXCJhcm46XCIuKmJhcm46Zm9vLyk7XG5cbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdpZiB0aGUgQVJOIGRvZXNudCBoYXZlIGVub3VnaCBjb21wb25lbnRzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgICBleHBlY3QoKCkgPT4gc3RhY2sucGFyc2VBcm4oJ2Fybjppczp0b286c2hvcnQnKSkudG9UaHJvdygvVGhlIGByZXNvdXJjZWAgY29tcG9uZW50IFxcKDZ0aCBjb21wb25lbnRcXCkgb2YgYW4gQVJOIGlzIHJlcXVpcmVkLyk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnaWYgXCJzZXJ2aWNlXCIgaXMgbm90IHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgICAgZXhwZWN0KCgpID0+IHN0YWNrLnBhcnNlQXJuKCdhcm46YXdzOjo0OjU6NicpKS50b1Rocm93KC9UaGUgYHNlcnZpY2VgIGNvbXBvbmVudCBcXCgzcmQgY29tcG9uZW50XFwpIG9mIGFuIEFSTiBpcyByZXF1aXJlZC8pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2lmIFwicmVzb3VyY2VcIiBpcyBub3Qgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgICBleHBlY3QoKCkgPT4gc3RhY2sucGFyc2VBcm4oJ2Fybjphd3M6c2VydmljZTo6OicpKS50b1Rocm93KC9UaGUgYHJlc291cmNlYCBjb21wb25lbnQgXFwoNnRoIGNvbXBvbmVudFxcKSBvZiBhbiBBUk4gaXMgcmVxdWlyZWQvKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndmFyaW91cyBzdWNjZXNzZnVsIHBhcnNlcycsICgpID0+IHtcbiAgICAgIGludGVyZmFjZSBUZXN0QXJuQ29tcG9uZW50cyBleHRlbmRzIEFybkNvbXBvbmVudHMge1xuICAgICAgICAvKiogQGRlZmF1bHQgdHJ1ZSAqL1xuICAgICAgICBjaGVja0NmbkVuY29kaW5nPzogYm9vbGVhbjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHRlc3RzOiB7IFthcm46IHN0cmluZ106IFRlc3RBcm5Db21wb25lbnRzIH0gPSB7XG4gICAgICAgICdhcm46YXdzOmE0YjpyZWdpb246YWNjb3VudGlkOnJlc291cmNldHlwZS9yZXNvdXJjZSc6IHtcbiAgICAgICAgICBwYXJ0aXRpb246ICdhd3MnLFxuICAgICAgICAgIHNlcnZpY2U6ICdhNGInLFxuICAgICAgICAgIHJlZ2lvbjogJ3JlZ2lvbicsXG4gICAgICAgICAgYWNjb3VudDogJ2FjY291bnRpZCcsXG4gICAgICAgICAgcmVzb3VyY2U6ICdyZXNvdXJjZXR5cGUnLFxuICAgICAgICAgIHJlc291cmNlTmFtZTogJ3Jlc291cmNlJyxcbiAgICAgICAgICBzZXA6ICcvJyxcbiAgICAgICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FLFxuICAgICAgICB9LFxuICAgICAgICAnYXJuOmF3czphcGlnYXRld2F5OnVzLWVhc3QtMTo6YTEyMzQ1Njc4OTAxMmJjM2RlNDU2Nzg5MDFmMjNhNDU6L3Rlc3QvbXlkZW1vcmVzb3VyY2UvKic6IHtcbiAgICAgICAgICBwYXJ0aXRpb246ICdhd3MnLFxuICAgICAgICAgIHNlcnZpY2U6ICdhcGlnYXRld2F5JyxcbiAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgIGFjY291bnQ6ICcnLFxuICAgICAgICAgIHJlc291cmNlOiAnYTEyMzQ1Njc4OTAxMmJjM2RlNDU2Nzg5MDFmMjNhNDUnLFxuICAgICAgICAgIHNlcDogJzonLFxuICAgICAgICAgIHJlc291cmNlTmFtZTogJy90ZXN0L215ZGVtb3Jlc291cmNlLyonLFxuICAgICAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgICAgIH0sXG4gICAgICAgICdhcm46YXdzLWNuOmNsb3VkOTo6MTIzNDU2Nzg5MDEyOmVudmlyb25tZW50OjgxZTkwMDMxNzM0NzU4NWEwNjAxZTA0YzhkNTJlYUVYJzoge1xuICAgICAgICAgIHBhcnRpdGlvbjogJ2F3cy1jbicsXG4gICAgICAgICAgc2VydmljZTogJ2Nsb3VkOScsXG4gICAgICAgICAgcmVnaW9uOiAnJyxcbiAgICAgICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgICAgICByZXNvdXJjZTogJ2Vudmlyb25tZW50JyxcbiAgICAgICAgICByZXNvdXJjZU5hbWU6ICc4MWU5MDAzMTczNDc1ODVhMDYwMWUwNGM4ZDUyZWFFWCcsXG4gICAgICAgICAgc2VwOiAnOicsXG4gICAgICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2Fybjphd3M6Y29nbml0by1zeW5jOjo6aWRlbnRpdHlwb29sL3VzLWVhc3QtMToxYTFhMWExYS1mZmZmLTExMTEtOTk5OS0xMjM0NTY3ODpibGEnOiB7XG4gICAgICAgICAgc2VydmljZTogJ2NvZ25pdG8tc3luYycsXG4gICAgICAgICAgcmVnaW9uOiAnJyxcbiAgICAgICAgICBhY2NvdW50OiAnJyxcbiAgICAgICAgICBwYXJ0aXRpb246ICdhd3MnLFxuICAgICAgICAgIHJlc291cmNlOiAnaWRlbnRpdHlwb29sJyxcbiAgICAgICAgICByZXNvdXJjZU5hbWU6ICd1cy1lYXN0LTE6MWExYTFhMWEtZmZmZi0xMTExLTk5OTktMTIzNDU2Nzg6YmxhJyxcbiAgICAgICAgICBzZXA6ICcvJyxcbiAgICAgICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FLFxuICAgICAgICAgIC8vIFRvRG86IGRvZXMgbm90IHdvcmsgY3VycmVudGx5LCBiZWNhdXNlIHdlIHNwbGl0IG9uICc6JyBmaXJzdCwgd2hpY2ggYXJlIHByZXNlbnQgaW4gcmVzb3VyY2VOYW1lIGhlcmVcbiAgICAgICAgICBjaGVja0NmbkVuY29kaW5nOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2Fybjphd3M6c2VydmljZWNhdGFsb2c6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjovYXBwbGljYXRpb25zLzBhcW12eHZnbXJ5MGVjYzRtamh3eXB1bjZpJzoge1xuICAgICAgICAgIHJlc291cmNlOiAnYXBwbGljYXRpb25zJyxcbiAgICAgICAgICByZXNvdXJjZU5hbWU6ICcwYXFtdnh2Z21yeTBlY2M0bWpod3lwdW42aScsXG4gICAgICAgICAgc2VwOiAnLycsXG4gICAgICAgICAgc2VydmljZTogJ3NlcnZpY2VjYXRhbG9nJyxcbiAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICAgIHBhcnRpdGlvbjogJ2F3cycsXG4gICAgICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfU0xBU0hfUkVTT1VSQ0VfTkFNRSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2Fybjphd3M6czM6OjpteV9jb3Jwb3JhdGVfYnVja2V0Jzoge1xuICAgICAgICAgIHBhcnRpdGlvbjogJ2F3cycsXG4gICAgICAgICAgc2VydmljZTogJ3MzJyxcbiAgICAgICAgICByZWdpb246ICcnLFxuICAgICAgICAgIGFjY291bnQ6ICcnLFxuICAgICAgICAgIHJlc291cmNlOiAnbXlfY29ycG9yYXRlX2J1Y2tldCcsXG4gICAgICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuTk9fUkVTT1VSQ0VfTkFNRSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2Fybjphd3M6czM6OjpteV9jb3Jwb3JhdGVfYnVja2V0L29iamVjdC56aXAnOiB7XG4gICAgICAgICAgcGFydGl0aW9uOiAnYXdzJyxcbiAgICAgICAgICBzZXJ2aWNlOiAnczMnLFxuICAgICAgICAgIHJlZ2lvbjogJycsXG4gICAgICAgICAgYWNjb3VudDogJycsXG4gICAgICAgICAgcmVzb3VyY2U6ICdteV9jb3Jwb3JhdGVfYnVja2V0L29iamVjdC56aXAnLFxuICAgICAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0Lk5PX1JFU09VUkNFX05BTUUsXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICBmb3IgKGNvbnN0IFthcm4sIGV4cGVjdGVkQ29tcG9uZW50c10gb2YgT2JqZWN0LmVudHJpZXModGVzdHMpKSB7XG4gICAgICAgIGNvbnN0IHNraXBDaGVja2luZ0NmbkVuY29kaW5nID0gZXhwZWN0ZWRDb21wb25lbnRzLmNoZWNrQ2ZuRW5jb2RpbmcgPT09IGZhbHNlO1xuICAgICAgICAvLyBkZWxldGUgdGhlIGV4dHJhIGZpZWxkIHNvIGl0IGRvZXNuJ3Qgc2NyZXcgdXAgdGhlIGVxdWFsaXR5IGNvbXBhcmlzb25cbiAgICAgICAgZGVsZXRlIGV4cGVjdGVkQ29tcG9uZW50cy5jaGVja0NmbkVuY29kaW5nO1xuXG4gICAgICAgIC8vIHRlc3QgdGhlIGJhc2ljIGNhc2VcbiAgICAgICAgY29uc3QgcGFyc2VkQ29tcG9uZW50cyA9IHN0YWNrLnNwbGl0QXJuKGFybiwgZXhwZWN0ZWRDb21wb25lbnRzLmFybkZvcm1hdCEpO1xuICAgICAgICBleHBlY3QocGFyc2VkQ29tcG9uZW50cykudG9FcXVhbChleHBlY3RlZENvbXBvbmVudHMpO1xuXG4gICAgICAgIC8vIHRlc3QgdGhlIHJvdW5kLXRyaXBcbiAgICAgICAgZXhwZWN0KHN0YWNrLmZvcm1hdEFybihwYXJzZWRDb21wb25lbnRzKSkudG9FcXVhbChhcm4pO1xuXG4gICAgICAgIC8vIHRlc3QgdGhhdCB0aGUgQ2xvdWRGb3JtYXRpb24gZnVuY3Rpb25zIHdlIGdlbmVyYXRlIGV2YWx1YXRlIHRvIHRoZSBjb3JyZWN0IHZhbHVlXG4gICAgICAgIGlmIChza2lwQ2hlY2tpbmdDZm5FbmNvZGluZykge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRva2VuQXJuQ29tcG9uZW50cyA9IHN0YWNrLnNwbGl0QXJuKFxuICAgICAgICAgIFRva2VuLmFzU3RyaW5nKG5ldyBJbnRyaW5zaWMoeyBSZWY6ICdUaGVBcm4nIH0pKSxcbiAgICAgICAgICBwYXJzZWRDb21wb25lbnRzLmFybkZvcm1hdCEpO1xuICAgICAgICBjb25zdCBjZm5Bcm5Db21wb25lbnRzID0gc3RhY2sucmVzb2x2ZSh0b2tlbkFybkNvbXBvbmVudHMpO1xuICAgICAgICBjb25zdCBldmFsdWF0ZWRBcm5Db21wb25lbnRzID0gZXZhbHVhdGVDRk4oY2ZuQXJuQ29tcG9uZW50cywgeyBUaGVBcm46IGFybiB9KTtcbiAgICAgICAgZXhwZWN0KGV2YWx1YXRlZEFybkNvbXBvbmVudHMpLnRvRXF1YWwocGFyc2VkQ29tcG9uZW50cyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhIFRva2VuIHdpdGggOiBzZXBhcmF0b3InLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdGhlVG9rZW4gPSB7IFJlZjogJ1NvbWVQYXJhbWV0ZXInIH07XG4gICAgICBjb25zdCBwYXJzZWQgPSBzdGFjay5wYXJzZUFybihuZXcgSW50cmluc2ljKHRoZVRva2VuKS50b1N0cmluZygpLCAnOicpO1xuXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJzZWQucGFydGl0aW9uKSkudG9FcXVhbCh7ICdGbjo6U2VsZWN0JzogWzEsIHsgJ0ZuOjpTcGxpdCc6IFsnOicsIHRoZVRva2VuXSB9XSB9KTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcnNlZC5zZXJ2aWNlKSkudG9FcXVhbCh7ICdGbjo6U2VsZWN0JzogWzIsIHsgJ0ZuOjpTcGxpdCc6IFsnOicsIHRoZVRva2VuXSB9XSB9KTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcnNlZC5yZWdpb24pKS50b0VxdWFsKHsgJ0ZuOjpTZWxlY3QnOiBbMywgeyAnRm46OlNwbGl0JzogWyc6JywgdGhlVG9rZW5dIH1dIH0pO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyc2VkLmFjY291bnQpKS50b0VxdWFsKHsgJ0ZuOjpTZWxlY3QnOiBbNCwgeyAnRm46OlNwbGl0JzogWyc6JywgdGhlVG9rZW5dIH1dIH0pO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyc2VkLnJlc291cmNlKSkudG9FcXVhbCh7ICdGbjo6U2VsZWN0JzogWzUsIHsgJ0ZuOjpTcGxpdCc6IFsnOicsIHRoZVRva2VuXSB9XSB9KTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcnNlZC5yZXNvdXJjZU5hbWUpKS50b0VxdWFsKHsgJ0ZuOjpTZWxlY3QnOiBbNiwgeyAnRm46OlNwbGl0JzogWyc6JywgdGhlVG9rZW5dIH1dIH0pO1xuICAgICAgZXhwZWN0KHBhcnNlZC5zZXApLnRvRXF1YWwoJzonKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2EgVG9rZW4gd2l0aCAvIHNlcGFyYXRvcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB0aGVUb2tlbiA9IHsgUmVmOiAnU29tZVBhcmFtZXRlcicgfTtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHN0YWNrLnBhcnNlQXJuKG5ldyBJbnRyaW5zaWModGhlVG9rZW4pLnRvU3RyaW5nKCkpO1xuXG4gICAgICBleHBlY3QocGFyc2VkLnNlcCkudG9FcXVhbCgnLycpO1xuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyc2VkLnJlc291cmNlKSkudG9FcXVhbCh7ICdGbjo6U2VsZWN0JzogWzAsIHsgJ0ZuOjpTcGxpdCc6IFsnLycsIHsgJ0ZuOjpTZWxlY3QnOiBbNSwgeyAnRm46OlNwbGl0JzogWyc6JywgdGhlVG9rZW5dIH1dIH1dIH1dIH0pO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcnNlZC5yZXNvdXJjZU5hbWUpKS50b0VxdWFsKHsgJ0ZuOjpTZWxlY3QnOiBbMSwgeyAnRm46OlNwbGl0JzogWycvJywgeyAnRm46OlNlbGVjdCc6IFs1LCB7ICdGbjo6U3BsaXQnOiBbJzonLCB0aGVUb2tlbl0gfV0gfV0gfV0gfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdleHRyYWN0aW5nIHJlc291cmNlIG5hbWUgZnJvbSBhIGNvbXBsZXggQVJOJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB0aGVUb2tlbiA9IFRva2VuLmFzU3RyaW5nKHsgUmVmOiAnU29tZVBhcmFtZXRlcicgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHBhcnNlZCA9IEFybi5leHRyYWN0UmVzb3VyY2VOYW1lKHRoZVRva2VuLCAncm9sZScpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoZXZhbHVhdGVDRk4oc3RhY2sucmVzb2x2ZShwYXJzZWQpLCB7XG4gICAgICAgIFNvbWVQYXJhbWV0ZXI6ICdhcm46YXdzOmlhbTo6MTExMTExMTExMTExOnJvbGUvcGF0aC90by9yb2xlL25hbWUnLFxuICAgICAgfSkpLnRvRXF1YWwoJ3BhdGgvdG8vcm9sZS9uYW1lJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdleHRyYWN0UmVzb3VyY2VOYW1lIHZhbGlkYXRlcyByZXNvdXJjZSB0eXBlIGlmIHBvc3NpYmxlJywgKCkgPT4ge1xuICAgICAgLy8gV0hFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgQXJuLmV4dHJhY3RSZXNvdXJjZU5hbWUoJ2Fybjphd3M6aWFtOjoxMTExMTExMTExMTE6YmFuYW5hL3JhbWEnLCAncm9sZScpO1xuICAgICAgfSkudG9UaHJvdygvRXhwZWN0ZWQgcmVzb3VyY2UgdHlwZS8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncmV0dXJucyBlbXB0eSBzdHJpbmcgQVJOIGNvbXBvbmVudHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgYXJuID0gJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9hYmMxMjMnO1xuICAgICAgY29uc3QgZXhwZWN0ZWQ6IEFybkNvbXBvbmVudHMgPSB7XG4gICAgICAgIHBhcnRpdGlvbjogJ2F3cycsXG4gICAgICAgIHNlcnZpY2U6ICdpYW0nLFxuICAgICAgICByZWdpb246ICcnLFxuICAgICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgICAgcmVzb3VyY2U6ICdyb2xlJyxcbiAgICAgICAgcmVzb3VyY2VOYW1lOiAnYWJjMTIzJyxcbiAgICAgICAgc2VwOiAnLycsXG4gICAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUsXG4gICAgICB9O1xuXG4gICAgICBleHBlY3Qoc3RhY2sucGFyc2VBcm4oYXJuKSkudG9FcXVhbChleHBlY3RlZCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiB1c2UgYSBmdWxseSBzcGVjaWZpZWQgQVJOIGZyb20gYSBkaWZmZXJlbnQgc3RhY2sgd2l0aG91dCBpbmN1cnJpbmcgYW4gaW1wb3J0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1N0YWNrMScsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3OCcsIHJlZ2lvbjogJ3VzLXR1cmJvLTUnIH0gfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1N0YWNrMicsIHsgZW52OiB7IGFjY291bnQ6ICc4NzY1NDMyMScsIHJlZ2lvbjogJ3VzLXR1cmJvLTEnIH0gfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXJuID0gc3RhY2sxLmZvcm1hdEFybih7XG4gICAgICAvLyBObyBwYXJ0aXRpb24gc3BlY2lmaWVkIGhlcmVcbiAgICAgIHNlcnZpY2U6ICdibGEnLFxuICAgICAgcmVzb3VyY2U6ICd0aGluZycsXG4gICAgICByZXNvdXJjZU5hbWU6ICd0aG9uZycsXG4gICAgfSk7XG4gICAgbmV3IENmbk91dHB1dChzdGFjazIsICdTb21lVmFsdWUnLCB7IHZhbHVlOiBhcm4gfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2syKSkudG9FcXVhbCh7XG4gICAgICBPdXRwdXRzOiB7XG4gICAgICAgIFNvbWVWYWx1ZToge1xuICAgICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgICAvLyBMb29rIG1hLCBubyBGbjo6SW1wb3J0VmFsdWUhXG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6YmxhOnVzLXR1cmJvLTU6MTIzNDU2Nzg6dGhpbmcvdGhvbmcnXV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdwYXJzZSBvdGhlciBmaWVsZHMgaWYgb25seSBzb21lIGFyZSB0b2tlbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHBhcnNlZCA9IHN0YWNrLnBhcnNlQXJuKGBhcm46JHtBd3MuUEFSVElUSU9OfTppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL1MzQWNjZXNzYCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyc2VkLnBhcnRpdGlvbikpLnRvRXF1YWwoeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyc2VkLnNlcnZpY2UpKS50b0VxdWFsKCdpYW0nKTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJzZWQucmVnaW9uKSkudG9FcXVhbCgnJyk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyc2VkLmFjY291bnQpKS50b0VxdWFsKCcxMjM0NTY3ODkwMTInKTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJzZWQucmVzb3VyY2UpKS50b0VxdWFsKCdyb2xlJyk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyc2VkLnJlc291cmNlTmFtZSkpLnRvRXF1YWwoJ1MzQWNjZXNzJyk7XG4gICAgZXhwZWN0KHBhcnNlZC5zZXApLnRvRXF1YWwoJy8nKTtcbiAgfSk7XG59KTtcbiJdfQ==