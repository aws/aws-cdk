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
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerConsumerFnGetAttMyResourceArn70A380021E7A5645: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttMyResourceArn70A38002',
          Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        },
      },
    });

    // THEN - Consumer should use {{resolve:ssm:...}} not Fn::ImportValue
    const consumerResource = consumerTemplate.Resources.ConsumerResource;
    const bucketArn = consumerResource.Properties.BucketArn;
    expect(bucketArn).toBe('{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttMyResourceArn70A38002}}');
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
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerConsumerFnGetAttMyResourceList9FB0FB1AA02CB3E3: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttMyResourceList9FB0FB1A',
          Value: { 'Fn::Join': ['||', { 'Fn::GetAtt': ['MyResource', 'List'] }] },
        },
      },
    });

    // THEN - Consumer: should split the SSM value
    const consumerResource = consumerTemplate.Resources.ConsumerResource;
    expect(consumerResource.Properties.Prop).toEqual({
      'Fn::Split': ['||', '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttMyResourceList9FB0FB1A}}'],
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
    const ssmParamKey = 'SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerParent' +
      'ProducerParentConsumerFnGetAttNestedNestedStackNestedNestedStackResourceDEFDAA4D' +
      'OutputsProducerParentNestedMyResource58EEE46AArn8C15706570EF2895';
    const ssmParamName = '/cdk/cross-stack-refs/ProducerParent/' +
      'ProducerParentConsumerFnGetAttNestedNestedStackNestedNestedStackResourceDEFDAA4D' +
      'OutputsProducerParentNestedMyResource58EEE46AArn8C157065';
    expect(producerParentTemplate.Resources[ssmParamKey]).toEqual({
      Type: 'AWS::SSM::Parameter',
      Properties: {
        Type: 'String',
        Name: ssmParamName,
        Value: {
          'Fn::GetAtt': [
            'NestedNestedStackNestedNestedStackResourceDEFDAA4D',
            'Outputs.ProducerParentNestedMyResource58EEE46AArn',
          ],
        },
      },
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
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerConsumerParentFnGetAttMyResourceArn8907058E51CA0A52: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerConsumerParentFnGetAttMyResourceArn8907058E',
          Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        },
      },
    });

    // THEN - Consumer parent passes SSM reference as parameter to nested stack
    const nestedStackResource = consumerParentTemplate.Resources.NestedConsumerNestedStackNestedConsumerNestedStackResource8CB6F5DC;
    expect(nestedStackResource.Type).toBe('AWS::CloudFormation::Stack');
    expect(nestedStackResource.Properties.Parameters).toEqual({
      referencetoProducerMyResource2D6458ECArn: '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerConsumerParentFnGetAttMyResourceArn8907058E}}',
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
      producerTemplate.Resources.SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerConsumerFnGetAttMyResourceArn70A380021E7A5645,
    ).toEqual({
      Type: 'AWS::SSM::Parameter',
      Properties: {
        Type: 'String',
        Name: '/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttMyResourceArn70A38002',
        Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
      },
    });

    // THEN - Consumer should use SSM (not ImportValue)
    const consumerResource = consumerTemplate.Resources.ConsumerResource;
    const bucketArn = consumerResource.Properties.BucketArn;
    expect(bucketArn).toBe('{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttMyResourceArn70A38002}}');
  });

  test('MIXED mode consumer uses SSM not Fn::ImportValue', () => {
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
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - Consumer should use SSM, not Fn::ImportValue
    expect(consumerTemplate.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttMyResourceArn70A38002}}',
        },
      },
    });
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
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerConsumerFnGetAttMyResourceArn70A380021E7A5645: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttMyResourceArn70A38002',
          Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        },
      },
    });

    expect(consumerTemplate.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttMyResourceArn70A38002}}',
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
    expect(consumerResource.Properties.BucketArn).toBe('{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttParentMyResource4B1FDBCCArnA6294FFD}}');
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
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerConsumerFnGetAttMyResourceArn70A380021E7A5645: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttMyResourceArn70A38002',
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
      SsmCrossStackExportsSsmParamcdkcrossstackrefsMyProducerStackMyProducerStackMyConsumerStackFnGetAttMyResourceArnCCDB7D75323BACFA: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/MyProducerStack/MyProducerStackMyConsumerStackFnGetAttMyResourceArnCCDB7D75',
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
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerConsumerFnGetAttResource1Arn9CD5461E86EDD8F3: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttResource1Arn9CD5461E',
          Value: { 'Fn::GetAtt': ['Resource1', 'Arn'] },
        },
      },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerConsumerFnGetAttResource2QueueUrl0596462C1E17FABF: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttResource2QueueUrl0596462C',
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
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerConsumerFnGetAttMyResourceList9FB0FB1AA02CB3E3: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttMyResourceList9FB0FB1A',
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
            'Fn::Split': ['||', '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttMyResourceList9FB0FB1A}}'],
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

  test('multiple consumer stacks create separate SSM Parameters', () => {
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

    // THEN - Producer should have two separate SSM Parameters (one per consumer)
    expect(producerTemplate.Resources).toEqual({
      MyResource: { Type: 'AWS::S3::Bucket' },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerConsumer1FnGetAttMyResourceArnB6078C912B804A3D: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerConsumer1FnGetAttMyResourceArnB6078C91',
          Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        },
      },
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerConsumer2FnGetAttMyResourceArnEF05BA8E2192BE74: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerConsumer2FnGetAttMyResourceArnEF05BA8E',
          Value: { 'Fn::GetAtt': ['MyResource', 'Arn'] },
        },
      },
    });

    // THEN - Each consumer references its own SSM parameter
    expect(consumer1Template.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerConsumer1FnGetAttMyResourceArnB6078C91}}',
        },
      },
    });
    expect(consumer2Template.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketArn: '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerConsumer2FnGetAttMyResourceArnEF05BA8E}}',
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
      SsmCrossStackExportsSsmParamcdkcrossstackrefsProducerProducerConsumerRefMyResourceEDCF2EDB2DE63099: {
        Type: 'AWS::SSM::Parameter',
        Properties: {
          Type: 'String',
          Name: '/cdk/cross-stack-refs/Producer/ProducerConsumerRefMyResourceEDCF2EDB',
          Value: { Ref: 'MyResource' },
        },
      },
    });

    // THEN - Consumer uses SSM dynamic reference
    expect(consumerTemplate.Resources).toEqual({
      ConsumerResource: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          BucketName: '{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerConsumerRefMyResourceEDCF2EDB}}',
        },
      },
    });
  });
});
