import { Annotations, Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import { PolicyStatement, Role, ServicePrincipal } from '../../aws-iam';
import { Alias, Key } from '../../aws-kms';
import { LogGroup } from '../../aws-logs';
import { Bucket } from '../../aws-s3';
import * as ssm from '../../aws-ssm';
import { App, CfnParameter, Fn, NestedStack, Stack, Tags, Duration, Tokenization } from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { lit } from '../../core/lib/private/literal-string';
import { NetworkConnector, NetworkConnectorComputeType, NetworkConnectorConfiguration, NetworkConnectorProtocol } from '../lib/network-connector';
import { WebFunction, WebFunctionAuthType, WebFunctionEndpointType, WebFunctionRegions, WebFunctionReplicaRegions } from '../lib/webfunction';
import type { WebFunctionProps } from '../lib/webfunction';
import { WebFunctionCode } from '../lib/webfunction-code';
import { WebFunctionRuntime } from '../lib/webfunction-runtime';

// Use a mock bucket object for minimal test props. It behaves like an
// imported bucket: no inspectable versioning and a no-op resource policy.
const mockBucket = {
  bucketName: 'my-code-bucket',
  bucketArn: 'arn:aws:s3:::my-code-bucket',
  arnForObjects: (key: string) => `arn:aws:s3:::my-code-bucket/${key}`,
  addToResourcePolicy: () => ({ statementAdded: false }),
  node: { addr: '', defaultChild: undefined },
} as any;

const minimalProps = (overrides: Record<string, any> = {}) => ({
  code: WebFunctionCode.fromBucket(mockBucket, 'code.zip'),
  runtime: WebFunctionRuntime.NODEJS_24_X,
  authType: WebFunctionAuthType.IAM_AUTH,
  ...overrides,
});

describe('WebFunction validation', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('isWebFunction recognizes a WebFunction only', () => {
    const fn = new WebFunction(stack, 'Test', minimalProps());
    const imported = WebFunction.fromWebFunctionArn(stack, 'Imported',
      'arn:aws:lambda:us-east-1:123456789012:web-function/other');

    expect(WebFunction.isWebFunction(fn)).toBe(true);
    expect(WebFunction.isWebFunction(imported)).toBe(false);
    expect(WebFunction.isWebFunction(stack)).toBe(false);
    expect(WebFunction.isWebFunction({})).toBe(false);
    expect(WebFunction.isWebFunction(null)).toBe(false);
  });

  describe('functionName', () => {
    test('throws when name exceeds 64 characters', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({ webFunctionName: 'a'.repeat(65) }),
        );
      }).toThrow(/must be 2 to 64 characters/);
    });

    test('throws when name contains invalid characters', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({ webFunctionName: 'invalid name!' }),
        );
      }).toThrow(/must be 2 to 64 characters of letters, numbers, hyphens or underscores/);
    });

    test('throws when name starts or ends with a hyphen or underscore', () => {
      // The service's own regex excludes them at either end.
      for (const name of ['-leading', 'trailing-', '_leading', 'trailing_']) {
        expect(() => new WebFunction(stack, `Test${name}`, minimalProps({ webFunctionName: name })))
          .toThrow(/starting and ending with a letter or number/);
      }
    });

    test('throws on a single character and on an empty name', () => {
      // An empty name used to skip validation entirely and reach the template.
      for (const name of ['a', '']) {
        expect(() => new WebFunction(stack, `Test${name}`, minimalProps({ webFunctionName: name })))
          .toThrow(/must be 2 to 64 characters/);
      }
    });

    test('accepts valid name with hyphens and underscores', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({ webFunctionName: 'my-valid_function-01' }),
        );
      }).not.toThrow();
    });

    test('accepts name at exactly 64 characters', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({ webFunctionName: 'a'.repeat(64) }),
        );
      }).not.toThrow();
    });

    test('validates endpointName by the same rule', () => {
      // The service uses one regex for both names.
      for (const name of ['-leading', 'a', 'a'.repeat(65), 'bad name']) {
        expect(() => new WebFunction(stack, `Test${name}`, minimalProps({ endpointName: name })))
          .toThrow(/Endpoint name .* must be 2 to 64 characters/);
      }
      expect(() => new WebFunction(stack, 'Ok', minimalProps({ endpointName: 'my-endpoint_01' })))
        .not.toThrow();
    });

    test('auto-generated name obeys the CFN FunctionName contract', () => {
      // No webFunctionName — the construct calls generatePhysicalName() so an
      // env-agnostic stack still produces the CFN-required FunctionName.
      // Guards the { maxLength: 40 } + charset contract stated on the override.
      new WebFunction(stack, 'MyLongLogicalIdWebFunction', minimalProps());
      const resources = Template.fromStack(stack).findResources('AWS::Lambda::WebFunction');
      const generatedName = Object.values(resources)[0].Properties.FunctionName;
      expect(typeof generatedName).toBe('string');
      expect(generatedName.length).toBeLessThanOrEqual(40);
      expect(generatedName).toMatch(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,62}[a-zA-Z0-9]$/);
    });
  });

  describe('revisionDescription', () => {
    test('throws when description exceeds 256 characters', () => {
      expect(() => {
        new WebFunction(stack, 'Test', minimalProps({ revisionDescription: 'a'.repeat(257) }));
      }).toThrow(/cannot be longer than 256 characters/);
    });

    test('accepts description at exactly 256 characters', () => {
      expect(() => {
        new WebFunction(stack, 'Test', minimalProps({ revisionDescription: 'a'.repeat(256) }));
      }).not.toThrow(/cannot be longer than 256 characters/);
    });
  });

  describe('timeout', () => {
    test('throws when timeout is less than 1 second', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({ timeout: Duration.seconds(0) }),
        );
      }).toThrow(/Timeout must be an integer between 3 and 900 seconds/);
    });

    test('throws when timeout exceeds 900 seconds', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({ timeout: Duration.seconds(901) }),
        );
      }).toThrow(/Timeout must be an integer between 3 and 900 seconds/);
    });

    test('throws when timeout is not an integer', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({ timeout: Duration.millis(1500) }),
        );
      }).toThrow(/Timeout must be an integer between 3 and 900 seconds/);
    });

    test('accepts timeout at min boundary', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({ timeout: Duration.seconds(3) }),
        );
      }).not.toThrow(/Timeout must be/);
    });

    test('accepts timeout at max boundary', () => {
      expect(() => {
        new WebFunction(stack, 'Test', minimalProps({ timeout: Duration.seconds(900) }));
      }).not.toThrow(/Timeout must be/);
    });

    test('passes a deploy-time value in seconds through unchecked', () => {
      const seconds = new CfnParameter(stack, 'Timeout', { type: 'Number' });
      new WebFunction(stack, 'Test', minimalProps({ timeout: Duration.seconds(seconds.valueAsNumber) }));

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
        ServiceConfig: { TimeoutSeconds: { Ref: 'Timeout' } },
      });
    });

    // TimeoutSeconds is a number of seconds and CloudFormation has no arithmetic, so a
    // deploy-time value in another unit cannot be converted. Duration rejects it and names the fix.
    test('rejects a deploy-time value in another unit', () => {
      const minutes = new CfnParameter(stack, 'Timeout', { type: 'Number' });

      expect(() => {
        new WebFunction(stack, 'Test', minimalProps({ timeout: Duration.minutes(minutes.valueAsNumber) }));
      }).toThrow(/Duration must be specified as 'Duration.seconds\(\)'/);
    });
  });

  describe('maxConcurrencyPerEnvironment', () => {
    test.each([0, 129, 1.5])('throws when value is %p', (value) => {
      expect(() => {
        new WebFunction(stack, 'Test', minimalProps({ maxConcurrencyPerEnvironment: value }));
      }).toThrow(/maxConcurrencyPerEnvironment must be an integer between 1 and 128/);
    });

    test.each([1, 128])('accepts boundary value %p', (value) => {
      expect(() => {
        new WebFunction(stack, 'Test', minimalProps({ maxConcurrencyPerEnvironment: value }));
      }).not.toThrow();
    });

    test('accepts a deploy-time value it cannot check', () => {
      const value = new CfnParameter(stack, 'Concurrency', { type: 'Number' }).valueAsNumber;

      expect(() => {
        new WebFunction(stack, 'Test', minimalProps({ maxConcurrencyPerEnvironment: value }));
      }).not.toThrow();
    });
  });

  describe('endpointDescription', () => {
    test('throws when longer than 256 characters', () => {
      expect(() => {
        new WebFunction(stack, 'Test', minimalProps({ endpointDescription: 'a'.repeat(257) }));
      }).toThrow(/Endpoint description cannot be longer than 256 characters/);
    });

    test('accepts 256 characters', () => {
      expect(() => {
        new WebFunction(stack, 'Test', minimalProps({ endpointDescription: 'a'.repeat(256) }));
      }).not.toThrow();
    });
  });

  describe('maxEnvironments', () => {
    test.each([1, 2.5])('throws when value is %p', (value) => {
      expect(() => {
        new WebFunction(stack, 'Test', minimalProps({ maxEnvironments: value }));
      }).toThrow(/maxEnvironments must be an integer of 2 or greater/);
    });

    test('accepts the lower boundary', () => {
      expect(() => {
        new WebFunction(stack, 'Test', minimalProps({ maxEnvironments: 2 }));
      }).not.toThrow();
    });

    test('accepts a large value, since the schema declares no upper bound', () => {
      expect(() => {
        new WebFunction(stack, 'Test', minimalProps({ maxEnvironments: 100000 }));
      }).not.toThrow();
    });
  });

  describe('rateLimit', () => {
    test.each([-1, 0.5])('throws when value is %p', (value) => {
      expect(() => {
        new WebFunction(stack, 'Test', minimalProps({ rateLimit: value }));
      }).toThrow(/rateLimit must be an integer of 0 or greater/);
    });

    test('accepts zero, which the schema allows', () => {
      expect(() => {
        new WebFunction(stack, 'Test', minimalProps({ rateLimit: 0 }));
      }).not.toThrow();
    });
  });

  describe('endpointType', () => {
    test('throws when HOME_REGION is used with replicaRegions', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({
            endpointType: WebFunctionEndpointType.HOME_REGION,
            replicaRegions: WebFunctionReplicaRegions.of(['us-east-1', 'us-west-2']),
          }),
        );
      }).toThrow(/replicaRegions cannot be specified when endpointType is HOME_REGION/);
    });

    test('throws when MULTI_REGION is used without replicaRegions', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({
            endpointType: WebFunctionEndpointType.MULTI_REGION,
          }),
        );
      }).toThrow(/replicaRegions must be specified when endpointType is MultiRegion/);
    });

    test('accepts MULTI_REGION with replicaRegions', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({
            endpointType: WebFunctionEndpointType.MULTI_REGION,
            replicaRegions: WebFunctionReplicaRegions.of(['us-east-1', 'us-west-2']),
          }),
        );
      }).not.toThrow();
    });

    test('throws when MULTI_REGION replicaRegions resolves to empty list', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({
            endpointType: WebFunctionEndpointType.MULTI_REGION,
            replicaRegions: WebFunctionReplicaRegions.of(WebFunctionRegions.US, WebFunctionRegions.US),
          }),
        );
      }).toThrow(/replicaRegions resolved to an empty list/);
    });

    test('passes a deploy-time replicaRegions list through to the endpoint without validating it', () => {
      const regions = Fn.split(',', new CfnParameter(stack, 'Regions').valueAsString);
      new WebFunction(
        stack,
        'Test',
        minimalProps({
          endpointType: WebFunctionEndpointType.MULTI_REGION,
          replicaRegions: WebFunctionReplicaRegions.of(regions),
        }),
      );

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionEndpoint', {
        Regions: { 'Fn::Split': [',', { Ref: 'Regions' }] },
      });
    });

    test('accepts HOME_REGION without replicaRegions', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({
            endpointType: WebFunctionEndpointType.HOME_REGION,
          }),
        );
      }).not.toThrow();
    });

    test('throws when PER_REGION is used without replicaRegions', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({
            endpointType: WebFunctionEndpointType.PER_REGION,
          }),
        );
      }).toThrow(/replicaRegions must be specified when endpointType is PerRegion/);
    });

    test('accepts PER_REGION with replicaRegions', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({
            endpointType: WebFunctionEndpointType.PER_REGION,
            replicaRegions: WebFunctionReplicaRegions.of(['us-east-1', 'us-west-2']),
          }),
        );
      }).not.toThrow();
    });

    test('throws when PER_REGION replicaRegions resolves to empty list', () => {
      expect(() => {
        new WebFunction(
          stack,
          'Test',
          minimalProps({
            endpointType: WebFunctionEndpointType.PER_REGION,
            replicaRegions: WebFunctionReplicaRegions.of(WebFunctionRegions.US, WebFunctionRegions.US),
          }),
        );
      }).toThrow(/replicaRegions resolved to an empty list/);
    });
  });
});

