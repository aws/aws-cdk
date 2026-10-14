import { Template } from 'aws-cdk-lib/assertions';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { App, Stack, PropertyMergeStrategy, ArrayMergeStrategy } from 'aws-cdk-lib/core';
import * as dynamodbMixins from '../../../lib/services/aws-dynamodb';

describe('Box-safe property merges', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack', { env: { region: 'us-west-2', account: '123456789012' } });
  });

  describe('TableV2 replicas (array property backed by a Box)', () => {
    test('combine strategy can append a replica to a TableV2 with existing replicas', () => {
      const table = new dynamodb.TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
        replicas: [
          { region: 'us-east-1', pointInTimeRecovery: true },
          { region: 'eu-west-1', pointInTimeRecovery: true },
        ],
      });

      table.with(new dynamodbMixins.CfnGlobalTablePropsMixin({
        replicas: [{ region: 'ap-southeast-1', tags: [{ key: 'source', value: 'mixin' }] }],
      }, { strategy: PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.append() }) }));

      const template = Template.fromStack(stack);
      const replicas = template.findResources('AWS::DynamoDB::GlobalTable');
      const tableResource = Object.values(replicas)[0];
      const replicaRegions = tableResource.Properties.Replicas.map((r: any) => r.Region);

      expect(tableResource.Properties.Replicas).toMatchInlineSnapshot(`
[
  {
    "PointInTimeRecoverySpecification": {
      "PointInTimeRecoveryEnabled": true,
    },
    "Region": "us-east-1",
  },
  {
    "PointInTimeRecoverySpecification": {
      "PointInTimeRecoveryEnabled": true,
    },
    "Region": "eu-west-1",
  },
  {
    "Region": "us-west-2",
  },
  {
    "Region": "ap-southeast-1",
    "Tags": [
      {
        "Key": "source",
        "Value": "mixin",
      },
    ],
  },
]
`);
      expect(replicaRegions).toContain('us-east-1');
      expect(replicaRegions).toContain('eu-west-1');
      expect(replicaRegions).toContain('ap-southeast-1');
    });

    test('combine strategy with replaceByKey can update a specific replica', () => {
      const table = new dynamodb.TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
        replicas: [
          { region: 'us-east-1' },
          { region: 'eu-west-1', pointInTimeRecovery: false },
        ],
      });

      table.with(new dynamodbMixins.CfnGlobalTablePropsMixin({
        replicas: [{
          region: 'eu-west-1',
          pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
          tags: [{ key: 'source', value: 'mixin' }],
        }],
      }, { strategy: PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.replaceByKey('region') }) }));

      const template = Template.fromStack(stack);
      const replicas = template.findResources('AWS::DynamoDB::GlobalTable');
      const tableResource = Object.values(replicas)[0];
      const euReplica = tableResource.Properties.Replicas.find((r: any) => r.Region === 'eu-west-1');

      expect(tableResource.Properties.Replicas).toMatchInlineSnapshot(`
[
  {
    "Region": "us-east-1",
  },
  {
    "PointInTimeRecoverySpecification": {
      "PointInTimeRecoveryEnabled": true,
    },
    "Region": "eu-west-1",
    "Tags": [
      {
        "Key": "source",
        "Value": "mixin",
      },
    ],
  },
  {
    "Region": "us-west-2",
  },
]
`);
      expect(euReplica.PointInTimeRecoverySpecification).toEqual({
        PointInTimeRecoveryEnabled: true,
      });
    });

    test('override strategy replaces all replicas even when backed by a Box', () => {
      const table = new dynamodb.TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
        replicas: [
          { region: 'us-east-1' },
          { region: 'eu-west-1' },
        ],
      });

      table.with(new dynamodbMixins.CfnGlobalTablePropsMixin({
        replicas: [{ region: 'ap-northeast-1', tags: [{ key: 'source', value: 'mixin' }] }],
      }, { strategy: PropertyMergeStrategy.override() }));

      const template = Template.fromStack(stack);
      const replicas = template.findResources('AWS::DynamoDB::GlobalTable');
      const tableResource = Object.values(replicas)[0];
      const replicaRegions = tableResource.Properties.Replicas.map((r: any) => r.Region);

      expect(tableResource.Properties.Replicas).toMatchInlineSnapshot(`
[
  {
    "Region": "ap-northeast-1",
    "Tags": [
      {
        "Key": "source",
        "Value": "mixin",
      },
    ],
  },
]
`);
      expect(replicaRegions).toEqual(['ap-northeast-1']);
    });

    test('combine with default array strategy (replace) replaces replicas from Box', () => {
      const table = new dynamodb.TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
        replicas: [
          { region: 'us-east-1' },
          { region: 'eu-west-1' },
        ],
      });

      table.with(new dynamodbMixins.CfnGlobalTablePropsMixin({
        replicas: [{ region: 'ap-southeast-2', tags: [{ key: 'source', value: 'mixin' }] }],
      }));

      const template = Template.fromStack(stack);
      const replicas = template.findResources('AWS::DynamoDB::GlobalTable');
      const tableResource = Object.values(replicas)[0];
      const replicaRegions = tableResource.Properties.Replicas.map((r: any) => r.Region);

      expect(tableResource.Properties.Replicas).toMatchInlineSnapshot(`
[
  {
    "Region": "ap-southeast-2",
    "Tags": [
      {
        "Key": "source",
        "Value": "mixin",
      },
    ],
  },
]
`);
      expect(replicaRegions).toEqual(['ap-southeast-2']);
    });

    test('combine with prepend adds replicas before existing Box-backed replicas', () => {
      const table = new dynamodb.TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
        replicas: [
          { region: 'us-east-1' },
        ],
      });

      table.with(new dynamodbMixins.CfnGlobalTablePropsMixin({
        replicas: [{ region: 'eu-central-1', tags: [{ key: 'source', value: 'mixin' }] }],
      }, { strategy: PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.prepend() }) }));

      const template = Template.fromStack(stack);
      const replicas = template.findResources('AWS::DynamoDB::GlobalTable');
      const tableResource = Object.values(replicas)[0];
      const replicaRegions = tableResource.Properties.Replicas.map((r: any) => r.Region);

      expect(tableResource.Properties.Replicas).toMatchInlineSnapshot(`
[
  {
    "Region": "eu-central-1",
    "Tags": [
      {
        "Key": "source",
        "Value": "mixin",
      },
    ],
  },
  {
    "Region": "us-east-1",
  },
  {
    "Region": "us-west-2",
  },
]
`);
      expect(replicaRegions[0]).toBe('eu-central-1');
      expect(replicaRegions).toContain('us-east-1');
    });

    test('combine with replaceByIndex overwrites first replica from Box', () => {
      const table = new dynamodb.TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
        replicas: [
          { region: 'us-east-1' },
          { region: 'eu-west-1' },
          { region: 'ap-southeast-1' },
        ],
      });

      table.with(new dynamodbMixins.CfnGlobalTablePropsMixin({
        replicas: [{ region: 'us-west-2', tags: [{ key: 'source', value: 'mixin' }] }],
      }, { strategy: PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.replaceByIndex() }) }));

      const template = Template.fromStack(stack);
      const replicas = template.findResources('AWS::DynamoDB::GlobalTable');
      const tableResource = Object.values(replicas)[0];
      const replicaRegions = tableResource.Properties.Replicas.map((r: any) => r.Region);

      expect(tableResource.Properties.Replicas).toMatchInlineSnapshot(`
[
  {
    "Region": "us-west-2",
    "Tags": [
      {
        "Key": "source",
        "Value": "mixin",
      },
    ],
  },
  {
    "Region": "eu-west-1",
  },
  {
    "Region": "ap-southeast-1",
  },
  {
    "Region": "us-west-2",
  },
]
`);
      expect(replicaRegions).toEqual(['us-west-2', 'eu-west-1', 'ap-southeast-1', 'us-west-2']);
    });
  });
});
