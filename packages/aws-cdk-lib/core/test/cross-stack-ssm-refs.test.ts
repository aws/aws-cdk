import { Construct } from 'constructs';
import {
  App,
  CfnResource,
  CrossStackReferenceType,
  NestedStack,
  ResolutionTypeHint,
  Stack,
  StackReferences,
} from '../lib';
import { getWarnings } from './util';

describe('SSM-based cross-stack references', () => {
  test('basic SSM cross-stack reference between top-level stacks', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });

    // Configure SSM for references to this resource
    StackReferences.of(resource).toHere([CrossStackReferenceType.SSM]);

    const consumer = new Stack(app, 'Consumer');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: {
        BucketArn: resource.getAtt('Arn'),
      },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - Producer should have an SSM Parameter, not a CFN Export
    expect(producerTemplate.Outputs).toBeUndefined();
    expect(producerTemplate.Resources).toEqual({
      MyResource: { Type: 'AWS::S3::Bucket' },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerFnGetAttMyResourceArn761B34A26BAD27DA: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2',
          Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        },
      },
    });

    // THEN - Consumer should use {{resolve:ssm:...}} not Fn::ImportValue
    const consumerResource = consumerTemplate.Resources.ConsumerResource;
    const bucketArn = consumerResource.Properties.BucketArn;
    expect(bucketArn).toBe('{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2}}');
  });

  test('SSM reference with STRING_LIST values', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'BLA' });
    (resource as any).attrList = ['val1', 'val2'];

    StackReferences.of(resource).toHere([CrossStackReferenceType.SSM]);

    const consumer = new Stack(app, 'Consumer');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'BLA',
      properties: {
        Prop: resource.getAtt('List', ResolutionTypeHint.STRING_LIST),
      },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - Producer: SSM param value should be joined with ||
    expect(producerTemplate.Resources).toEqual({
      MyResource: { Type: 'BLA' },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerFnGetAttMyResourceList4C66B21E31B223C1: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceList4C66B21E',
          Value: { 'Fn::Join': ['||', { 'Fn::GetAtt': ['MyResource', 'List'] }] },
        },
      },
    });

    // THEN - Consumer: should split the SSM value
    const consumerResource = consumerTemplate.Resources.ConsumerResource;
    expect(consumerResource.Properties.Prop).toEqual({
      'Fn::Split': ['||', '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceList4C66B21E}}'],
    });
  });

  test('Producer inside nested stack creates SSM Parameter on parent', () => {
    // GIVEN
    const app = new App();
    const producerParent = new Stack(app, 'ProducerParent');
    const nested = new NestedStack(producerParent, 'Nested');
    const resource = new CfnResource(nested, 'MyResource', { type: 'AWS::S3::Bucket' });

    // Set SSM on the parent stack (since nested stack resources are teleported
    // to the parent, the toHere config must be on the parent or its ancestors)
    StackReferences.of(producerParent).toHere([CrossStackReferenceType.SSM]);

    const consumer = new Stack(app, 'Consumer');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: {
        BucketArn: resource.getAtt('Arn'),
      },
    });

    // WHEN
    const assembly = app.synth();
    const producerParentTemplate = assembly.getStackByName(producerParent.stackName).template;

    // THEN - SSM Parameter should be on the parent stack, not the nested stack
    const ssmResources = Object.entries(producerParentTemplate.Resources).filter(
      ([_, v]: [string, any]) => v.Type === 'AWS::SSM::Parameter',
    );
    expect(ssmResources.length).toBe(1);
    const [, ssmParam] = ssmResources[0] as [string, any];
    expect(ssmParam.Properties.Type).toBe('String');
    expect(ssmParam.Properties.Name).toMatch(/^\/cdk\/cross-stack-refs\/ProducerParent\//);
    expect(ssmParam.Properties.Value).toEqual({
      'Fn::GetAtt': [
        'NestedNestedStackNestedNestedStackResourceDEFDAA4D',
        'Outputs.ProducerParentNestedMyResource58EEE46AArn',
      ],
    });
  });

  test('Consumer inside nested stack receives SSM value via CfnParameter', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });

    StackReferences.of(resource).toHere([CrossStackReferenceType.SSM]);

    const consumerParent = new Stack(app, 'ConsumerParent');
    const nestedConsumer = new NestedStack(consumerParent, 'NestedConsumer');
    new CfnResource(nestedConsumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: {
        BucketArn: resource.getAtt('Arn'),
      },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerParentTemplate = assembly.getStackByName(consumerParent.stackName).template;

    // THEN - Producer has SSM Parameter
    expect(producerTemplate.Resources).toEqual({
      MyResource: { Type: 'AWS::S3::Bucket' },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerFnGetAttMyResourceArn761B34A26BAD27DA: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2',
          Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        },
      },
    });

    // THEN - Consumer parent passes SSM reference as parameter to nested stack
    const nestedStackResource = consumerParentTemplate.Resources.NestedConsumerNestedStackNestedConsumerNestedStackResource8CB6F5DC;
    expect(nestedStackResource.Type).toBe('AWS::CloudFormation::Stack');
    expect(nestedStackResource.Properties.Parameters).toEqual({
      referencetoProducerMyResource2D6458ECArn: '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2}}',
    });
  });

  test('MIXED mode creates both CFN Export and SSM Parameter', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });

    StackReferences.of(resource).toHere([
      CrossStackReferenceType.CFN_EXPORTS,
      CrossStackReferenceType.SSM,
    ]);

    const consumer = new Stack(app, 'Consumer');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: {
        BucketArn: resource.getAtt('Arn'),
      },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - Producer should have BOTH a CFN Export and an SSM Parameter
    expect(producerTemplate.Outputs).toEqual({
      ExportsOutputFnGetAttMyResourceArnE157F485: {
        Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        Export: { Name: 'Producer:ExportsOutputFnGetAttMyResourceArnE157F485' },
      },
    });

    expect(
      producerTemplate.Resources.SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerFnGetAttMyResourceArn761B34A26BAD27DA,
    ).toEqual({
      Type: 'AWS::SSM::Parameter',
      Properties: {
        Type: 'String',
        Name: '/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2',
        Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
      },
    });

    // THEN - Consumer should use SSM (not ImportValue)
    const consumerResource = consumerTemplate.Resources.ConsumerResource;
    const bucketArn = consumerResource.Properties.BucketArn;
    expect(bucketArn).toBe('{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2}}');
  });

  test('toHere() takes priority over fromHere()', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });

    // toHere says CFN_EXPORTS
    StackReferences.of(resource).toHere([CrossStackReferenceType.CFN_EXPORTS]);

    const consumer = new Stack(app, 'Consumer');
    // fromHere says SSM
    StackReferences.of(consumer).fromHere([CrossStackReferenceType.SSM]);

    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: {
        BucketArn: resource.getAtt('Arn'),
      },
    });

    // WHEN
    const assembly = app.synth();
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - toHere wins: should use Fn::ImportValue (CFN_EXPORTS)
    expect(consumerTemplate.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: { 'Fn::ImportValue': 'Producer:ExportsOutputFnGetAttMyResourceArnE157F485' },
        },
      },
    });
  });

  test('fromHere() is used when toHere() is not set', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });

    // No toHere configured

    const consumer = new Stack(app, 'Consumer');
    StackReferences.of(consumer).fromHere([CrossStackReferenceType.SSM]);

    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: {
        BucketArn: resource.getAtt('Arn'),
      },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - fromHere applies: SSM
    expect(producerTemplate.Resources).toEqual({
      MyResource: { Type: 'AWS::S3::Bucket' },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerFnGetAttMyResourceArn761B34A26BAD27DA: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2',
          Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        },
      },
    });

    expect(consumerTemplate.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2}}',
        },
      },
    });
  });

  test('StackReferences walks construct tree recursively', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const parent = new Construct(producer, 'Parent');
    // Set SSM on parent scope
    StackReferences.of(parent).toHere([CrossStackReferenceType.SSM]);
    // Child resource inherits parent's config
    const resource = new CfnResource(parent, 'MyResource', { type: 'AWS::S3::Bucket' });

    const consumer = new Stack(app, 'Consumer');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: {
        BucketArn: resource.getAtt('Arn'),
      },
    });

    // WHEN
    const assembly = app.synth();
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - SSM from parent scope should apply
    const consumerResource = consumerTemplate.Resources.ConsumerResource;
    expect(consumerResource.Properties.BucketArn).toMatch(/^\{\{resolve:ssm:\/cdk\/cross-stack-refs\/Producer\//);
  });

  test('nearest scope setting takes priority', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    // Stack-level: SSM
    StackReferences.of(producer).toHere([CrossStackReferenceType.SSM]);

    const parent = new Construct(producer, 'Parent');
    // Parent-level: CFN_EXPORTS (overrides stack-level)
    StackReferences.of(parent).toHere([CrossStackReferenceType.CFN_EXPORTS]);

    const resource = new CfnResource(parent, 'MyResource', { type: 'AWS::S3::Bucket' });

    const consumer = new Stack(app, 'Consumer');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: {
        BucketArn: resource.getAtt('Arn'),
      },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - nearest (CFN_EXPORTS) should win
    expect(producerTemplate.Outputs).toEqual({
      ExportsOutputFnGetAttParentMyResource4B1FDBCCArn4BB50EA9: {
        Value: { 'Fn::GetAtt': ['ParentMyResource4B1FDBCC', 'Arn'] },
        Export: { Name: 'Producer:ExportsOutputFnGetAttParentMyResource4B1FDBCCArn4BB50EA9' },
      },
    });
    expect(consumerTemplate.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: { 'Fn::ImportValue': 'Producer:ExportsOutputFnGetAttParentMyResource4B1FDBCCArn4BB50EA9' },
        },
      },
    });
  });

  test('same reference used multiple times creates only one SSM Parameter', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });
    StackReferences.of(resource).toHere([CrossStackReferenceType.SSM]);

    const consumer = new Stack(app, 'Consumer');
    // Use the same reference twice
    new CfnResource(consumer, 'ConsumerResource1', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });
    new CfnResource(consumer, 'ConsumerResource2', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;

    // THEN - Only one SSM Parameter even with two consumers
    expect(producerTemplate.Resources).toEqual({
      MyResource: { Type: 'AWS::S3::Bucket' },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerFnGetAttMyResourceArn761B34A26BAD27DA: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2',
          Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        },
      },
    });
  });

  test('dependencies are correctly added in SSM mode', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });
    StackReferences.of(resource).toHere([CrossStackReferenceType.SSM]);

    const consumer = new Stack(app, 'Consumer');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    app.synth();

    // THEN - Consumer should depend on Producer
    expect(consumer.dependencies.map(d => d.node.id)).toContain('Producer');
  });

  test('empty CrossStackReferenceType[] throws error', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const resource = new CfnResource(stack, 'MyResource', { type: 'AWS::S3::Bucket' });

    expect(() => {
      StackReferences.of(resource).toHere([]);
    }).toThrow('At least one CrossStackReferenceType must be specified');

    expect(() => {
      StackReferences.of(resource).fromHere([]);
    }).toThrow('At least one CrossStackReferenceType must be specified');
  });

  test('cross-region references are not affected by SSM settings', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });

    // Set SSM globally
    StackReferences.of(resource).toHere([CrossStackReferenceType.SSM]);

    const consumer = new Stack(app, 'Consumer', {
      env: { account: '123456789012', region: 'us-west-2' },
      crossRegionReferences: true,
    });

    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    const assembly = app.synth();
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - Cross-region references should use the existing Custom Resource path,
    // not the same-region SSM path. The consumer template should have the
    // ExportsReader custom resource, not a simple {{resolve:ssm:...}}.
    expect(consumerTemplate.Resources.ExportsReader8B249524.Type).toBe('Custom::CrossRegionExportReader');
    expect(consumerTemplate.Resources.ConsumerResource.Properties.BucketArn).not.toContain('resolve:ssm');
  });

  test('default behavior without any StackReferences config is CFN_EXPORTS', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });

    // No StackReferences configured

    const consumer = new Stack(app, 'Consumer');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - Default is CFN_EXPORTS
    expect(producerTemplate.Outputs).toEqual({
      ExportsOutputFnGetAttMyResourceArnE157F485: {
        Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        Export: { Name: 'Producer:ExportsOutputFnGetAttMyResourceArnE157F485' },
      },
    });

    expect(consumerTemplate.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: { 'Fn::ImportValue': 'Producer:ExportsOutputFnGetAttMyResourceArnE157F485' },
        },
      },
    });
  });

  test('SSM parameter name uses producer stack name as prefix', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'MyProducerStack');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });
    StackReferences.of(resource).toHere([CrossStackReferenceType.SSM]);

    const consumer = new Stack(app, 'MyConsumerStack');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;

    // THEN
    expect(producerTemplate.Resources).toEqual({
      MyResource: { Type: 'AWS::S3::Bucket' },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsMyProducerStackMyProducerStackFnGetAttMyResourceArn3395F2F810FE8FA4: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/MyProducerStack/MyProducerStackFnGetAttMyResourceArn3395F2F8',
          Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        },
      },
    });
  });

  test('SSM ref: toHere on stack applies to all resources in that stack', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    // Set SSM at the stack level
    StackReferences.of(producer).toHere([CrossStackReferenceType.SSM]);

    const resource1 = new CfnResource(producer, 'Resource1', { type: 'AWS::S3::Bucket' });
    const resource2 = new CfnResource(producer, 'Resource2', { type: 'AWS::SQS::Queue' });

    const consumer = new Stack(app, 'Consumer');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: {
        BucketArn: resource1.getAtt('Arn'),
        QueueUrl: resource2.getAtt('QueueUrl'),
      },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;

    // THEN - Both references should produce SSM Parameters
    expect(producerTemplate.Outputs).toBeUndefined();
    expect(producerTemplate.Resources).toEqual({
      Resource1: { Type: 'AWS::S3::Bucket' },
      Resource2: { Type: 'AWS::SQS::Queue' },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerFnGetAttResource1Arn3C567B22EC0FDF91: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerFnGetAttResource1Arn3C567B22',
          Value: { 'Fn::GetAtt': ['Resource1', 'Arn'] },
        },
      },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerFnGetAttResource2QueueUrlC4C2F89F45F1208C: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerFnGetAttResource2QueueUrlC4C2F89F',
          Value: { 'Fn::GetAtt': ['Resource2', 'QueueUrl'] },
        },
      },
    });
  });

  test('MIXED mode with STRING_LIST creates both CFN Export and SSM Parameter', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'BLA' });
    (resource as any).attrList = ['val1', 'val2'];

    StackReferences.of(resource).toHere([
      CrossStackReferenceType.CFN_EXPORTS,
      CrossStackReferenceType.SSM,
    ]);

    const consumer = new Stack(app, 'Consumer');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'BLA',
      properties: {
        Prop: resource.getAtt('List', ResolutionTypeHint.STRING_LIST),
      },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - Producer: both CFN Export (Fn::Join) and SSM Parameter
    expect(producerTemplate.Outputs).toEqual({
      ExportsOutputFnGetAttMyResourceList939E2B65: {
        Value: { 'Fn::Join': ['||', { 'Fn::GetAtt': ['MyResource', 'List'] }] },
        Export: { Name: 'Producer:ExportsOutputFnGetAttMyResourceList939E2B65' },
      },
    });

    expect(producerTemplate.Resources).toEqual({
      MyResource: { Type: 'BLA' },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerFnGetAttMyResourceList4C66B21E31B223C1: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceList4C66B21E',
          Value: { 'Fn::Join': ['||', { 'Fn::GetAtt': ['MyResource', 'List'] }] },
        },
      },
    });

    // THEN - Consumer: uses SSM with Fn::Split
    expect(consumerTemplate.Resources).toEqual({
      ConsumerResource: {
        Type: 'BLA',
        Properties: {
          Prop: {
            'Fn::Split': ['||', '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceList4C66B21E}}'],
          },
        },
      },
    });
  });

  test('SSM mode emits warning about soft reference risk', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });
    StackReferences.of(resource).toHere([CrossStackReferenceType.SSM]);

    const consumer = new Stack(app, 'Consumer');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    const assembly = app.synth();

    // THEN - Warning should be emitted on the referenced resource
    const warnings = getWarnings(assembly);
    expect(warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining('SSM-based cross-stack references'),
        }),
      ]),
    );
  });

  test('multiple consumer stacks share a single SSM Parameter', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });
    StackReferences.of(resource).toHere([CrossStackReferenceType.SSM]);

    const consumer1 = new Stack(app, 'Consumer1');
    new CfnResource(consumer1, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    const consumer2 = new Stack(app, 'Consumer2');
    new CfnResource(consumer2, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumer1Template = assembly.getStackByName(consumer1.stackName).template;
    const consumer2Template = assembly.getStackByName(consumer2.stackName).template;

    // THEN - Producer should have a single SSM Parameter shared by all consumers
    // (mirrors CFN Exports where a single Export is shared)
    expect(producerTemplate.Resources).toEqual({
      MyResource: { Type: 'AWS::S3::Bucket' },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerFnGetAttMyResourceArn761B34A26BAD27DA: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2',
          Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        },
      },
    });

    // THEN - Both consumers reference the same SSM parameter
    const expectedSsmRef = '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2}}';
    expect(consumer1Template.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: expectedSsmRef,
        },
      },
    });
    expect(consumer2Template.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: expectedSsmRef,
        },
      },
    });
  });

  test('SSM reference with Ref attribute (not Fn::GetAtt)', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });
    StackReferences.of(resource).toHere([CrossStackReferenceType.SSM]);

    const consumer = new Stack(app, 'Consumer');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketName: resource.ref },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - Producer: SSM param value uses Ref (not Fn::GetAtt)
    expect(producerTemplate.Resources).toEqual({
      MyResource: { Type: 'AWS::S3::Bucket' },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerRefMyResourceF43CC75086169F21: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerRefMyResourceF43CC750',
          Value: { Ref: 'MyResource' },
        },
      },
    });

    // THEN - Consumer uses SSM dynamic reference
    expect(consumerTemplate.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketName: '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerRefMyResourceF43CC750}}',
        },
      },
    });
  });

  test('fromHere() on child construct applies to resources within that scope', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });

    const consumer = new Stack(app, 'Consumer');
    const group = new Construct(consumer, 'MonitoringGroup');
    // fromHere set on a child construct applies to resources within that scope
    StackReferences.of(group).fromHere([CrossStackReferenceType.SSM]);

    new CfnResource(group, 'Alarm', {
      type: 'AWS::CloudWatch::Alarm',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - fromHere on child construct is picked up via tree walk from the consuming element
    expect(producerTemplate.Resources).toEqual({
      MyResource: { Type: 'AWS::S3::Bucket' },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerFnGetAttMyResourceArn761B34A26BAD27DA: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2',
          Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        },
      },
    });

    expect(consumerTemplate.Resources).toEqual({
      MonitoringGroupAlarmB4EEB6AA: {
        Type: 'AWS::CloudWatch::Alarm',
        Properties: {
          BucketArn: '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2}}',
        },
      },
    });
  });

  test('fromHere() with MIXED mode creates both CFN Export and SSM Parameter', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });

    const consumer = new Stack(app, 'Consumer');
    StackReferences.of(consumer).fromHere([
      CrossStackReferenceType.CFN_EXPORTS,
      CrossStackReferenceType.SSM,
    ]);

    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - Producer has both CFN Export and SSM Parameter
    expect(producerTemplate.Outputs).toEqual({
      ExportsOutputFnGetAttMyResourceArnE157F485: {
        Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        Export: { Name: 'Producer:ExportsOutputFnGetAttMyResourceArnE157F485' },
      },
    });
    expect(
      producerTemplate.Resources.SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerFnGetAttMyResourceArn761B34A26BAD27DA,
    ).toEqual({
      Type: 'AWS::SSM::Parameter',
      Properties: {
        Type: 'String',
        Name: '/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2',
        Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
      },
    });

    // THEN - Consumer uses SSM
    expect(consumerTemplate.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2}}',
        },
      },
    });
  });

  test('SSM parameter name stays within 900 character limit', () => {
    // GIVEN - Use maximum-length stack names (128 chars) and long resource IDs
    const app = new App();
    const producer = new Stack(app, 'P'.repeat(128));
    const resource = new CfnResource(producer, 'R'.repeat(200), { type: 'AWS::S3::Bucket' });
    StackReferences.of(resource).toHere([CrossStackReferenceType.SSM]);

    const consumer = new Stack(app, 'C'.repeat(128));
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;

    // THEN - SSM parameter name should be under 900 chars
    const ssmResources = Object.entries(producerTemplate.Resources).filter(
      ([_, v]: [string, any]) => v.Type === 'AWS::SSM::Parameter',
    );
    expect(ssmResources.length).toBe(1);
    const [, ssmParam] = ssmResources[0] as [string, any];
    expect(ssmParam.Properties.Name.length).toBeLessThanOrEqual(900);
    expect(ssmParam.Properties.Name).toMatch(/^\/cdk\/cross-stack-refs\//);
  });

  test('both producer and consumer inside nested stacks', () => {
    // GIVEN
    const app = new App();
    const producerParent = new Stack(app, 'ProducerParent');
    StackReferences.of(producerParent).toHere([CrossStackReferenceType.SSM]);
    const nestedProducer = new NestedStack(producerParent, 'NestedProducer');
    const resource = new CfnResource(nestedProducer, 'MyResource', { type: 'AWS::S3::Bucket' });

    const consumerParent = new Stack(app, 'ConsumerParent');
    const nestedConsumer = new NestedStack(consumerParent, 'NestedConsumer');
    new CfnResource(nestedConsumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    const assembly = app.synth();
    const producerParentTemplate = assembly.getStackByName(producerParent.stackName).template;
    const consumerParentTemplate = assembly.getStackByName(consumerParent.stackName).template;

    // THEN - Producer parent has SSM Parameter with nested stack output reference
    const ssmResources = Object.entries(producerParentTemplate.Resources).filter(
      ([_, v]: [string, any]) => v.Type === 'AWS::SSM::Parameter',
    );
    expect(ssmResources.length).toBe(1);
    const [, ssmParam] = ssmResources[0] as [string, any];
    expect(ssmParam.Properties.Type).toBe('String');
    expect(ssmParam.Properties.Value).toEqual({
      'Fn::GetAtt': [
        'NestedProducerNestedStackNestedProducerNestedStackResource421EA5D7',
        'Outputs.ProducerParentNestedProducerMyResource8FC21B8BArn',
      ],
    });

    // THEN - Consumer parent passes SSM reference as parameter to nested consumer
    const nestedStackResource =
      consumerParentTemplate.Resources.NestedConsumerNestedStackNestedConsumerNestedStackResource8CB6F5DC;
    expect(nestedStackResource.Type).toBe('AWS::CloudFormation::Stack');
    const paramValues = Object.values(nestedStackResource.Properties.Parameters) as string[];
    expect(paramValues.length).toBe(1);
    expect(paramValues[0]).toContain('resolve:ssm:/cdk/cross-stack-refs/ProducerParent/');
  });

  test('StackReferences.of() returns the same instance for the same scope', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const resource = new CfnResource(stack, 'MyResource', { type: 'AWS::S3::Bucket' });

    // WHEN
    const refs1 = StackReferences.of(resource);
    const refs2 = StackReferences.of(resource);

    // THEN - Same instance (singleton per scope)
    expect(refs1).toBe(refs2);
  });

  test('cross-account references are not supported even with SSM', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer', {
      env: { account: '111111111111', region: 'us-east-1' },
    });
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });
    StackReferences.of(resource).toHere([CrossStackReferenceType.SSM]);

    const consumer = new Stack(app, 'Consumer', {
      env: { account: '222222222222', region: 'us-east-1' },
    });
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // THEN - Cross-account is not supported, SSM config doesn't bypass this
    expect(() => app.synth()).toThrow(
      /Cross stack references are only supported for stacks deployed to the same account/,
    );
  });

  test('cross-region with unresolved region throws even with SSM configured', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });
    StackReferences.of(resource).toHere([CrossStackReferenceType.SSM]);

    const consumer = new Stack(app, 'Consumer', {
      env: { account: '123456789012' },
      crossRegionReferences: true,
    });
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // THEN - Cross-region with unresolved region throws
    expect(() => app.synth()).toThrow(
      /Cross stack\/region references are only supported for stacks with an explicit region/,
    );
  });

  test('fromHere() on child construct does not affect resources outside that scope', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });

    const consumer = new Stack(app, 'Consumer');
    const group = new Construct(consumer, 'MonitoringGroup');
    StackReferences.of(group).fromHere([CrossStackReferenceType.SSM]);

    // Resource OUTSIDE the MonitoringGroup scope - should use default CFN_EXPORTS
    new CfnResource(consumer, 'OutsideResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - Falls back to default CFN_EXPORTS
    expect(producerTemplate.Resources).toEqual({
      MyResource: { Type: 'AWS::S3::Bucket' },
    });
    expect(producerTemplate.Outputs).toEqual({
      ExportsOutputFnGetAttMyResourceArnE157F485: {
        Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        Export: { Name: 'Producer:ExportsOutputFnGetAttMyResourceArnE157F485' },
      },
    });
    expect(consumerTemplate.Resources).toEqual({
      OutsideResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: { 'Fn::ImportValue': 'Producer:ExportsOutputFnGetAttMyResourceArnE157F485' },
        },
      },
    });
  });

  test('fromHere() inside nested consumer applies SSM via parameter pass-through', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });

    const consumerParent = new Stack(app, 'ConsumerParent');
    const nestedConsumer = new NestedStack(consumerParent, 'NestedConsumer');
    StackReferences.of(nestedConsumer).fromHere([CrossStackReferenceType.SSM]);

    new CfnResource(nestedConsumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerParentTemplate = assembly.getStackByName(consumerParent.stackName).template;

    // THEN - Producer has SSM Parameter (identical output to toHere case)
    expect(producerTemplate.Outputs).toBeUndefined();
    expect(producerTemplate.Resources).toEqual({
      MyResource: { Type: 'AWS::S3::Bucket' },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerFnGetAttMyResourceArn761B34A26BAD27DA: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2',
          Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        },
      },
    });

    // THEN - Consumer parent passes SSM reference to nested stack
    const nestedStackResource =
      consumerParentTemplate.Resources.NestedConsumerNestedStackNestedConsumerNestedStackResource8CB6F5DC;
    expect(nestedStackResource.Type).toBe('AWS::CloudFormation::Stack');
    expect(nestedStackResource.Properties.Parameters).toEqual({
      referencetoProducerMyResource2D6458ECArn:
        '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerFnGetAttMyResourceArn761B34A2}}',
    });
  });

  test('different resources in same stack can use different reference types via toHere', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const ssmResource = new CfnResource(producer, 'SsmResource', { type: 'AWS::S3::Bucket' });
    StackReferences.of(ssmResource).toHere([CrossStackReferenceType.SSM]);

    const cfnResource = new CfnResource(producer, 'CfnResource', { type: 'AWS::SQS::Queue' });
    StackReferences.of(cfnResource).toHere([CrossStackReferenceType.CFN_EXPORTS]);

    const consumer = new Stack(app, 'Consumer');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: {
        BucketArn: ssmResource.getAtt('Arn'),
        QueueUrl: cfnResource.getAtt('QueueUrl'),
      },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - Producer: SSM Parameter for SsmResource, CFN Export for CfnResource
    const ssmKey = 'SsmCrossStackExportsSsmParamcdkcrossstackrefsProducer' +
      'ProducerFnGetAttSsmResourceArn54789609934E309B';
    expect(producerTemplate.Resources).toEqual({
      SsmResource: { Type: 'AWS::S3::Bucket' },
      CfnResource: { Type: 'AWS::SQS::Queue' },
      [ssmKey]: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerFnGetAttSsmResourceArn54789609',
          Value: { 'Fn::GetAtt': ['SsmResource', 'Arn'] },
        },
      },
    });
    expect(producerTemplate.Outputs).toEqual({
      ExportsOutputFnGetAttCfnResourceQueueUrl6155ED8C: {
        Value: { 'Fn::GetAtt': ['CfnResource', 'QueueUrl'] },
        Export: { Name: 'Producer:ExportsOutputFnGetAttCfnResourceQueueUrl6155ED8C' },
      },
    });

    // THEN - Consumer: SSM for BucketArn, ImportValue for QueueUrl
    expect(consumerTemplate.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerFnGetAttSsmResourceArn54789609}}',
          QueueUrl: { 'Fn::ImportValue': 'Producer:ExportsOutputFnGetAttCfnResourceQueueUrl6155ED8C' },
        },
      },
    });
  });

  test('fromHere() nearest scope takes priority over parent scope', () => {
    // GIVEN
    const app = new App();
    const producer = new Stack(app, 'Producer');
    const resource = new CfnResource(producer, 'MyResource', { type: 'AWS::S3::Bucket' });

    const consumer = new Stack(app, 'Consumer');
    // Stack-level: SSM
    StackReferences.of(consumer).fromHere([CrossStackReferenceType.SSM]);
    const group = new Construct(consumer, 'Group');
    // Group-level: CFN_EXPORTS (closer to resource, should win)
    StackReferences.of(group).fromHere([CrossStackReferenceType.CFN_EXPORTS]);

    new CfnResource(group, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    const assembly = app.synth();
    const producerTemplate = assembly.getStackByName(producer.stackName).template;
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - nearest scope (CFN_EXPORTS on Group) wins over Stack-level SSM
    expect(producerTemplate.Resources).toEqual({
      MyResource: { Type: 'AWS::S3::Bucket' },
    });
    expect(producerTemplate.Outputs).toEqual({
      ExportsOutputFnGetAttMyResourceArnE157F485: {
        Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        Export: { Name: 'Producer:ExportsOutputFnGetAttMyResourceArnE157F485' },
      },
    });
    expect(consumerTemplate.Resources).toEqual({
      GroupConsumerResource8E796115: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: { 'Fn::ImportValue': 'Producer:ExportsOutputFnGetAttMyResourceArnE157F485' },
        },
      },
    });
  });

  test('MIXED mode with nested producer creates both CFN Export and SSM Parameter', () => {
    // GIVEN
    const app = new App();
    const producerParent = new Stack(app, 'ProducerParent');
    StackReferences.of(producerParent).toHere([
      CrossStackReferenceType.CFN_EXPORTS,
      CrossStackReferenceType.SSM,
    ]);
    const nestedProducer = new NestedStack(producerParent, 'NestedProducer');
    const resource = new CfnResource(nestedProducer, 'MyResource', { type: 'AWS::S3::Bucket' });

    const consumer = new Stack(app, 'Consumer');
    new CfnResource(consumer, 'ConsumerResource', {
      type: 'AWS::Lambda::Function',
      properties: { BucketArn: resource.getAtt('Arn') },
    });

    // WHEN
    const assembly = app.synth();
    const producerParentTemplate = assembly.getStackByName(producerParent.stackName).template;
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - Producer parent has both SSM Parameter and CFN Export
    const nestedStackLogicalId =
      'NestedProducerNestedStackNestedProducerNestedStackResource421EA5D7';
    const nestedOutputAttr =
      'Outputs.ProducerParentNestedProducerMyResource8FC21B8BArn';

    // SSM Parameter
    const ssmResources = Object.entries(producerParentTemplate.Resources).filter(
      ([_, v]: [string, any]) => v.Type === 'AWS::SSM::Parameter',
    );
    expect(ssmResources.length).toBe(1);
    const [, ssmParam] = ssmResources[0] as [string, any];
    expect(ssmParam.Properties.Name).toMatch(/^\/cdk\/cross-stack-refs\/ProducerParent\//);
    expect(ssmParam.Properties.Value).toEqual({
      'Fn::GetAtt': [nestedStackLogicalId, nestedOutputAttr],
    });

    // CFN Export
    const cfnOutputKey = 'ExportsOutputFnGetAtt' + nestedStackLogicalId +
      nestedOutputAttr.replace('.', '') + 'E0070345';
    expect(producerParentTemplate.Outputs[cfnOutputKey]).toEqual({
      Value: {
        'Fn::GetAtt': [nestedStackLogicalId, nestedOutputAttr],
      },
      Export: {
        Name: 'ProducerParent:' + cfnOutputKey,
      },
    });

    // THEN - Consumer uses SSM reference
    const ssmParamName = ssmParam.Properties.Name;
    expect(consumerTemplate.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: '{{resolve:ssm:' + ssmParamName + '}}',
        },
      },
    });
  });
});