describe('WebFunctionReplicaRegions', () => {
  test('is not treated as a token', () => {
    expect(Tokenization.isResolvable(WebFunctionReplicaRegions.of(WebFunctionRegions.US))).toBe(false);
  });

  test('includes individual regions', () => {
    expect(WebFunctionReplicaRegions.of(['us-east-1', 'eu-west-1'])._toRegionList()).toEqual(['us-east-1', 'eu-west-1']);
  });

  test('includes a region group', () => {
    expect(WebFunctionReplicaRegions.of(WebFunctionRegions.US)._toRegionList()).toEqual(['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2']);
  });

  test('combines strings and groups via spread', () => {
    expect(WebFunctionReplicaRegions.of(['sa-east-1', ...WebFunctionRegions.CA])._toRegionList()).toEqual(['sa-east-1', 'ca-central-1']);
  });

  test('excludes individual regions', () => {
    expect(WebFunctionReplicaRegions.of(WebFunctionRegions.US, ['us-west-1'])._toRegionList()).toEqual(['us-east-1', 'us-east-2', 'us-west-2']);
  });

  test('passes a deploy-time list through unchanged when nothing is excluded', () => {
    const stack = new Stack();
    const list = Fn.split(',', new CfnParameter(stack, 'Regions').valueAsString);
    expect(WebFunctionReplicaRegions.of(list)._toRegionList()).toBe(list);
  });

  test('rejects exclusion when the included list is a deploy-time value', () => {
    const stack = new Stack();
    const list = Fn.split(',', new CfnParameter(stack, 'Regions').valueAsString);
    expect(() => WebFunctionReplicaRegions.of(list, ['eu-west-1'])._toRegionList())
      .toThrow(/concrete region strings/);
  });

  test('rejects exclusion when the excluded list is a deploy-time value', () => {
    const stack = new Stack();
    const list = Fn.split(',', new CfnParameter(stack, 'Excluded').valueAsString);
    expect(() => WebFunctionReplicaRegions.of(WebFunctionRegions.US, list)._toRegionList())
      .toThrow(/concrete region strings/);
  });

  test('rejects exclusion when a single region is a deploy-time value', () => {
    const stack = new Stack();
    const region = new CfnParameter(stack, 'Region').valueAsString;
    expect(() => WebFunctionReplicaRegions.of(['us-east-1', region], ['eu-west-1'])._toRegionList())
      .toThrow(/concrete region strings/);
  });

  test('excludes a region group', () => {
    const regions = WebFunctionReplicaRegions.of(WebFunctionRegions.ALL_DEFAULT_REGIONS, WebFunctionRegions.EU)._toRegionList();
    expect(regions).not.toContain('eu-west-1');
    expect(regions).not.toContain('eu-central-1');
    expect(regions).toContain('us-east-1');
  });

  test('deduplicates regions', () => {
    const regions = WebFunctionReplicaRegions.of(['us-east-1', 'us-east-1', ...WebFunctionRegions.US])._toRegionList();
    expect(regions.length).toBe(new Set(regions).size);
  });

  test('returns empty array when all included regions are excluded', () => {
    expect(WebFunctionReplicaRegions.of(WebFunctionRegions.US, WebFunctionRegions.US)._toRegionList()).toEqual([]);
  });
});

