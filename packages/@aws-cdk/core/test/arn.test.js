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
    (0, cdk_build_tools_1.testDeprecated)('resourcePathSep can be set to ":" instead of the default "/"', () => {
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
    (0, cdk_build_tools_1.testDeprecated)('resourcePathSep can be set to "" instead of the default "/"', () => {
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
    (0, cdk_build_tools_1.describeDeprecated)('Arn.parse(s)', () => {
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
                const evaluatedArnComponents = (0, evaluate_cfn_1.evaluateCFN)(cfnArnComponents, { TheArn: arn });
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
            expect((0, evaluate_cfn_1.evaluateCFN)(stack.resolve(parsed), {
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
        expect((0, util_1.toCloudFormation)(stack2)).toEqual({
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
    (0, cdk_build_tools_1.testDeprecated)('parse other fields if only some are tokens', () => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJuLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcm4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhEQUE4RTtBQUM5RSxpREFBNkM7QUFDN0MsaUNBQTBDO0FBQzFDLGdDQUFnRztBQUNoRyx3REFBcUQ7QUFFckQsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDbkIsSUFBSSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtRQUNoRCxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBRTFCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDMUIsT0FBTyxFQUFFLEtBQUs7WUFDZCxRQUFRLEVBQUUsYUFBYTtTQUN4QixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVwQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FDaEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLFFBQVEsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ25HLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtRQUN4RCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQ1YsU0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNULE9BQU8sRUFBRSxLQUFLO1lBQ2QsUUFBUSxFQUFFLGFBQWE7U0FDeEIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsd0VBQXdFLEVBQUUsR0FBRyxFQUFFO1FBQ2xGLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFFMUIsTUFB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LE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pHLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZHLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RHLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZHLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hHLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtZQUNwQyxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sUUFBUSxHQUFHLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxDQUFDO1lBQzFDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxxQkFBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFFbEUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFaEMsbUNBQW1DO1lBQ25DLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdkosbUNBQW1DO1lBQ25DLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0osQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1lBQ3ZELFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sUUFBUSxHQUFHLFdBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQztZQUUxRCxPQUFPO1lBQ1AsTUFBTSxNQUFNLEdBQUcsU0FBRyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUV6RCxPQUFPO1lBQ1AsTUFBTSxDQUFDLElBQUEsMEJBQVcsRUFBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN4QyxhQUFhLEVBQUUsa0RBQWtEO2FBQ2xFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHlEQUF5RCxFQUFFLEdBQUcsRUFBRTtZQUNuRSxPQUFPO1lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRTtnQkFDVixTQUFHLENBQUMsbUJBQW1CLENBQUMsdUNBQXVDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1lBQy9DLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxHQUFHLEdBQUcsdUNBQXVDLENBQUM7WUFDcEQsTUFBTSxRQUFRLEdBQWtCO2dCQUM5QixTQUFTLEVBQUUsS0FBSztnQkFDaEIsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsT0FBTyxFQUFFLGNBQWM7Z0JBQ3ZCLFFBQVEsRUFBRSxNQUFNO2dCQUNoQixZQUFZLEVBQUUsUUFBUTtnQkFDdEIsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsU0FBUyxFQUFFLGVBQVMsQ0FBQyxtQkFBbUI7YUFDekMsQ0FBQztZQUVGLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsa0ZBQWtGLEVBQUUsR0FBRyxFQUFFO1FBQzVGLFFBQVE7UUFDUixNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3RHLE1BQU0sTUFBTSxHQUFHLElBQUksV0FBSyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFdEcsT0FBTztRQUNQLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDM0IsOEJBQThCO1lBQzlCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsUUFBUSxFQUFFLE9BQU87WUFDakIsWUFBWSxFQUFFLE9BQU87U0FDdEIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxlQUFTLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRW5ELE9BQU87UUFDUCxNQUFNLENBQUMsSUFBQSx1QkFBZ0IsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN2QyxPQUFPLEVBQUU7Z0JBQ1AsU0FBUyxFQUFFO29CQUNULEtBQUssRUFBRTt3QkFDTCwrQkFBK0I7d0JBQy9CLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLHNDQUFzQyxDQUFDLENBQUM7cUJBQzlGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUEsZ0NBQWMsRUFBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7UUFDaEUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxTQUFHLENBQUMsU0FBUyxrQ0FBa0MsQ0FBQyxDQUFDO1FBRXRGLE9BQU87UUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1FBQzNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlc2NyaWJlRGVwcmVjYXRlZCwgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0IHsgZXZhbHVhdGVDRk4gfSBmcm9tICcuL2V2YWx1YXRlLWNmbic7XG5pbXBvcnQgeyB0b0Nsb3VkRm9ybWF0aW9uIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IEFybiwgQXJuQ29tcG9uZW50cywgQXJuRm9ybWF0LCBBd3MsIENmbk91dHB1dCwgU2NvcGVkQXdzLCBTdGFjaywgVG9rZW4gfSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgSW50cmluc2ljIH0gZnJvbSAnLi4vbGliL3ByaXZhdGUvaW50cmluc2ljJztcblxuZGVzY3JpYmUoJ2FybicsICgpID0+IHtcbiAgdGVzdCgnY3JlYXRlIGZyb20gY29tcG9uZW50cyB3aXRoIGRlZmF1bHRzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBhcm4gPSBzdGFjay5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ3NxcycsXG4gICAgICByZXNvdXJjZTogJ215cXVldWVuYW1lJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBzZXVkbyA9IG5ldyBTY29wZWRBd3Moc3RhY2spO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYXJuKSkudG9FcXVhbChcbiAgICAgIHN0YWNrLnJlc29sdmUoYGFybjoke3BzZXVkby5wYXJ0aXRpb259OnNxczoke3BzZXVkby5yZWdpb259OiR7cHNldWRvLmFjY291bnRJZH06bXlxdWV1ZW5hbWVgKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nhbm5vdCByZWx5IG9uIGRlZmF1bHRzIHdoZW4gc3RhY2sgbm90IGtub3duJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PlxuICAgICAgQXJuLmZvcm1hdCh7XG4gICAgICAgIHNlcnZpY2U6ICdzcXMnLFxuICAgICAgICByZXNvdXJjZTogJ215cXVldWVuYW1lJyxcbiAgICAgIH0pKS50b1Rocm93KC9tdXN0IGFsbCBiZSBwYXNzZWQgaWYgc3RhY2sgaXMgbm90Lyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBmcm9tIGNvbXBvbmVudHMgd2l0aCBzcGVjaWZpYyB2YWx1ZXMgZm9yIHRoZSB2YXJpb3VzIGNvbXBvbmVudHMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGFybiA9IHN0YWNrLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnZHluYW1vZGInLFxuICAgICAgcmVzb3VyY2U6ICd0YWJsZScsXG4gICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICBwYXJ0aXRpb246ICdhd3MtY24nLFxuICAgICAgcmVzb3VyY2VOYW1lOiAnbXl0YWJsZS9zdHJlYW0vbGFiZWwnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYXJuKSkudG9FcXVhbChcbiAgICAgICdhcm46YXdzLWNuOmR5bmFtb2RiOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6dGFibGUvbXl0YWJsZS9zdHJlYW0vbGFiZWwnKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWxsb3cgZW1wdHkgc3RyaW5nIGluIGNvbXBvbmVudHMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGFybiA9IHN0YWNrLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnczMnLFxuICAgICAgcmVzb3VyY2U6ICdteS1idWNrZXQnLFxuICAgICAgYWNjb3VudDogJycsXG4gICAgICByZWdpb246ICcnLFxuICAgICAgcGFydGl0aW9uOiAnYXdzLWNuJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGFybikpLnRvRXF1YWwoXG4gICAgICAnYXJuOmF3cy1jbjpzMzo6Om15LWJ1Y2tldCcpO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgncmVzb3VyY2VQYXRoU2VwIGNhbiBiZSBzZXQgdG8gXCI6XCIgaW5zdGVhZCBvZiB0aGUgZGVmYXVsdCBcIi9cIicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgYXJuID0gc3RhY2suZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdjb2RlZGVwbG95JyxcbiAgICAgIHJlc291cmNlOiAnYXBwbGljYXRpb24nLFxuICAgICAgc2VwOiAnOicsXG4gICAgICByZXNvdXJjZU5hbWU6ICdXb3JkUHJlc3NfQXBwJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBzZXVkbyA9IG5ldyBTY29wZWRBd3Moc3RhY2spO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYXJuKSkudG9FcXVhbChcbiAgICAgIHN0YWNrLnJlc29sdmUoYGFybjoke3BzZXVkby5wYXJ0aXRpb259OmNvZGVkZXBsb3k6JHtwc2V1ZG8ucmVnaW9ufToke3BzZXVkby5hY2NvdW50SWR9OmFwcGxpY2F0aW9uOldvcmRQcmVzc19BcHBgKSk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdyZXNvdXJjZVBhdGhTZXAgY2FuIGJlIHNldCB0byBcIlwiIGluc3RlYWQgb2YgdGhlIGRlZmF1bHQgXCIvXCInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGFybiA9IHN0YWNrLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnc3NtJyxcbiAgICAgIHJlc291cmNlOiAncGFyYW1ldGVyJyxcbiAgICAgIHNlcDogJycsXG4gICAgICByZXNvdXJjZU5hbWU6ICcvcGFyYW1ldGVyLW5hbWUnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcHNldWRvID0gbmV3IFNjb3BlZEF3cyhzdGFjayk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShhcm4pKS50b0VxdWFsKFxuICAgICAgc3RhY2sucmVzb2x2ZShgYXJuOiR7cHNldWRvLnBhcnRpdGlvbn06c3NtOiR7cHNldWRvLnJlZ2lvbn06JHtwc2V1ZG8uYWNjb3VudElkfTpwYXJhbWV0ZXIvcGFyYW1ldGVyLW5hbWVgKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIHJlc291cmNlUGF0aFNlcCBpcyBuZWl0aGVyIFwiOlwiIG5vciBcIi9cIicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IHN0YWNrLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnZm9vJyxcbiAgICAgIHJlc291cmNlOiAnYmFyJyxcbiAgICAgIHNlcDogJ3gnLFxuICAgIH0pKS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlRGVwcmVjYXRlZCgnQXJuLnBhcnNlKHMpJywgKCkgPT4ge1xuXG4gICAgZGVzY3JpYmUoJ2ZhaWxzJywgKCkgPT4ge1xuICAgICAgdGVzdCgnaWYgZG9lc25cXCd0IHN0YXJ0IHdpdGggXCJhcm46XCInLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICAgIGV4cGVjdCgoKSA9PiBzdGFjay5wYXJzZUFybignYmFybjpmb286eDphOjE6MicpKS50b1Rocm93KC9BUk5zIG11c3Qgc3RhcnQgd2l0aCBcImFybjpcIi4qYmFybjpmb28vKTtcblxuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2lmIHRoZSBBUk4gZG9lc250IGhhdmUgZW5vdWdoIGNvbXBvbmVudHMnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICAgIGV4cGVjdCgoKSA9PiBzdGFjay5wYXJzZUFybignYXJuOmlzOnRvbzpzaG9ydCcpKS50b1Rocm93KC9UaGUgYHJlc291cmNlYCBjb21wb25lbnQgXFwoNnRoIGNvbXBvbmVudFxcKSBvZiBhbiBBUk4gaXMgcmVxdWlyZWQvKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdpZiBcInNlcnZpY2VcIiBpcyBub3Qgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgICBleHBlY3QoKCkgPT4gc3RhY2sucGFyc2VBcm4oJ2Fybjphd3M6OjQ6NTo2JykpLnRvVGhyb3coL1RoZSBgc2VydmljZWAgY29tcG9uZW50IFxcKDNyZCBjb21wb25lbnRcXCkgb2YgYW4gQVJOIGlzIHJlcXVpcmVkLyk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnaWYgXCJyZXNvdXJjZVwiIGlzIG5vdCBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICAgIGV4cGVjdCgoKSA9PiBzdGFjay5wYXJzZUFybignYXJuOmF3czpzZXJ2aWNlOjo6JykpLnRvVGhyb3coL1RoZSBgcmVzb3VyY2VgIGNvbXBvbmVudCBcXCg2dGggY29tcG9uZW50XFwpIG9mIGFuIEFSTiBpcyByZXF1aXJlZC8pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd2YXJpb3VzIHN1Y2Nlc3NmdWwgcGFyc2VzJywgKCkgPT4ge1xuICAgICAgaW50ZXJmYWNlIFRlc3RBcm5Db21wb25lbnRzIGV4dGVuZHMgQXJuQ29tcG9uZW50cyB7XG4gICAgICAgIC8qKiBAZGVmYXVsdCB0cnVlICovXG4gICAgICAgIGNoZWNrQ2ZuRW5jb2Rpbmc/OiBib29sZWFuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdGVzdHM6IHsgW2Fybjogc3RyaW5nXTogVGVzdEFybkNvbXBvbmVudHMgfSA9IHtcbiAgICAgICAgJ2Fybjphd3M6YTRiOnJlZ2lvbjphY2NvdW50aWQ6cmVzb3VyY2V0eXBlL3Jlc291cmNlJzoge1xuICAgICAgICAgIHBhcnRpdGlvbjogJ2F3cycsXG4gICAgICAgICAgc2VydmljZTogJ2E0YicsXG4gICAgICAgICAgcmVnaW9uOiAncmVnaW9uJyxcbiAgICAgICAgICBhY2NvdW50OiAnYWNjb3VudGlkJyxcbiAgICAgICAgICByZXNvdXJjZTogJ3Jlc291cmNldHlwZScsXG4gICAgICAgICAgcmVzb3VyY2VOYW1lOiAncmVzb3VyY2UnLFxuICAgICAgICAgIHNlcDogJy8nLFxuICAgICAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUsXG4gICAgICAgIH0sXG4gICAgICAgICdhcm46YXdzOmFwaWdhdGV3YXk6dXMtZWFzdC0xOjphMTIzNDU2Nzg5MDEyYmMzZGU0NTY3ODkwMWYyM2E0NTovdGVzdC9teWRlbW9yZXNvdXJjZS8qJzoge1xuICAgICAgICAgIHBhcnRpdGlvbjogJ2F3cycsXG4gICAgICAgICAgc2VydmljZTogJ2FwaWdhdGV3YXknLFxuICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgYWNjb3VudDogJycsXG4gICAgICAgICAgcmVzb3VyY2U6ICdhMTIzNDU2Nzg5MDEyYmMzZGU0NTY3ODkwMWYyM2E0NScsXG4gICAgICAgICAgc2VwOiAnOicsXG4gICAgICAgICAgcmVzb3VyY2VOYW1lOiAnL3Rlc3QvbXlkZW1vcmVzb3VyY2UvKicsXG4gICAgICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2Fybjphd3MtY246Y2xvdWQ5OjoxMjM0NTY3ODkwMTI6ZW52aXJvbm1lbnQ6ODFlOTAwMzE3MzQ3NTg1YTA2MDFlMDRjOGQ1MmVhRVgnOiB7XG4gICAgICAgICAgcGFydGl0aW9uOiAnYXdzLWNuJyxcbiAgICAgICAgICBzZXJ2aWNlOiAnY2xvdWQ5JyxcbiAgICAgICAgICByZWdpb246ICcnLFxuICAgICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICAgIHJlc291cmNlOiAnZW52aXJvbm1lbnQnLFxuICAgICAgICAgIHJlc291cmNlTmFtZTogJzgxZTkwMDMxNzM0NzU4NWEwNjAxZTA0YzhkNTJlYUVYJyxcbiAgICAgICAgICBzZXA6ICc6JyxcbiAgICAgICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FLFxuICAgICAgICB9LFxuICAgICAgICAnYXJuOmF3czpjb2duaXRvLXN5bmM6OjppZGVudGl0eXBvb2wvdXMtZWFzdC0xOjFhMWExYTFhLWZmZmYtMTExMS05OTk5LTEyMzQ1Njc4OmJsYSc6IHtcbiAgICAgICAgICBzZXJ2aWNlOiAnY29nbml0by1zeW5jJyxcbiAgICAgICAgICByZWdpb246ICcnLFxuICAgICAgICAgIGFjY291bnQ6ICcnLFxuICAgICAgICAgIHBhcnRpdGlvbjogJ2F3cycsXG4gICAgICAgICAgcmVzb3VyY2U6ICdpZGVudGl0eXBvb2wnLFxuICAgICAgICAgIHJlc291cmNlTmFtZTogJ3VzLWVhc3QtMToxYTFhMWExYS1mZmZmLTExMTEtOTk5OS0xMjM0NTY3ODpibGEnLFxuICAgICAgICAgIHNlcDogJy8nLFxuICAgICAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUsXG4gICAgICAgICAgLy8gVG9EbzogZG9lcyBub3Qgd29yayBjdXJyZW50bHksIGJlY2F1c2Ugd2Ugc3BsaXQgb24gJzonIGZpcnN0LCB3aGljaCBhcmUgcHJlc2VudCBpbiByZXNvdXJjZU5hbWUgaGVyZVxuICAgICAgICAgIGNoZWNrQ2ZuRW5jb2Rpbmc6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICAnYXJuOmF3czpzZXJ2aWNlY2F0YWxvZzp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOi9hcHBsaWNhdGlvbnMvMGFxbXZ4dmdtcnkwZWNjNG1qaHd5cHVuNmknOiB7XG4gICAgICAgICAgcmVzb3VyY2U6ICdhcHBsaWNhdGlvbnMnLFxuICAgICAgICAgIHJlc291cmNlTmFtZTogJzBhcW12eHZnbXJ5MGVjYzRtamh3eXB1bjZpJyxcbiAgICAgICAgICBzZXA6ICcvJyxcbiAgICAgICAgICBzZXJ2aWNlOiAnc2VydmljZWNhdGFsb2cnLFxuICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgICAgcGFydGl0aW9uOiAnYXdzJyxcbiAgICAgICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9TTEFTSF9SRVNPVVJDRV9OQU1FLFxuICAgICAgICB9LFxuICAgICAgICAnYXJuOmF3czpzMzo6Om15X2NvcnBvcmF0ZV9idWNrZXQnOiB7XG4gICAgICAgICAgcGFydGl0aW9uOiAnYXdzJyxcbiAgICAgICAgICBzZXJ2aWNlOiAnczMnLFxuICAgICAgICAgIHJlZ2lvbjogJycsXG4gICAgICAgICAgYWNjb3VudDogJycsXG4gICAgICAgICAgcmVzb3VyY2U6ICdteV9jb3Jwb3JhdGVfYnVja2V0JyxcbiAgICAgICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5OT19SRVNPVVJDRV9OQU1FLFxuICAgICAgICB9LFxuICAgICAgICAnYXJuOmF3czpzMzo6Om15X2NvcnBvcmF0ZV9idWNrZXQvb2JqZWN0LnppcCc6IHtcbiAgICAgICAgICBwYXJ0aXRpb246ICdhd3MnLFxuICAgICAgICAgIHNlcnZpY2U6ICdzMycsXG4gICAgICAgICAgcmVnaW9uOiAnJyxcbiAgICAgICAgICBhY2NvdW50OiAnJyxcbiAgICAgICAgICByZXNvdXJjZTogJ215X2NvcnBvcmF0ZV9idWNrZXQvb2JqZWN0LnppcCcsXG4gICAgICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuTk9fUkVTT1VSQ0VfTkFNRSxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIGZvciAoY29uc3QgW2FybiwgZXhwZWN0ZWRDb21wb25lbnRzXSBvZiBPYmplY3QuZW50cmllcyh0ZXN0cykpIHtcbiAgICAgICAgY29uc3Qgc2tpcENoZWNraW5nQ2ZuRW5jb2RpbmcgPSBleHBlY3RlZENvbXBvbmVudHMuY2hlY2tDZm5FbmNvZGluZyA9PT0gZmFsc2U7XG4gICAgICAgIC8vIGRlbGV0ZSB0aGUgZXh0cmEgZmllbGQgc28gaXQgZG9lc24ndCBzY3JldyB1cCB0aGUgZXF1YWxpdHkgY29tcGFyaXNvblxuICAgICAgICBkZWxldGUgZXhwZWN0ZWRDb21wb25lbnRzLmNoZWNrQ2ZuRW5jb2Rpbmc7XG5cbiAgICAgICAgLy8gdGVzdCB0aGUgYmFzaWMgY2FzZVxuICAgICAgICBjb25zdCBwYXJzZWRDb21wb25lbnRzID0gc3RhY2suc3BsaXRBcm4oYXJuLCBleHBlY3RlZENvbXBvbmVudHMuYXJuRm9ybWF0ISk7XG4gICAgICAgIGV4cGVjdChwYXJzZWRDb21wb25lbnRzKS50b0VxdWFsKGV4cGVjdGVkQ29tcG9uZW50cyk7XG5cbiAgICAgICAgLy8gdGVzdCB0aGUgcm91bmQtdHJpcFxuICAgICAgICBleHBlY3Qoc3RhY2suZm9ybWF0QXJuKHBhcnNlZENvbXBvbmVudHMpKS50b0VxdWFsKGFybik7XG5cbiAgICAgICAgLy8gdGVzdCB0aGF0IHRoZSBDbG91ZEZvcm1hdGlvbiBmdW5jdGlvbnMgd2UgZ2VuZXJhdGUgZXZhbHVhdGUgdG8gdGhlIGNvcnJlY3QgdmFsdWVcbiAgICAgICAgaWYgKHNraXBDaGVja2luZ0NmbkVuY29kaW5nKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdG9rZW5Bcm5Db21wb25lbnRzID0gc3RhY2suc3BsaXRBcm4oXG4gICAgICAgICAgVG9rZW4uYXNTdHJpbmcobmV3IEludHJpbnNpYyh7IFJlZjogJ1RoZUFybicgfSkpLFxuICAgICAgICAgIHBhcnNlZENvbXBvbmVudHMuYXJuRm9ybWF0ISk7XG4gICAgICAgIGNvbnN0IGNmbkFybkNvbXBvbmVudHMgPSBzdGFjay5yZXNvbHZlKHRva2VuQXJuQ29tcG9uZW50cyk7XG4gICAgICAgIGNvbnN0IGV2YWx1YXRlZEFybkNvbXBvbmVudHMgPSBldmFsdWF0ZUNGTihjZm5Bcm5Db21wb25lbnRzLCB7IFRoZUFybjogYXJuIH0pO1xuICAgICAgICBleHBlY3QoZXZhbHVhdGVkQXJuQ29tcG9uZW50cykudG9FcXVhbChwYXJzZWRDb21wb25lbnRzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRlc3QoJ2EgVG9rZW4gd2l0aCA6IHNlcGFyYXRvcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB0aGVUb2tlbiA9IHsgUmVmOiAnU29tZVBhcmFtZXRlcicgfTtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHN0YWNrLnBhcnNlQXJuKG5ldyBJbnRyaW5zaWModGhlVG9rZW4pLnRvU3RyaW5nKCksICc6Jyk7XG5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcnNlZC5wYXJ0aXRpb24pKS50b0VxdWFsKHsgJ0ZuOjpTZWxlY3QnOiBbMSwgeyAnRm46OlNwbGl0JzogWyc6JywgdGhlVG9rZW5dIH1dIH0pO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyc2VkLnNlcnZpY2UpKS50b0VxdWFsKHsgJ0ZuOjpTZWxlY3QnOiBbMiwgeyAnRm46OlNwbGl0JzogWyc6JywgdGhlVG9rZW5dIH1dIH0pO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyc2VkLnJlZ2lvbikpLnRvRXF1YWwoeyAnRm46OlNlbGVjdCc6IFszLCB7ICdGbjo6U3BsaXQnOiBbJzonLCB0aGVUb2tlbl0gfV0gfSk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJzZWQuYWNjb3VudCkpLnRvRXF1YWwoeyAnRm46OlNlbGVjdCc6IFs0LCB7ICdGbjo6U3BsaXQnOiBbJzonLCB0aGVUb2tlbl0gfV0gfSk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJzZWQucmVzb3VyY2UpKS50b0VxdWFsKHsgJ0ZuOjpTZWxlY3QnOiBbNSwgeyAnRm46OlNwbGl0JzogWyc6JywgdGhlVG9rZW5dIH1dIH0pO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyc2VkLnJlc291cmNlTmFtZSkpLnRvRXF1YWwoeyAnRm46OlNlbGVjdCc6IFs2LCB7ICdGbjo6U3BsaXQnOiBbJzonLCB0aGVUb2tlbl0gfV0gfSk7XG4gICAgICBleHBlY3QocGFyc2VkLnNlcCkudG9FcXVhbCgnOicpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYSBUb2tlbiB3aXRoIC8gc2VwYXJhdG9yJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHRoZVRva2VuID0geyBSZWY6ICdTb21lUGFyYW1ldGVyJyB9O1xuICAgICAgY29uc3QgcGFyc2VkID0gc3RhY2sucGFyc2VBcm4obmV3IEludHJpbnNpYyh0aGVUb2tlbikudG9TdHJpbmcoKSk7XG5cbiAgICAgIGV4cGVjdChwYXJzZWQuc2VwKS50b0VxdWFsKCcvJyk7XG5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJzZWQucmVzb3VyY2UpKS50b0VxdWFsKHsgJ0ZuOjpTZWxlY3QnOiBbMCwgeyAnRm46OlNwbGl0JzogWycvJywgeyAnRm46OlNlbGVjdCc6IFs1LCB7ICdGbjo6U3BsaXQnOiBbJzonLCB0aGVUb2tlbl0gfV0gfV0gfV0gfSk7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyc2VkLnJlc291cmNlTmFtZSkpLnRvRXF1YWwoeyAnRm46OlNlbGVjdCc6IFsxLCB7ICdGbjo6U3BsaXQnOiBbJy8nLCB7ICdGbjo6U2VsZWN0JzogWzUsIHsgJ0ZuOjpTcGxpdCc6IFsnOicsIHRoZVRva2VuXSB9XSB9XSB9XSB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2V4dHJhY3RpbmcgcmVzb3VyY2UgbmFtZSBmcm9tIGEgY29tcGxleCBBUk4nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHRoZVRva2VuID0gVG9rZW4uYXNTdHJpbmcoeyBSZWY6ICdTb21lUGFyYW1ldGVyJyB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcGFyc2VkID0gQXJuLmV4dHJhY3RSZXNvdXJjZU5hbWUodGhlVG9rZW4sICdyb2xlJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChldmFsdWF0ZUNGTihzdGFjay5yZXNvbHZlKHBhcnNlZCksIHtcbiAgICAgICAgU29tZVBhcmFtZXRlcjogJ2Fybjphd3M6aWFtOjoxMTExMTExMTExMTE6cm9sZS9wYXRoL3RvL3JvbGUvbmFtZScsXG4gICAgICB9KSkudG9FcXVhbCgncGF0aC90by9yb2xlL25hbWUnKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2V4dHJhY3RSZXNvdXJjZU5hbWUgdmFsaWRhdGVzIHJlc291cmNlIHR5cGUgaWYgcG9zc2libGUnLCAoKSA9PiB7XG4gICAgICAvLyBXSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBBcm4uZXh0cmFjdFJlc291cmNlTmFtZSgnYXJuOmF3czppYW06OjExMTExMTExMTExMTpiYW5hbmEvcmFtYScsICdyb2xlJyk7XG4gICAgICB9KS50b1Rocm93KC9FeHBlY3RlZCByZXNvdXJjZSB0eXBlLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZXR1cm5zIGVtcHR5IHN0cmluZyBBUk4gY29tcG9uZW50cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBhcm4gPSAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL2FiYzEyMyc7XG4gICAgICBjb25zdCBleHBlY3RlZDogQXJuQ29tcG9uZW50cyA9IHtcbiAgICAgICAgcGFydGl0aW9uOiAnYXdzJyxcbiAgICAgICAgc2VydmljZTogJ2lhbScsXG4gICAgICAgIHJlZ2lvbjogJycsXG4gICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICByZXNvdXJjZTogJ3JvbGUnLFxuICAgICAgICByZXNvdXJjZU5hbWU6ICdhYmMxMjMnLFxuICAgICAgICBzZXA6ICcvJyxcbiAgICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSxcbiAgICAgIH07XG5cbiAgICAgIGV4cGVjdChzdGFjay5wYXJzZUFybihhcm4pKS50b0VxdWFsKGV4cGVjdGVkKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHVzZSBhIGZ1bGx5IHNwZWNpZmllZCBBUk4gZnJvbSBhIGRpZmZlcmVudCBzdGFjayB3aXRob3V0IGluY3VycmluZyBhbiBpbXBvcnQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCAnU3RhY2sxJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4JywgcmVnaW9uOiAndXMtdHVyYm8tNScgfSB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCAnU3RhY2syJywgeyBlbnY6IHsgYWNjb3VudDogJzg3NjU0MzIxJywgcmVnaW9uOiAndXMtdHVyYm8tMScgfSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhcm4gPSBzdGFjazEuZm9ybWF0QXJuKHtcbiAgICAgIC8vIE5vIHBhcnRpdGlvbiBzcGVjaWZpZWQgaGVyZVxuICAgICAgc2VydmljZTogJ2JsYScsXG4gICAgICByZXNvdXJjZTogJ3RoaW5nJyxcbiAgICAgIHJlc291cmNlTmFtZTogJ3Rob25nJyxcbiAgICB9KTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMiwgJ1NvbWVWYWx1ZScsIHsgdmFsdWU6IGFybiB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjazIpKS50b0VxdWFsKHtcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgU29tZVZhbHVlOiB7XG4gICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgIC8vIExvb2sgbWEsIG5vIEZuOjpJbXBvcnRWYWx1ZSFcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpibGE6dXMtdHVyYm8tNToxMjM0NTY3ODp0aGluZy90aG9uZyddXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ3BhcnNlIG90aGVyIGZpZWxkcyBpZiBvbmx5IHNvbWUgYXJlIHRva2VucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcGFyc2VkID0gc3RhY2sucGFyc2VBcm4oYGFybjoke0F3cy5QQVJUSVRJT059OmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvUzNBY2Nlc3NgKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJzZWQucGFydGl0aW9uKSkudG9FcXVhbCh7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9KTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJzZWQuc2VydmljZSkpLnRvRXF1YWwoJ2lhbScpO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcnNlZC5yZWdpb24pKS50b0VxdWFsKCcnKTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJzZWQuYWNjb3VudCkpLnRvRXF1YWwoJzEyMzQ1Njc4OTAxMicpO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcnNlZC5yZXNvdXJjZSkpLnRvRXF1YWwoJ3JvbGUnKTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwYXJzZWQucmVzb3VyY2VOYW1lKSkudG9FcXVhbCgnUzNBY2Nlc3MnKTtcbiAgICBleHBlY3QocGFyc2VkLnNlcCkudG9FcXVhbCgnLycpO1xuICB9KTtcbn0pO1xuIl19