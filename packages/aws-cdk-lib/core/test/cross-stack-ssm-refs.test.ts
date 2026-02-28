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
    const ssmResources = Object.entries(producerTemplate.Resources).filter(
      ([_, v]: [string, any]) => v.Type === 'AWS::SSM::Parameter',
    );
    expect(ssmResources.length).toBe(1);
    const [, ssmParam] = ssmResources[0] as [string, any];
    expect(ssmParam.Properties.Type).toBe('String');
    expect(ssmParam.Properties.Name).toBe('/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttMyResourceArn70A38002');
    expect(ssmParam.Properties.Value).toEqual({ 'Fn::GetAtt': ['MyResource', 'Arn'] });

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
    const ssmResources = Object.entries(producerTemplate.Resources).filter(
      ([_, v]: [string, any]) => v.Type === 'AWS::SSM::Parameter',
    );
    expect(ssmResources.length).toBe(1);
    const [, ssmParam] = ssmResources[0] as [string, any];
    expect(ssmParam.Properties.Value).toEqual({
      'Fn::Join': ['||', { 'Fn::GetAtt': ['MyResource', 'List'] }],
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
    const ssmResources = Object.entries(producerParentTemplate.Resources).filter(
      ([_, v]: [string, any]) => v.Type === 'AWS::SSM::Parameter',
    );
    expect(ssmResources.length).toBe(1);

    // The nested stack output should be referenced via Fn::GetAtt
    const [, ssmParam] = ssmResources[0] as [string, any];
    expect(ssmParam.Properties.Value).toEqual(expect.objectContaining({
      'Fn::GetAtt': expect.arrayContaining([expect.stringContaining('Nested')]),
    }));
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
    const ssmResources = Object.entries(producerTemplate.Resources).filter(
      ([_, v]: [string, any]) => v.Type === 'AWS::SSM::Parameter',
    );
    expect(ssmResources.length).toBe(1);

    // THEN - Consumer parent passes SSM reference as parameter to nested stack
    const nestedStackResource = Object.entries(consumerParentTemplate.Resources).find(
      ([_, v]: [string, any]) => v.Type === 'AWS::CloudFormation::Stack',
    );
    expect(nestedStackResource).toBeDefined();
    const [, nestedRes] = nestedStackResource as [string, any];
    const parameters = nestedRes.Properties?.Parameters;
    expect(parameters).toBeDefined();
    // At least one parameter should contain a resolve:ssm reference
    const paramValues = Object.values(parameters) as string[];
    expect(paramValues.some((v) => typeof v === 'string' && v.includes('resolve:ssm'))).toBe(true);
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
    expect(producerTemplate.Outputs).toBeDefined();
    const hasExport = Object.values(producerTemplate.Outputs).some(
      (o: any) => o.Export !== undefined,
    );
    expect(hasExport).toBe(true);

    const ssmResources = Object.entries(producerTemplate.Resources).filter(
      ([_, v]: [string, any]) => v.Type === 'AWS::SSM::Parameter',
    );
    expect(ssmResources.length).toBe(1);

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

    // THEN - No Fn::ImportValue should be present
    const templateString = JSON.stringify(consumerTemplate);
    expect(templateString).not.toContain('Fn::ImportValue');
    expect(templateString).toContain('resolve:ssm');
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
    const templateString = JSON.stringify(consumerTemplate);
    expect(templateString).toContain('Fn::ImportValue');
    expect(templateString).not.toContain('resolve:ssm');
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
    const ssmResources = Object.entries(producerTemplate.Resources).filter(
      ([_, v]: [string, any]) => v.Type === 'AWS::SSM::Parameter',
    );
    expect(ssmResources.length).toBe(1);

    const consumerResource = consumerTemplate.Resources.ConsumerResource;
    expect(consumerResource.Properties.BucketArn).toBe('{{resolve:ssm:/cdk/cross-stack-refs/Producer/ProducerConsumerFnGetAttMyResourceArn70A38002}}');
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
    const consumerTemplate = assembly.getStackByName(consumer.stackName).template;

    // THEN - nearest (CFN_EXPORTS) should win
    const templateString = JSON.stringify(consumerTemplate);
    expect(templateString).toContain('Fn::ImportValue');
    expect(templateString).not.toContain('resolve:ssm');
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

    // THEN - Only one SSM Parameter
    const ssmResources = Object.entries(producerTemplate.Resources).filter(
      ([_, v]: [string, any]) => v.Type === 'AWS::SSM::Parameter',
    );
    expect(ssmResources.length).toBe(1);
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
    // not the same-region SSM path. The consumer template should NOT have a
    // simple {{resolve:ssm:...}} but should have the ExportsReader custom resource.
    const templateString = JSON.stringify(consumerTemplate);
    // Cross-region uses ExportsReader custom resource, not direct resolve:ssm
    expect(templateString).toContain('Custom::CrossRegionExportReader');
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
    expect(producerTemplate.Outputs).toBeDefined();
    const hasExport = Object.values(producerTemplate.Outputs).some(
      (o: any) => o.Export !== undefined,
    );
    expect(hasExport).toBe(true);

    const templateString = JSON.stringify(consumerTemplate);
    expect(templateString).toContain('Fn::ImportValue');
    expect(templateString).not.toContain('resolve:ssm');
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
    const ssmResources = Object.entries(producerTemplate.Resources).filter(
      ([_, v]: [string, any]) => v.Type === 'AWS::SSM::Parameter',
    );
    const [, ssmParam] = ssmResources[0] as [string, any];
    expect(ssmParam.Properties.Name).toBe('/cdk/cross-stack-refs/MyProducerStack/MyProducerStackMyConsumerStackFnGetAttMyResourceArnCCDB7D75');
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
    const ssmResources = Object.entries(producerTemplate.Resources).filter(
      ([_, v]: [string, any]) => v.Type === 'AWS::SSM::Parameter',
    );
    expect(ssmResources.length).toBe(2);
    expect(producerTemplate.Outputs).toBeUndefined();
  });
});