describe('WebFunction template', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('creates all three CFN resources', () => {
    new WebFunction(
      stack,
      'Test',
      minimalProps({ webFunctionName: 'my-func' }),
    );
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::Lambda::WebFunction', 1);
    template.resourceCountIs('AWS::Lambda::WebFunctionRevision', 1);
    template.resourceCountIs('AWS::Lambda::WebFunctionEndpoint', 1);
  });

  test('WebFunction resource carries the function name, and Tags.of tags it', () => {
    // Only AWS::Lambda::WebFunction is taggable; the revision and endpoint are not.
    const fn = new WebFunction(
      stack,
      'Test',
      minimalProps({ webFunctionName: 'my-func' }),
    );
    Tags.of(fn).add('env', 'prod');
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::WebFunction', {
      FunctionName: 'my-func',
      Tags: Match.arrayWith([
        Match.objectLike({ Key: 'env', Value: 'prod' }),
      ]),
    });
  });

  test('the tags prop tags the WebFunction resource', () => {
    new WebFunction(stack, 'Test', minimalProps({ webFunctionName: 'my-func', tags: { env: 'prod' } }));

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunction', {
      Tags: [{ Key: 'env', Value: 'prod' }],
    });
  });

  test('WebFunctionRevision carries maxConcurrencyPerEnvironment in ServiceConfig', () => {
    new WebFunction(stack, 'Test', minimalProps({ maxConcurrencyPerEnvironment: 32 }));

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: Match.objectLike({ MaxConcurrencyPerEnvironment: 32 }),
    });
  });

  test('WebFunctionEndpoint carries the description, scaling and throttle settings', () => {
    new WebFunction(stack, 'Test', minimalProps({
      endpointDescription: 'my endpoint',
      maxEnvironments: 50,
      rateLimit: 500,
    }));

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionEndpoint', {
      Description: 'my endpoint',
      ScalingConfig: { MaxEnvironments: 50 },
      ThrottleConfig: { RateLimit: 500 },
    });
  });

  test('omits the optional revision and endpoint settings when not configured', () => {
    // ScalingConfig and ThrottleConfig each wrap a single member, so they must be left out
    // entirely rather than emitted as empty objects — an empty struct would override the
    // service defaults with nothing.
    new WebFunction(stack, 'Test', minimalProps());
    const template = Template.fromStack(stack);

    const revision = Object.values(template.findResources('AWS::Lambda::WebFunctionRevision'))[0] as any;
    expect(revision.Properties.ServiceConfig).not.toHaveProperty('MaxConcurrencyPerEnvironment');

    const endpoint = Object.values(template.findResources('AWS::Lambda::WebFunctionEndpoint'))[0] as any;
    expect(endpoint.Properties).not.toHaveProperty('Description');
    expect(endpoint.Properties).not.toHaveProperty('ScalingConfig');
    expect(endpoint.Properties).not.toHaveProperty('ThrottleConfig');
  });

  test('WebFunctionRevision sets KmsKeyArn from a customer-managed key', () => {
    const key = new Key(stack, 'Key');
    new WebFunction(
      stack,
      'Test',
      minimalProps({ webFunctionName: 'my-func', kmsKey: key }),
    );

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      KmsKeyArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('Key'), 'Arn'] },
    });
  });

  test('grants the Lambda service principal usage of the environment variable key', () => {
    const key = new Key(stack, 'Key');
    new WebFunction(
      stack,
      'Test',
      minimalProps({ webFunctionName: 'my-func', kmsKey: key }),
    );

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Allow',
            Principal: { Service: 'lambda.amazonaws.com' },
            Action: [
              'kms:Decrypt',
              'kms:GenerateDataKey',
              'kms:DescribeKey',
            ],
            // Scoped so another account cannot induce the service to use this key, and so the
            // service may only use it on behalf of a WebFunction revision in this account.
            Condition: Match.exact({
              StringEquals: { 'aws:SourceAccount': { Ref: 'AWS::AccountId' } },
              ArnLike: {
                'aws:SourceArn': {
                  'Fn::Join': ['', [
                    'arn:', { Ref: 'AWS::Partition' }, ':lambda:', { Ref: 'AWS::Region' }, ':',
                    { Ref: 'AWS::AccountId' }, ':web-function/*/revision/*',
                  ]],
                },
              },
            }),
          }),
        ]),
      },
    });
  });

  test('functions sharing one key contribute a single key policy statement', () => {
    const key = new Key(stack, 'Key');
    new WebFunction(stack, 'First', minimalProps({ kmsKey: key }));
    new WebFunction(stack, 'Second', minimalProps({ kmsKey: key }));
    new WebFunction(stack, 'Third', minimalProps({ kmsKey: key }));

    const keys = Template.fromStack(stack).findResources('AWS::KMS::Key');
    const statements = Object.values(keys)[0].Properties.KeyPolicy.Statement;
    const serviceStatements = statements.filter(
      (s: any) => s.Principal?.Service === 'lambda.amazonaws.com',
    );

    // The condition only varies by account, so the three grants are identical
    // and collapse. A key shared by many functions does not accumulate
    // statements toward the key policy size limit.
    expect(serviceStatements).toHaveLength(1);
  });

  test('warns when the environment variable key is imported', () => {
    const imported = Key.fromKeyArn(
      stack,
      'Imported',
      'arn:aws:kms:us-west-2:123456789012:key/abcd1234-1234-1234-1234-abcd1234abcd',
    );
    new WebFunction(
      stack,
      'Test',
      minimalProps({ webFunctionName: 'my-func', kmsKey: imported }),
    );

    Annotations.fromStack(stack).hasWarning(
      '/Default/Test',
      Match.stringLikeRegexp('Cannot grant the Lambda service principal usage of the imported KMS key'),
    );
  });

  test('rejects a KMS alias defined in the app as kmsKey', () => {
    // An alias implements IKeyRef, but its keyRef.keyArn is the alias ARN.
    const alias = new Key(stack, 'Key').addAlias('alias/my-key');

    expect(() => new WebFunction(stack, 'Test', minimalProps({ kmsKey: alias })))
      .toThrow(/kmsKey must be a KMS key, not an alias/);
  });

  test('rejects an imported KMS alias as kmsKey', () => {
    const alias = Alias.fromAliasName(stack, 'Alias', 'alias/my-key');

    expect(() => new WebFunction(stack, 'Test', minimalProps({ kmsKey: alias })))
      .toThrow(/kmsKey must be a KMS key, not an alias/);
  });

  test('rejects a key ARN that does not name a key', () => {
    const notAKey = Key.fromKeyArn(stack, 'NotAKey', 'arn:aws:kms:us-west-2:123456789012:alias/my-key');

    expect(() => new WebFunction(stack, 'Test', minimalProps({ kmsKey: notAKey })))
      .toThrow(/kmsKey must be a KMS key ARN containing ':key\/', got 'arn:aws:kms:us-west-2:123456789012:alias\/my-key'/);
  });

  test('WebFunctionRevision has build and service config', () => {
    new WebFunction(
      stack,
      'Test',
      minimalProps({ webFunctionName: 'my-func' }),
    );
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      FunctionName: { Ref: Match.stringLikeRegexp('Function') },
      BuildConfig: {
        CodeConfig: {
          S3Object: {
            Bucket: 'my-code-bucket',
            Key: 'code.zip',
          },
        },
        RuntimeConfig: {
          Runtime: 'nodejs24.x',
        },
      },
      ServiceConfig: {
        ExecutionRoleArn: {
          'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('.*ServiceRole.*')]),
        },
        TimeoutSeconds: 30,
      },
    });
  });

  test('WebFunctionRevision uses custom timeout', () => {
    new WebFunction(
      stack,
      'Test',
      minimalProps({
        webFunctionName: 'my-func',
        timeout: Duration.seconds(120),
      }),
    );
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: {
        TimeoutSeconds: 120,
      },
    });
  });

  test('WebFunctionRevision includes environment variables', () => {
    new WebFunction(
      stack,
      'Test',
      minimalProps({
        webFunctionName: 'my-func',
        environment: { NODE_ENV: 'production' },
      }),
    );
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: {
        EnvironmentVariables: { NODE_ENV: 'production' },
      },
    });
  });

  test('entryPoint is injected as AWS_LAMBDA_NODEJS_ENTRYPOINT', () => {
    new WebFunction(
      stack,
      'Test',
      minimalProps({
        webFunctionName: 'my-func',
        entryPoint: 'app.js',
        environment: { NODE_ENV: 'production' },
      }),
    );
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: {
        EnvironmentVariables: {
          NODE_ENV: 'production',
          AWS_LAMBDA_NODEJS_ENTRYPOINT: 'app.js',
        },
      },
    });
  });

  test('throws when entryPoint is set for a non-Node.js runtime', () => {
    expect(() => new WebFunction(stack, 'Test', minimalProps({
      runtime: WebFunctionRuntime.of('python3.13'),
      entryPoint: 'app.py',
    }))).toThrow(/entryPoint is only supported for Node.js runtimes, got 'python3.13'/);
  });

  test('entryPoint is accepted for a Node.js runtime given with of()', () => {
    new WebFunction(stack, 'Test', minimalProps({
      runtime: WebFunctionRuntime.of('nodejs26.x'),
      entryPoint: 'app.js',
    }));
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: Match.objectLike({
        EnvironmentVariables: Match.objectLike({ AWS_LAMBDA_NODEJS_ENTRYPOINT: 'app.js' }),
      }),
    });
  });

  test('throws when entryPoint and AWS_LAMBDA_NODEJS_ENTRYPOINT env var are both set', () => {
    expect(() => {
      new WebFunction(
        stack,
        'Test',
        minimalProps({
          webFunctionName: 'my-func',
          entryPoint: 'app.js',
          environment: { AWS_LAMBDA_NODEJS_ENTRYPOINT: 'other.js' },
        }),
      );
    }).toThrow(/entryPoint cannot be used together with an AWS_LAMBDA_NODEJS_ENTRYPOINT environment variable/);
  });

  test('WebFunctionRevision includes telemetry config', () => {
    new WebFunction(
      stack,
      'Test',
      minimalProps({
        webFunctionName: 'my-func',
        applicationLogLevel: 'INFO' as any,
      }),
    );
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: {
        TelemetryConfig: {
          LoggingConfig: {
            ApplicationLogLevel: 'INFO',
          },
        },
      },
    });
  });

  test('WebFunctionRevision resolves NODEJS_LATEST', () => {
    new WebFunction(
      stack,
      'Test',
      minimalProps({
        webFunctionName: 'my-func',
        runtime: WebFunctionRuntime.NODEJS_LATEST,
      }),
    );
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      BuildConfig: {
        RuntimeConfig: {
          Runtime: 'nodejs24.x',
        },
      },
    });
  });

  test('WebFunctionEndpoint has defaults', () => {
    new WebFunction(
      stack,
      'Test',
      minimalProps({ webFunctionName: 'my-func' }),
    );
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::WebFunctionEndpoint', {
      FunctionName: { Ref: Match.stringLikeRegexp('Function') },
      EndpointName: 'prod',
      EndpointType: 'HomeRegion',
      RevisionWeights: [
        {
          RevisionId: Match.anyValue(),
          Weight: 100,
        },
      ],
    });
  });

  describe('the default endpoint name follows the endpoint shape', () => {
    // Type and regions are create-only, like the name, so changing them replaces the endpoint,
    // which CloudFormation cannot do under the same name.
    const nameFor = (props: Partial<WebFunctionProps>) => {
      const s = new Stack();
      new WebFunction(s, 'Test', minimalProps(props));
      const [endpoint] = Object.values(Template.fromStack(s).findResources('AWS::Lambda::WebFunctionEndpoint'));
      return endpoint.Properties.EndpointName;
    };
    const multi = (regions: string[]) => ({
      endpointType: WebFunctionEndpointType.MULTI_REGION, replicaRegions: WebFunctionReplicaRegions.of(regions),
    });

    test('a home-Region endpoint is named prod', () => {
      expect(nameFor({})).toEqual('prod');
    });

    test('a regional endpoint gets a name derived from its type and regions', () => {
      const base = nameFor(multi(['us-east-1', 'us-west-2']));
      expect(base).toMatch(/^prod-[0-9a-f]{8}$/);
      expect(nameFor(multi(['us-east-1', 'us-west-2']))).toEqual(base);
      expect(nameFor(multi(['us-east-1', 'eu-west-1']))).not.toEqual(base);
      expect(nameFor(multi(['us-west-2', 'us-east-1']))).not.toEqual(base);
      expect(nameFor({
        endpointType: WebFunctionEndpointType.PER_REGION,
        replicaRegions: WebFunctionReplicaRegions.of(['us-east-1', 'us-west-2']),
      })).not.toEqual(base);
    });

    test('an explicit name is used as given', () => {
      expect(nameFor({ ...multi(['us-east-1']), endpointName: 'live' })).toEqual('live');
    });
  });

  test('WebFunctionEndpoint with custom values', () => {
    new WebFunction(
      stack,
      'Test',
      minimalProps({
        webFunctionName: 'my-func',
        endpointName: 'staging',
        endpointType: WebFunctionEndpointType.MULTI_REGION,
        authType: WebFunctionAuthType.IAM_AUTH,
        replicaRegions: WebFunctionReplicaRegions.of(WebFunctionRegions.US),
      }),
    );
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::WebFunctionEndpoint', {
      EndpointName: 'staging',
      EndpointType: 'MultiRegion',
      AuthType: 'IamAuth',
      Regions: ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2'],
    });
  });

  test('WebFunctionEndpoint with PerRegion type emits regions', () => {
    new WebFunction(
      stack,
      'Test',
      minimalProps({
        webFunctionName: 'my-func',
        endpointType: WebFunctionEndpointType.PER_REGION,
        authType: WebFunctionAuthType.IAM_AUTH,
        replicaRegions: WebFunctionReplicaRegions.of(WebFunctionRegions.US),
      }),
    );
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::WebFunctionEndpoint', {
      EndpointType: 'PerRegion',
      Regions: ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2'],
    });
  });

  test('creates default IAM role', () => {
    new WebFunction(
      stack,
      'Test',
      minimalProps({ webFunctionName: 'my-func' }),
    );
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: { Service: 'lambda.amazonaws.com' },
          },
        ],
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            ],
          ],
        },
      ],
    });
  });

  test('uses a caller-provided role instead of creating a default one', () => {
    const role = new Role(stack, 'CustomRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    new WebFunction(
      stack,
      'Test',
      minimalProps({ webFunctionName: 'my-func', role }),
    );
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: Match.objectLike({
        ExecutionRoleArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('^CustomRole'), 'Arn'] },
      }),
    });

    // The supplied role is the only one in the stack: asserting the ARN alone would still
    // pass if a default `ServiceRole` were created alongside it and simply left unused.
    template.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('revision depends on function', () => {
    new WebFunction(
      stack,
      'Test',
      minimalProps({ webFunctionName: 'my-func' }),
    );
    const template = Template.fromStack(stack);

    template.hasResource('AWS::Lambda::WebFunctionRevision', {
      DependsOn: Match.arrayWith([Match.stringLikeRegexp('.*Function.*')]),
    });
  });

  test('endpoint depends on function and revision', () => {
    new WebFunction(
      stack,
      'Test',
      minimalProps({ webFunctionName: 'my-func' }),
    );
    const template = Template.fromStack(stack);

    template.hasResource('AWS::Lambda::WebFunctionEndpoint', {
      DependsOn: Match.arrayWith([
        Match.stringLikeRegexp('.*Function.*'),
        Match.stringLikeRegexp('.*Revision.*'),
      ]),
    });
  });

  test('exposes L1 resources and webFunctionArn', () => {
    const webFunction = new WebFunction(
      stack,
      'Test',
      minimalProps({ webFunctionName: 'my-func' }),
    );

    expect(webFunction.webFunctionArn).toBeDefined();
    expect(webFunction.resource).toBeDefined();
    expect(webFunction.resourceRevision).toBeDefined();
    expect(webFunction.resourceEndpoint).toBeDefined();
  });

  test('with bucket code', () => {
    const bucket = new Bucket(stack, 'CodeBucket', { versioned: true });
    new WebFunction(
      stack,
      'Test',
      minimalProps({
        webFunctionName: 'my-func',
        code: WebFunctionCode.fromBucket(bucket, 'my-function.zip'),
      }),
    );
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      BuildConfig: {
        CodeConfig: {
          S3Object: {
            Bucket: { Ref: Match.stringLikeRegexp('CodeBucket.*') },
            Key: 'my-function.zip',
          },
        },
      },
    });
  });

  test('rejects container image code', () => {
    const mockCode = {
      bind: () => {
        throw new ValidationError(lit`WebFunctionContainerImageNotSupported`, 'WebFunction does not support container images.', stack);
      },
      bindToResource: () => {},
    } as any;

    expect(() => {
      new WebFunction(
        stack,
        'Test',
        minimalProps({
          webFunctionName: 'my-func',
          code: mockCode,
        }),
      );
    }).toThrow(/does not support container images/);
  });

  test('WebFunctionRevision includes full logging config', () => {
    new WebFunction(
      stack,
      'Test',
      minimalProps({
        webFunctionName: 'my-func',
        applicationLogLevel: 'INFO' as any,
        systemLogLevel: 'INFO' as any,
      }),
    );
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: {
        TelemetryConfig: {
          LoggingConfig: {
            ApplicationLogLevel: 'INFO',
            SystemLogLevel: 'INFO',
          },
        },
      },
    });
  });

  test('creates a log group when none is given', () => {
    const fn = new WebFunction(stack, 'Test', minimalProps({ webFunctionName: 'my-func' }));
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::Logs::LogGroup', 1);
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      LogGroupName: Match.absent(),
    });
    template.hasResource('AWS::Logs::LogGroup', { DeletionPolicy: 'Retain' });
    const logGroupId = Object.keys(template.findResources('AWS::Logs::LogGroup'))[0];
    template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: {
        TelemetryConfig: {
          LoggingConfig: { LogGroup: { Ref: logGroupId } },
        },
      },
    });
    expect(stack.resolve(fn.logGroup.logGroupRef.logGroupName)).toEqual({ Ref: logGroupId });
  });

  test('uses the given log group instead of creating one', () => {
    const logGroup = new LogGroup(stack, 'MyLogs', { logGroupName: 'my-logs' });
    const fn = new WebFunction(stack, 'Test', minimalProps({ webFunctionName: 'my-func', logGroup }));
    const template = Template.fromStack(stack);

    expect(fn.logGroup).toBe(logGroup);
    template.resourceCountIs('AWS::Logs::LogGroup', 1);
    template.hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: {
        TelemetryConfig: {
          LoggingConfig: { LogGroup: { Ref: stack.getLogicalId(logGroup.node.defaultChild as any) } },
        },
      },
    });
  });

  test('APPLICATION_MANAGED authType emits public endpoint warning', () => {
    const warningStack = new Stack();
    new WebFunction(warningStack, 'Test', minimalProps({
      authType: WebFunctionAuthType.APPLICATION_MANAGED,
    }));

    Annotations.fromStack(warningStack).hasWarning(
      '/Default/Test',
      Match.stringLikeRegexp('.*APPLICATION_MANAGED.*'),
    );
  });

  test('IAM_AUTH authType does not emit public endpoint warning', () => {
    const noWarningStack = new Stack();
    new WebFunction(noWarningStack, 'Test', minimalProps({
      authType: WebFunctionAuthType.IAM_AUTH,
    }));

    Annotations.fromStack(noWarningStack).hasNoWarning(
      '/Default/Test',
      Match.stringLikeRegexp('APPLICATION_MANAGED'),
    );
  });
});

