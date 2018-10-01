import { Test } from 'nodeunit';
import { ArnComponents, ArnUtils, resolve, Token } from '../../lib';

export = {
  'create from components with defaults'(test: Test) {
    const arn = ArnUtils.fromComponents({
      service: 'sqs',
      resource: 'myqueuename'
    });

    test.deepEqual(resolve(arn), { 'Fn::Join':
    [ '',
      [ 'arn',
      ':',
      { Ref: 'AWS::Partition' },
      ':',
      'sqs',
      ':',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      ':',
      'myqueuename' ] ] });
    test.done();
  },

  'create from components with specific values for the various components'(test: Test) {
    const arn = ArnUtils.fromComponents({
      service: 'dynamodb',
      resource: 'table',
      account: '123456789012',
      region: 'us-east-1',
      partition: 'aws-cn',
      resourceName: 'mytable/stream/label'
    });

    test.deepEqual(resolve(arn), { 'Fn::Join':
    [ '',
      [ 'arn',
      ':',
      'aws-cn',
      ':',
      'dynamodb',
      ':',
      'us-east-1',
      ':',
      '123456789012',
      ':',
      'table',
      '/',
      'mytable/stream/label' ] ] });
    test.done();
  },

  'allow empty string in components'(test: Test) {
    const arn = ArnUtils.fromComponents({
      service: 's3',
      resource: 'my-bucket',
      account: '',
      region: '',
      partition: 'aws-cn',
    });

    test.deepEqual(resolve(arn), {
      'Fn::Join': [
        '',
        [
          'arn',
          ':',
          'aws-cn',
          ':',
          's3',
          ':',
          '',
          ':',
          '',
          ':',
          'my-bucket',
        ]
      ]
    });

    test.done();
  },

  'resourcePathSep can be set to ":" instead of the default "/"'(test: Test) {
    const arn = ArnUtils.fromComponents({
      service: 'codedeploy',
      resource: 'application',
      sep: ':',
      resourceName: 'WordPress_App'
    });

    test.deepEqual(resolve(arn), { 'Fn::Join':
    [ '',
      [ 'arn',
      ':',
      { Ref: 'AWS::Partition' },
      ':',
      'codedeploy',
      ':',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      ':',
      'application',
      ':',
      'WordPress_App' ] ] });
    test.done();
  },

  'fails if resourcePathSep is neither ":" nor "/"'(test: Test) {
    test.throws(() => ArnUtils.fromComponents({
      service: 'foo',
      resource: 'bar',
      sep: 'x' }));
    test.done();
  },

  'Arn.parse(s)': {

    'fails': {
      'if doesn\'t start with "arn:"'(test: Test) {
        test.throws(() => ArnUtils.parse("barn:foo:x:a:1:2"), /ARNs must start with "arn:": barn:foo/);
        test.done();
      },

      'if the ARN doesnt have enough components'(test: Test) {
        test.throws(() => ArnUtils.parse('arn:is:too:short'), /ARNs must have at least 6 components: arn:is:too:short/);
        test.done();
      },

      'if "service" is not specified'(test: Test) {
        test.throws(() => ArnUtils.parse('arn:aws::4:5:6'), /The `service` component \(3rd component\) is required/);
        test.done();
      },

      'if "resource" is not specified'(test: Test) {
        test.throws(() => ArnUtils.parse('arn:aws:service:::'), /The `resource` component \(6th component\) is required/);
        test.done();
      }
    },

    'various successful parses'(test: Test) {
      const tests: { [arn: string]: ArnComponents } = {
        'arn:aws:a4b:region:accountid:resourcetype/resource': {
          partition: 'aws',
          service: 'a4b',
          region: 'region',
          account: 'accountid',
          resource: 'resourcetype',
          resourceName: 'resource',
          sep: '/'
        },
        'arn:aws:apigateway:us-east-1::a123456789012bc3de45678901f23a45:/test/mydemoresource/*': {
          partition: 'aws',
          service: 'apigateway',
          region: 'us-east-1',
          resource: 'a123456789012bc3de45678901f23a45',
          sep: ':',
          resourceName: '/test/mydemoresource/*'
        },
        'arn:aws-cn:cloud9::123456789012:environment:81e900317347585a0601e04c8d52eaEX': {
          partition: 'aws-cn',
          service: 'cloud9',
          account: '123456789012',
          resource: 'environment',
          resourceName: '81e900317347585a0601e04c8d52eaEX',
          sep: ':'
        },
        'arn::cognito-sync:::identitypool/us-east-1:1a1a1a1a-ffff-1111-9999-12345678:bla': {
          service: 'cognito-sync',
          resource: 'identitypool',
          resourceName: 'us-east-1:1a1a1a1a-ffff-1111-9999-12345678:bla',
          sep: '/'
        },
        'arn:aws:s3:::my_corporate_bucket': {
          partition: 'aws',
          service: 's3',
          resource: 'my_corporate_bucket'
        }
      };

      Object.keys(tests).forEach(arn => {
        const expected = tests[arn];
        test.deepEqual(ArnUtils.parse(arn), expected, arn);
      });

      test.done();
    },

    'a Token with : separator'(test: Test) {
      const theToken = { Ref: 'SomeParameter' };
      const parsed = ArnUtils.parseToken(new Token(() => theToken), ':');

      test.deepEqual(resolve(parsed.partition), { 'Fn::Select': [ 1, { 'Fn::Split': [ ':', theToken ]} ]});
      test.deepEqual(resolve(parsed.service), { 'Fn::Select': [ 2, { 'Fn::Split': [ ':', theToken ]} ]});
      test.deepEqual(resolve(parsed.region), { 'Fn::Select': [ 3, { 'Fn::Split': [ ':', theToken ]} ]});
      test.deepEqual(resolve(parsed.account), { 'Fn::Select': [ 4, { 'Fn::Split': [ ':', theToken ]} ]});
      test.deepEqual(resolve(parsed.resource), { 'Fn::Select': [ 5, { 'Fn::Split': [ ':', theToken ]} ]});
      test.deepEqual(resolve(parsed.resourceName), { 'Fn::Select': [ 6, { 'Fn::Split': [ ':', theToken ]} ]});
      test.equal(parsed.sep, ':');

      test.done();
    },

    'a Token with / separator'(test: Test) {
      const theToken = { Ref: 'SomeParameter' };
      const parsed = ArnUtils.parseToken(new Token(() => theToken));

      test.equal(parsed.sep, '/');

      // tslint:disable-next-line:max-line-length
      test.deepEqual(resolve(parsed.resource), { 'Fn::Select': [ 0, { 'Fn::Split': [ '/', { 'Fn::Select': [ 5, { 'Fn::Split': [ ':', theToken ]} ]} ]} ]});
      // tslint:disable-next-line:max-line-length
      test.deepEqual(resolve(parsed.resourceName), { 'Fn::Select': [ 1, { 'Fn::Split': [ '/', { 'Fn::Select': [ 5, { 'Fn::Split': [ ':', theToken ]} ]} ]} ]});

      test.done();
    }
  },

};
