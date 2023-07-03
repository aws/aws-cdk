import { describeDeprecated, testDeprecated } from '@aws-cdk/cdk-build-tools';
import { evaluateCFN } from './evaluate-cfn';
import { toCloudFormation } from './util';
import { Arn, ArnComponents, ArnFormat, Aws, CfnOutput, ScopedAws, Stack, Token } from '../lib';
import { Intrinsic } from '../lib/private/intrinsic';

describe('arn', () => {
  test('create from components with defaults', () => {
    const stack = new Stack();

    const arn = stack.formatArn({
      service: 'sqs',
      resource: 'myqueuename',
    });

    const pseudo = new ScopedAws(stack);

    expect(stack.resolve(arn)).toEqual(
      stack.resolve(`arn:${pseudo.partition}:sqs:${pseudo.region}:${pseudo.accountId}:myqueuename`));
  });

  test('cannot rely on defaults when stack not known', () => {
    expect(() =>
      Arn.format({
        service: 'sqs',
        resource: 'myqueuename',
      })).toThrow(/must all be passed if stack is not/);
  });

  test('create from components with specific values for the various components', () => {
    const stack = new Stack();

    const arn = stack.formatArn({
      service: 'dynamodb',
      resource: 'table',
      account: '123456789012',
      region: 'us-east-1',
      partition: 'aws-cn',
      resourceName: 'mytable/stream/label',
    });

    expect(stack.resolve(arn)).toEqual(
      'arn:aws-cn:dynamodb:us-east-1:123456789012:table/mytable/stream/label');
  });

  test('allow empty string in components', () => {
    const stack = new Stack();

    const arn = stack.formatArn({
      service: 's3',
      resource: 'my-bucket',
      account: '',
      region: '',
      partition: 'aws-cn',
    });

    expect(stack.resolve(arn)).toEqual(
      'arn:aws-cn:s3:::my-bucket');
  });

  testDeprecated('resourcePathSep can be set to ":" instead of the default "/"', () => {
    const stack = new Stack();

    const arn = stack.formatArn({
      service: 'codedeploy',
      resource: 'application',
      sep: ':',
      resourceName: 'WordPress_App',
    });

    const pseudo = new ScopedAws(stack);

    expect(stack.resolve(arn)).toEqual(
      stack.resolve(`arn:${pseudo.partition}:codedeploy:${pseudo.region}:${pseudo.accountId}:application:WordPress_App`));
  });

  testDeprecated('resourcePathSep can be set to "" instead of the default "/"', () => {
    const stack = new Stack();

    const arn = stack.formatArn({
      service: 'ssm',
      resource: 'parameter',
      sep: '',
      resourceName: '/parameter-name',
    });

    const pseudo = new ScopedAws(stack);

    expect(stack.resolve(arn)).toEqual(
      stack.resolve(`arn:${pseudo.partition}:ssm:${pseudo.region}:${pseudo.accountId}:parameter/parameter-name`));
  });

  test('fails if resourcePathSep is neither ":" nor "/"', () => {
    const stack = new Stack();

    expect(() => stack.formatArn({
      service: 'foo',
      resource: 'bar',
      sep: 'x',
    })).toThrow();
  });

  describeDeprecated('Arn.parse(s)', () => {

    describe('fails', () => {
      test('if doesn\'t start with "arn:"', () => {
        const stack = new Stack();
        expect(() => stack.parseArn('barn:foo:x:a:1:2')).toThrow(/ARNs must start with "arn:".*barn:foo/);

      });

      test('if the ARN doesnt have enough components', () => {
        const stack = new Stack();
        expect(() => stack.parseArn('arn:is:too:short')).toThrow(/The `resource` component \(6th component\) of an ARN is required/);
      });

      test('if "service" is not specified', () => {
        const stack = new Stack();
        expect(() => stack.parseArn('arn:aws::4:5:6')).toThrow(/The `service` component \(3rd component\) of an ARN is required/);
      });

      test('if "resource" is not specified', () => {
        const stack = new Stack();
        expect(() => stack.parseArn('arn:aws:service:::')).toThrow(/The `resource` component \(6th component\) of an ARN is required/);
      });
    });

    test('various successful parses', () => {
      interface TestArnComponents extends ArnComponents {
        /** @default true */
        checkCfnEncoding?: boolean;
      }

      const stack = new Stack();
      const tests: { [arn: string]: TestArnComponents } = {
        'arn:aws:a4b:region:accountid:resourcetype/resource': {
          partition: 'aws',
          service: 'a4b',
          region: 'region',
          account: 'accountid',
          resource: 'resourcetype',
          resourceName: 'resource',
          sep: '/',
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
        },
        'arn:aws:apigateway:us-east-1::a123456789012bc3de45678901f23a45:/test/mydemoresource/*': {
          partition: 'aws',
          service: 'apigateway',
          region: 'us-east-1',
          account: '',
          resource: 'a123456789012bc3de45678901f23a45',
          sep: ':',
          resourceName: '/test/mydemoresource/*',
          arnFormat: ArnFormat.COLON_RESOURCE_NAME,
        },
        'arn:aws-cn:cloud9::123456789012:environment:81e900317347585a0601e04c8d52eaEX': {
          partition: 'aws-cn',
          service: 'cloud9',
          region: '',
          account: '123456789012',
          resource: 'environment',
          resourceName: '81e900317347585a0601e04c8d52eaEX',
          sep: ':',
          arnFormat: ArnFormat.COLON_RESOURCE_NAME,
        },
        'arn:aws:cognito-sync:::identitypool/us-east-1:1a1a1a1a-ffff-1111-9999-12345678:bla': {
          service: 'cognito-sync',
          region: '',
          account: '',
          partition: 'aws',
          resource: 'identitypool',
          resourceName: 'us-east-1:1a1a1a1a-ffff-1111-9999-12345678:bla',
          sep: '/',
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
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
          arnFormat: ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME,
        },
        'arn:aws:s3:::my_corporate_bucket': {
          partition: 'aws',
          service: 's3',
          region: '',
          account: '',
          resource: 'my_corporate_bucket',
          arnFormat: ArnFormat.NO_RESOURCE_NAME,
        },
        'arn:aws:s3:::my_corporate_bucket/object.zip': {
          partition: 'aws',
          service: 's3',
          region: '',
          account: '',
          resource: 'my_corporate_bucket/object.zip',
          arnFormat: ArnFormat.NO_RESOURCE_NAME,
        },
      };

      for (const [arn, expectedComponents] of Object.entries(tests)) {
        const skipCheckingCfnEncoding = expectedComponents.checkCfnEncoding === false;
        // delete the extra field so it doesn't screw up the equality comparison
        delete expectedComponents.checkCfnEncoding;

        // test the basic case
        const parsedComponents = stack.splitArn(arn, expectedComponents.arnFormat!);
        expect(parsedComponents).toEqual(expectedComponents);

        // test the round-trip
        expect(stack.formatArn(parsedComponents)).toEqual(arn);

        // test that the CloudFormation functions we generate evaluate to the correct value
        if (skipCheckingCfnEncoding) {
          continue;
        }
        const tokenArnComponents = stack.splitArn(
          Token.asString(new Intrinsic({ Ref: 'TheArn' })),
          parsedComponents.arnFormat!);
        const cfnArnComponents = stack.resolve(tokenArnComponents);
        const evaluatedArnComponents = evaluateCFN(cfnArnComponents, { TheArn: arn });
        expect(evaluatedArnComponents).toEqual(parsedComponents);
      }
    });

    test('a Token with : separator', () => {
      const stack = new Stack();
      const theToken = { Ref: 'SomeParameter' };
      const parsed = stack.parseArn(new Intrinsic(theToken).toString(), ':');

      expect(stack.resolve(parsed.partition)).toEqual({ 'Fn::Select': [1, { 'Fn::Split': [':', theToken] }] });
      expect(stack.resolve(parsed.service)).toEqual({ 'Fn::Select': [2, { 'Fn::Split': [':', theToken] }] });
      expect(stack.resolve(parsed.region)).toEqual({ 'Fn::Select': [3, { 'Fn::Split': [':', theToken] }] });
      expect(stack.resolve(parsed.account)).toEqual({ 'Fn::Select': [4, { 'Fn::Split': [':', theToken] }] });
      expect(stack.resolve(parsed.resource)).toEqual({ 'Fn::Select': [5, { 'Fn::Split': [':', theToken] }] });
      expect(stack.resolve(parsed.resourceName)).toEqual({ 'Fn::Select': [6, { 'Fn::Split': [':', theToken] }] });
      expect(parsed.sep).toEqual(':');
    });

    test('a Token with / separator', () => {
      const stack = new Stack();
      const theToken = { Ref: 'SomeParameter' };
      const parsed = stack.parseArn(new Intrinsic(theToken).toString());

      expect(parsed.sep).toEqual('/');

      // eslint-disable-next-line max-len
      expect(stack.resolve(parsed.resource)).toEqual({ 'Fn::Select': [0, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', theToken] }] }] }] });
      // eslint-disable-next-line max-len
      expect(stack.resolve(parsed.resourceName)).toEqual({ 'Fn::Select': [1, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', theToken] }] }] }] });
    });

    test('extracting resource name from a complex ARN', () => {
      // GIVEN
      const stack = new Stack();
      const theToken = Token.asString({ Ref: 'SomeParameter' });

      // WHEN
      const parsed = Arn.extractResourceName(theToken, 'role');

      // THEN
      expect(evaluateCFN(stack.resolve(parsed), {
        SomeParameter: 'arn:aws:iam::111111111111:role/path/to/role/name',
      })).toEqual('path/to/role/name');
    });

    test('extractResourceName validates resource type if possible', () => {
      // WHEN
      expect(() => {
        Arn.extractResourceName('arn:aws:iam::111111111111:banana/rama', 'role');
      }).toThrow(/Expected resource type/);
    });

    test('returns empty string ARN components', () => {
      const stack = new Stack();
      const arn = 'arn:aws:iam::123456789012:role/abc123';
      const expected: ArnComponents = {
        partition: 'aws',
        service: 'iam',
        region: '',
        account: '123456789012',
        resource: 'role',
        resourceName: 'abc123',
        sep: '/',
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      };

      expect(stack.parseArn(arn)).toEqual(expected);
    });
  });

  test('can use a fully specified ARN from a different stack without incurring an import', () => {
    // GIVEN
    const stack1 = new Stack(undefined, 'Stack1', { env: { account: '12345678', region: 'us-turbo-5' } });
    const stack2 = new Stack(undefined, 'Stack2', { env: { account: '87654321', region: 'us-turbo-1' } });

    // WHEN
    const arn = stack1.formatArn({
      // No partition specified here
      service: 'bla',
      resource: 'thing',
      resourceName: 'thong',
    });
    new CfnOutput(stack2, 'SomeValue', { value: arn });

    // THEN
    expect(toCloudFormation(stack2)).toEqual({
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

  testDeprecated('parse other fields if only some are tokens', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const parsed = stack.parseArn(`arn:${Aws.PARTITION}:iam::123456789012:role/S3Access`);

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