describe('WebFunction import', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  const arn = 'arn:aws:lambda:us-west-2:123456789012:web-function/my-function';

  test('fromWebFunctionArn round-trips the ARN', () => {
    const imported = WebFunction.fromWebFunctionArn(stack, 'Imported', arn);

    expect(imported.webFunctionArn).toEqual(arn);
    expect(imported.webFunctionRef.functionArn).toEqual(arn);
  });

  test('an imported WebFunction takes its name from the ARN', () => {
    const imported = WebFunction.fromWebFunctionArn(stack, 'Imported', arn);

    expect(imported.webFunctionName).toEqual('my-function');
    expect(imported.webFunctionRef.functionName).toEqual('my-function');
  });

  test('fromWebFunctionAttributes round-trips the ARN', () => {
    const imported = WebFunction.fromWebFunctionAttributes(stack, 'Imported', {
      webFunctionArn: arn,
    });

    expect(imported.webFunctionArn).toEqual(arn);
    expect(imported.webFunctionRef.functionArn).toEqual(arn);
  });
});

describe('WebFunction egress network connector', () => {
  const VERSION_ARN = 'arn:aws:lambda:us-west-2:123456789012:network-connector:nc-0123abcd:3';
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
  });

  function ownedConnector(
    scope: Stack, id = 'Connector', computeType = NetworkConnectorComputeType.WEB_FUNCTION,
  ): NetworkConnector {
    const vpc = new ec2.Vpc(scope, `${id}Vpc`, { maxAzs: 2, natGateways: 0 });
    return new NetworkConnector(scope, id, {
      configuration: NetworkConnectorConfiguration.vpcEgress({
        computeType,
        vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        securityGroups: [new ec2.SecurityGroup(scope, `${id}Sg`, { vpc })],
        networkProtocol: NetworkConnectorProtocol.IPV4,
      }),
    });
  }

  test('is omitted from the revision by default', () => {
    new WebFunction(stack, 'Test', minimalProps());

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: Match.objectLike({ EgressNetworkConnectorArn: Match.absent() }),
    });
  });

  test('pins the revision to the latest version of a connector in the same stack', () => {
    const connector = ownedConnector(stack);
    new WebFunction(stack, 'Test', minimalProps({ egressNetworkConnector: connector }));

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: Match.objectLike({
        EgressNetworkConnectorArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('^Connector'), 'LatestVersionArn'] },
      }),
    });
  });

  test('pins the revision to an imported version ARN as-is', () => {
    const connector = NetworkConnector.fromNetworkConnectorVersionArn(stack, 'Connector', VERSION_ARN);
    new WebFunction(stack, 'Test', minimalProps({ egressNetworkConnector: connector }));

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: Match.objectLike({ EgressNetworkConnectorArn: VERSION_ARN }),
    });
  });

  test('rejects a connector imported without a version', () => {
    const connector = NetworkConnector.fromNetworkConnectorArn(
      stack, 'Connector', 'arn:aws:lambda:us-west-2:123456789012:network-connector:nc-0123abcd');

    expect(() => new WebFunction(stack, 'Test', minimalProps({ egressNetworkConnector: connector })))
      .toThrow(/imported without a version/);
  });

  test('rejects a connector defined in another stack', () => {
    const other = new Stack(app, 'Other', { env: { account: '123456789012', region: 'us-west-2' } });
    const connector = ownedConnector(other);

    expect(() => new WebFunction(stack, 'Test', minimalProps({ egressNetworkConnector: connector })))
      .toThrow(/defined in stack 'Other', but this WebFunction is in 'Stack'.*from a literal ARN string/);
  });

  test('accepts a connector in a nested stack of the same top-level stack', () => {
    const nested = new NestedStack(stack, 'Nested');
    const connector = ownedConnector(nested);
    new WebFunction(stack, 'Test', minimalProps({ egressNetworkConnector: connector }));

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: Match.objectLike({
        EgressNetworkConnectorArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('^Nested'), Match.stringLikeRegexp('LatestVersionArn')] },
      }),
    });
  });

  test('accepts a connector in the parent of a nested stack', () => {
    const connector = ownedConnector(stack);
    const nested = new NestedStack(stack, 'Nested');
    new WebFunction(nested, 'Test', minimalProps({ egressNetworkConnector: connector }));

    Template.fromStack(nested).resourceCountIs('AWS::Lambda::WebFunctionRevision', 1);
  });

  test('rejects a connector in a nested stack of another top-level stack', () => {
    // A nested stack's stackName is a token, so the message must name stacks by path.
    const other = new Stack(app, 'Other', { env: { account: '123456789012', region: 'us-west-2' } });
    const connector = ownedConnector(new NestedStack(other, 'Nested'));

    expect(() => new WebFunction(stack, 'Test', minimalProps({ egressNetworkConnector: connector })))
      .toThrow(/defined in stack 'Other\/Nested'/);
  });

  test('rejects a connector with a regional endpoint', () => {
    const connector = NetworkConnector.fromNetworkConnectorVersionArn(stack, 'Connector', VERSION_ARN);

    expect(() => new WebFunction(stack, 'Test', minimalProps({
      egressNetworkConnector: connector,
      endpointType: WebFunctionEndpointType.MULTI_REGION,
      replicaRegions: WebFunctionReplicaRegions.of(['us-east-1', 'us-west-2']),
    }))).toThrow(/egressNetworkConnector is only supported with a HomeRegion endpoint, got MultiRegion/);
  });

  test('rejects a connector in this app created for another compute type', () => {
    const connector = ownedConnector(stack, 'Connector', NetworkConnectorComputeType.MICRO_VM);

    expect(() => new WebFunction(stack, 'Test', minimalProps({ egressNetworkConnector: connector })))
      .toThrow(/was created for MicroVm, but a WebFunction needs one created for NetworkConnectorComputeType.WEB_FUNCTION/);
  });

  test('rejects a version ARN imported from a connector in another stack', () => {
    const other = new Stack(app, 'Other', { env: { account: '123456789012', region: 'us-west-2' } });
    const source = ownedConnector(other);
    const connector = NetworkConnector.fromNetworkConnectorVersionArn(stack, 'Imported', source.latestVersionArn);

    expect(() => new WebFunction(stack, 'Test', minimalProps({ egressNetworkConnector: connector })))
      .toThrow(/was imported from a value that references '.*' in stack 'Other'/);
  });

  test('accepts a version ARN imported from a connector in the same stack', () => {
    const source = ownedConnector(stack);
    const connector = NetworkConnector.fromNetworkConnectorVersionArn(stack, 'Imported', source.latestVersionArn);
    new WebFunction(stack, 'Test', minimalProps({ egressNetworkConnector: connector }));

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::WebFunctionRevision', 1);
  });

  test('accepts a version ARN read from an SSM parameter', () => {
    const arn = ssm.StringParameter.valueForStringParameter(stack, '/connector/version-arn');
    const connector = NetworkConnector.fromNetworkConnectorVersionArn(stack, 'Imported', arn);
    new WebFunction(stack, 'Test', minimalProps({ egressNetworkConnector: connector }));

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::WebFunctionRevision', 1);
  });

  test('accepts a version ARN imported into another stack', () => {
    // An import carries no Export, so the cross-stack rule does not apply to it.
    const other = new Stack(app, 'Other', { env: { account: '123456789012', region: 'us-west-2' } });
    const connector = NetworkConnector.fromNetworkConnectorVersionArn(other, 'Connector', VERSION_ARN);
    new WebFunction(stack, 'Test', minimalProps({ egressNetworkConnector: connector }));

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::WebFunctionRevision', {
      ServiceConfig: Match.objectLike({ EgressNetworkConnectorArn: VERSION_ARN }),
    });
  });
});

