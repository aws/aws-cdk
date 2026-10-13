import { Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import * as logs from '../../aws-logs';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import type { S3ObjectCopyProps } from '../lib/private/s3-object-copy';
import { S3ObjectCopy } from '../lib/private/s3-object-copy';

let stack: cdk.Stack;
let sourceBucket: s3.IBucket;
let destinationBucket: s3.IBucket;

beforeEach(() => {
  stack = new cdk.Stack();
  sourceBucket = new s3.Bucket(stack, 'Source');
  destinationBucket = new s3.Bucket(stack, 'Destination', { versioned: true });
});

const minimalProps = (overrides: Partial<S3ObjectCopyProps> = {}): S3ObjectCopyProps => ({
  sourceBucket,
  sourceKey: 'incoming/app.zip',
  destinationBucket,
  destinationKey: 'app.zip',
  destinationKeyPattern: 'app.zip',
  ...overrides,
});

describe('S3ObjectCopy', () => {
  test('creates a custom resource carrying the source and destination', () => {
    new S3ObjectCopy(stack, 'Copy', minimalProps());

    Template.fromStack(stack).hasResourceProperties('Custom::S3ObjectCopy', {
      SourceBucketName: { Ref: stack.getLogicalId(sourceBucket.node.defaultChild as cdk.CfnElement) },
      SourceObjectKey: 'incoming/app.zip',
      DestinationBucketName: { Ref: stack.getLogicalId(destinationBucket.node.defaultChild as cdk.CfnElement) },
      DestinationObjectKey: 'app.zip',
    });
  });

  test('versionId resolves to the custom resource attribute', () => {
    const copy = new S3ObjectCopy(stack, 'Copy', minimalProps());

    const resolved = stack.resolve(copy.versionId);
    expect(resolved['Fn::GetAtt'][0]).toMatch(/^Copy/);
    expect(resolved['Fn::GetAtt'][1]).toEqual('VersionId');
  });

  test('does not attach an AWS CLI layer', () => {
    new S3ObjectCopy(stack, 'Copy', minimalProps());

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::LayerVersion', 0);
  });

  test('grants the handler read on the whole source bucket and put on the destination key', () => {
    new S3ObjectCopy(stack, 'Copy', minimalProps());

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['s3:GetObject*']),
            Effect: 'Allow',
            Resource: [
              { 'Fn::GetAtt': [Match.stringLikeRegexp('Source.*'), 'Arn'] },
              { 'Fn::Join': ['', [{ 'Fn::GetAtt': [Match.stringLikeRegexp('Source.*'), 'Arn'] }, '/*']] },
            ],
          }),
          Match.objectLike({
            Action: Match.arrayWith(['s3:PutObject']),
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', [{ 'Fn::GetAtt': [Match.stringLikeRegexp('Destination.*'), 'Arn'] }, '/app.zip']],
            },
          }),
        ]),
      },
    });
  });

  test('grants the handler delete on the destination key and a version listing on the bucket', () => {
    // Deletion removes every version of the key, so the role needs DeleteObjectVersion on the
    // object and ListBucketVersions on the bucket. Without a cleanup pattern the delete grant
    // is limited to the destination key.
    new S3ObjectCopy(stack, 'Copy', minimalProps());

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 's3:DeleteObject*',
            Resource: {
              'Fn::Join': ['', [{ 'Fn::GetAtt': [Match.stringLikeRegexp('Destination.*'), 'Arn'] }, '/app.zip']],
            },
          }),
          Match.objectLike({
            Action: 's3:ListBucketVersions',
            Resource: { 'Fn::GetAtt': [Match.stringLikeRegexp('Destination.*'), 'Arn'] },
          }),
        ]),
      },
    });
  });

  test('widens the put and delete grants to the destination key pattern', () => {
    new S3ObjectCopy(stack, 'Copy', minimalProps({ destinationKeyPattern: 'code/*' }));

    const statements = Object.values(Template.fromStack(stack).findResources('AWS::IAM::Policy'))
      .flatMap((policy: any) => policy.Properties.PolicyDocument.Statement);
    const resourceSuffix = (statement: any) => statement.Resource['Fn::Join'][1][1];

    const deleteStatements = statements.filter((statement: any) => statement.Action === 's3:DeleteObject*');
    expect(deleteStatements).toHaveLength(1);
    expect(resourceSuffix(deleteStatements[0])).toEqual('/code/*');

    const putStatements = statements.filter((statement: any) => [statement.Action].flat().includes('s3:PutObject'));
    expect(putStatements).toHaveLength(1);
    expect(resourceSuffix(putStatements[0])).toEqual('/code/*');
  });

  test('exposes the handler role', () => {
    const copy = new S3ObjectCopy(stack, 'Copy', minimalProps());

    expect(copy.handlerRole).toBeDefined();
  });

  describe('singleton handler', () => {
    test('two copies with the same configuration share one function', () => {
      new S3ObjectCopy(stack, 'Copy1', minimalProps());
      new S3ObjectCopy(stack, 'Copy2', minimalProps({ destinationKey: 'other.zip' }));

      const template = Template.fromStack(stack);
      template.resourceCountIs('Custom::S3ObjectCopy', 2);
      template.resourceCountIs('AWS::Lambda::Function', 1);
    });

    test('a copy in a VPC gets its own function', () => {
      const vpc = new ec2.Vpc(stack, 'Vpc');

      new S3ObjectCopy(stack, 'Copy1', minimalProps());
      new S3ObjectCopy(stack, 'Copy2', minimalProps({ destinationKey: 'other.zip', vpc }));

      Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 2);
    });

    test('a copy with a custom role gets its own function', () => {
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      new S3ObjectCopy(stack, 'Copy1', minimalProps());
      new S3ObjectCopy(stack, 'Copy2', minimalProps({ destinationKey: 'other.zip', role }));

      Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 2);
    });

    test('a copy with different security groups gets its own function', () => {
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const securityGroups = [new ec2.SecurityGroup(stack, 'Sg', { vpc })];

      new S3ObjectCopy(stack, 'Copy1', minimalProps({ vpc }));
      new S3ObjectCopy(stack, 'Copy2', minimalProps({ destinationKey: 'other.zip', vpc, securityGroups }));

      Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 2);
    });

    test('the order of security groups does not affect the function identity', () => {
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const first = new ec2.SecurityGroup(stack, 'Sg1', { vpc });
      const second = new ec2.SecurityGroup(stack, 'Sg2', { vpc });

      new S3ObjectCopy(stack, 'Copy1', minimalProps({ vpc, securityGroups: [first, second] }));
      new S3ObjectCopy(stack, 'Copy2', minimalProps({
        destinationKey: 'other.zip',
        vpc,
        securityGroups: [second, first],
      }));

      Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);
    });

    test('a copy with a different log group gets its own function', () => {
      const logGroup = new logs.LogGroup(stack, 'LogGroup');

      new S3ObjectCopy(stack, 'Copy1', minimalProps());
      new S3ObjectCopy(stack, 'Copy2', minimalProps({ destinationKey: 'other.zip', logGroup }));

      Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 2);
    });

    describe('vpcSubnets', () => {
      test('a copy selecting different subnets gets its own function', () => {
        const vpc = new ec2.Vpc(stack, 'Vpc');

        new S3ObjectCopy(stack, 'Copy1', minimalProps({
          vpc,
          vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        }));
        new S3ObjectCopy(stack, 'Copy2', minimalProps({
          destinationKey: 'other.zip',
          vpc,
          vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS, onePerAz: true },
        }));

        Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 2);
      });

      test('a copy selecting the same subnets shares one function', () => {
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const vpcSubnets = { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS };

        new S3ObjectCopy(stack, 'Copy1', minimalProps({ vpc, vpcSubnets }));
        new S3ObjectCopy(stack, 'Copy2', minimalProps({ destinationKey: 'other.zip', vpc, vpcSubnets }));

        Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);
      });

      test('selecting subnets explicitly does not fail to synthesize', () => {
        // `SubnetSelection.subnets` holds constructs, so identifying the selection by
        // stringifying it would throw on the circular construct tree.
        const vpc = new ec2.Vpc(stack, 'Vpc');

        new S3ObjectCopy(stack, 'Copy1', minimalProps({
          vpc,
          vpcSubnets: { subnets: vpc.privateSubnets },
        }));
        new S3ObjectCopy(stack, 'Copy2', minimalProps({
          destinationKey: 'other.zip',
          vpc,
          vpcSubnets: { subnets: [vpc.privateSubnets[0]] },
        }));

        Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 2);
      });
    });
  });

  describe('options are passed to the handler', () => {
    test('vpc places the function in the VPC', () => {
      const vpc = new ec2.Vpc(stack, 'Vpc');

      new S3ObjectCopy(stack, 'Copy', minimalProps({ vpc }));

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: Match.objectLike({
          SubnetIds: Match.anyValue(),
        }),
      });
    });

    test('role is used as the function execution role', () => {
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      const copy = new S3ObjectCopy(stack, 'Copy', minimalProps({ role }));

      expect(copy.handlerRole.roleArn).toEqual(role.roleArn);
    });
  });

  test('the handler timeout is long enough to copy a large object', () => {
    new S3ObjectCopy(stack, 'Copy', minimalProps());

    // lambda.Function defaults to 3 seconds, which would fail on any sizeable object.
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Timeout: 900,
    });
  });
});