describe('WebFunction grants', () => {
  let stack: Stack;
  beforeEach(() => {
    stack = new Stack();
  });

  test('exposes the default role, and grants and addToRolePolicy reach it', () => {
    const fn = new WebFunction(stack, 'Fn', minimalProps());
    expect(fn.role).toBeDefined();
    // The default role is an iam.Role, which is its own grant principal.
    expect(fn.grantPrincipal).toBe(fn.role);

    // A grant from another construct, which needs the function to be IGrantable.
    new Bucket(stack, 'Data').grantRead(fn);
    fn.addToRolePolicy(new PolicyStatement({ actions: ['sqs:SendMessage'], resources: ['*'] }));

    const template = Template.fromStack(stack);
    const roleId = Object.keys(template.findResources('AWS::IAM::Role'))[0];
    template.hasResourceProperties('AWS::IAM::Policy', {
      Roles: [{ Ref: roleId }],
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({ Action: Match.arrayWith(['s3:GetObject*']) }),
          Match.objectLike({ Action: 'sqs:SendMessage' }),
        ]),
      },
    });
  });

  test('grants reach a provided role', () => {
    const role = new Role(stack, 'Provided', { assumedBy: new ServicePrincipal('lambda.amazonaws.com') });
    const fn = new WebFunction(stack, 'Fn', minimalProps({ role }));
    expect(fn.role).toBe(role);

    fn.addToRolePolicy(new PolicyStatement({ actions: ['sqs:SendMessage'], resources: ['*'] }));

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      Roles: [{ Ref: Match.stringLikeRegexp('Provided') }],
      PolicyDocument: { Statement: [Match.objectLike({ Action: 'sqs:SendMessage' })] },
    });
  });

  test('an imported WebFunction has no role, and addToRolePolicy warns instead', () => {
    const imported = WebFunction.fromWebFunctionArn(stack, 'Imported',
      'arn:aws:lambda:us-east-1:123456789012:web-function/existing');
    expect(imported.role).toBeUndefined();

    imported.addToRolePolicy(new PolicyStatement({ actions: ['sqs:SendMessage'], resources: ['*'] }));

    Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
    Annotations.fromStack(stack).hasWarning('*', Match.stringLikeRegexp('sqs:SendMessage'));
  });
});

describe('WebFunction grants.invoke', () => {
  let stack: Stack;
  let caller: Role;
  beforeEach(() => {
    stack = new Stack();
    caller = new Role(stack, 'Caller', { assumedBy: new ServicePrincipal('ec2.amazonaws.com') });
  });

  test('grants InvokeWebFunctionEndpoint on the endpoint', () => {
    const fn = new WebFunction(stack, 'Fn', minimalProps());
    fn.grants.invoke(caller);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      Roles: [{ Ref: Match.stringLikeRegexp('Caller') }],
      PolicyDocument: {
        Statement: [{
          Action: 'lambda:InvokeWebFunctionEndpoint',
          Effect: 'Allow',
          Resource: stack.resolve(fn.endpointArn),
        }],
      },
    });
  });

  test('an imported WebFunction with an endpoint name grants on that endpoint', () => {
    const arn = 'arn:aws:lambda:us-east-1:123456789012:web-function/existing';
    const imported = WebFunction.fromWebFunctionAttributes(stack, 'Imported', {
      webFunctionArn: arn,
      endpointName: 'staging',
    });
    imported.grants.invoke(caller);

    expect(imported.endpointArn).toEqual(`${arn}/endpoint/staging`);
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [Match.objectLike({ Action: 'lambda:InvokeWebFunctionEndpoint', Resource: `${arn}/endpoint/staging` })],
      },
    });
  });

  test('an imported WebFunction without an endpoint name cannot be granted', () => {
    const imported = WebFunction.fromWebFunctionArn(stack, 'Imported',
      'arn:aws:lambda:us-east-1:123456789012:web-function/existing');

    expect(() => imported.grants.invoke(caller)).toThrow(/imported without an endpoint name/);
    expect(() => imported.endpointArn).toThrow(/imported without an endpoint name/);
  });
});
