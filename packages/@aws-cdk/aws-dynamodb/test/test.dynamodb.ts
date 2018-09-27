import { App, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { AttributeType, StreamViewType, Table } from '../lib';

export = {
  'default properties': {
    'fails without a hash key'(test: Test) {
      const app = new TestApp();
      new Table(app.stack, 'MyTable');
      test.throws(() => app.synthesizeTemplate(), /partition key/);

      test.done();
    },

    'hash key only'(test: Test) {
      const app = new TestApp();
      new Table(app.stack, 'MyTable').addPartitionKey({ name: 'hashKey', type: AttributeType.Binary });
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              AttributeDefinitions: [{ AttributeName: 'hashKey', AttributeType: 'B' }],
              KeySchema: [{ AttributeName: 'hashKey', KeyType: 'HASH' }],
              ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
            }
          }
        }
      });

      test.done();
    },

    'hash + range key'(test: Test) {
      const app = new TestApp();
      new Table(app.stack, 'MyTable')
        .addPartitionKey({ name: 'hashKey', type: AttributeType.Binary })
        .addSortKey({ name: 'sortKey', type: AttributeType.Number });
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              AttributeDefinitions: [
                { AttributeName: 'hashKey', AttributeType: 'B' },
                { AttributeName: 'sortKey', AttributeType: 'N' }
              ],
              KeySchema: [
                { AttributeName: 'hashKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
            }
          }
        }
      });

      test.done();
    },

    'point-in-time recovery is not enabled'(test: Test) {
      const app = new TestApp();
      new Table(app.stack, 'MyTable')
        .addPartitionKey({ name: 'partitionKey', type: AttributeType.Binary })
        .addSortKey({ name: 'sortKey', type: AttributeType.Number });
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              AttributeDefinitions: [
                { AttributeName: 'partitionKey', AttributeType: 'B' },
                { AttributeName: 'sortKey', AttributeType: 'N' }
              ],
              KeySchema: [
                { AttributeName: 'partitionKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
            }
          }
        }
      });

      test.done();
    },

    'server-side encryption is not enabled'(test: Test) {
      const app = new TestApp();
      new Table(app.stack, 'MyTable')
        .addPartitionKey({ name: 'partitionKey', type: AttributeType.Binary })
        .addSortKey({ name: 'sortKey', type: AttributeType.Number });
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              AttributeDefinitions: [
                { AttributeName: 'partitionKey', AttributeType: 'B' },
                { AttributeName: 'sortKey', AttributeType: 'N' }
              ],
              KeySchema: [
                { AttributeName: 'partitionKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
            }
          }
        }
      });

      test.done();
    },

    'stream is not enabled'(test: Test) {
      const app = new TestApp();
      new Table(app.stack, 'MyTable')
        .addPartitionKey({ name: 'partitionKey', type: AttributeType.Binary })
        .addSortKey({ name: 'sortKey', type: AttributeType.Number });
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              AttributeDefinitions: [
                { AttributeName: 'partitionKey', AttributeType: 'B' },
                { AttributeName: 'sortKey', AttributeType: 'N' }
              ],
              KeySchema: [
                { AttributeName: 'partitionKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
            }
          }
        }
      });

      test.done();
    },

    'ttl is not enabled'(test: Test) {
      const app = new TestApp();
      new Table(app.stack, 'MyTable')
        .addPartitionKey({ name: 'partitionKey', type: AttributeType.Binary })
        .addSortKey({ name: 'sortKey', type: AttributeType.Number });
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              AttributeDefinitions: [
                { AttributeName: 'partitionKey', AttributeType: 'B' },
                { AttributeName: 'sortKey', AttributeType: 'N' }
              ],
              KeySchema: [
                { AttributeName: 'partitionKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
            }
          }
        }
      });

      test.done();
    },

    'can specify new and old images'(test: Test) {
      const app = new TestApp();
      const table = new Table(app.stack, 'MyTable', {
        tableName: 'MyTable',
        readCapacity: 42,
        writeCapacity: 1337,
        streamSpecification: StreamViewType.NewAndOldImages
      });
      table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
      table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              AttributeDefinitions: [
                { AttributeName: 'partitionKey', AttributeType: 'S' },
                { AttributeName: 'sortKey', AttributeType: 'B' }
              ],
              StreamSpecification: { StreamViewType: 'NEW_AND_OLD_IMAGES' },
              KeySchema: [
                { AttributeName: 'partitionKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
              TableName: 'MyTable'
            }
          }
        }
      });

      test.done();
    },

    'can specify new images only'(test: Test) {
      const app = new TestApp();
      const table = new Table(app.stack, 'MyTable', {
        tableName: 'MyTable',
        readCapacity: 42,
        writeCapacity: 1337,
        streamSpecification: StreamViewType.NewImage
      });
      table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
      table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              KeySchema: [
                { AttributeName: 'partitionKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
              AttributeDefinitions: [
                { AttributeName: 'partitionKey', AttributeType: 'S' },
                { AttributeName: 'sortKey', AttributeType: 'B' }
              ],
              StreamSpecification: { StreamViewType: 'NEW_IMAGE' },
              TableName: 'MyTable'
            }
          }
        }
      });

      test.done();
    },

    'can specify old images only'(test: Test) {
      const app = new TestApp();
      const table = new Table(app.stack, 'MyTable', {
        tableName: 'MyTable',
        readCapacity: 42,
        writeCapacity: 1337,
        streamSpecification: StreamViewType.OldImage
      });
      table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
      table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
      const template = app.synthesizeTemplate();

      test.deepEqual(template, {
        Resources: {
          MyTable794EDED1: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              KeySchema: [
                { AttributeName: 'partitionKey', KeyType: 'HASH' },
                { AttributeName: 'sortKey', KeyType: 'RANGE' }
              ],
              ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
              AttributeDefinitions: [
                { AttributeName: 'partitionKey', AttributeType: 'S' },
                { AttributeName: 'sortKey', AttributeType: 'B' }
              ],
              StreamSpecification: { StreamViewType: 'OLD_IMAGE' },
              TableName: 'MyTable'
            }
          }
        }
      });

      test.done();
    }
  },

  'when specifying every property'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337,
      pitrEnabled: true,
      sseEnabled: true,
      streamSpecification: StreamViewType.KeysOnly,
      ttlAttributeName: 'timeToLive'
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, {
      Resources: {
        MyTable794EDED1: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
            AttributeDefinitions: [
              { AttributeName: 'partitionKey', AttributeType: 'S' },
              { AttributeName: 'sortKey', AttributeType: 'B' }
            ],
            KeySchema: [
              { AttributeName: 'partitionKey', KeyType: 'HASH' },
              { AttributeName: 'sortKey', KeyType: 'RANGE' }
            ],
            ProvisionedThroughput: {
              ReadCapacityUnits: 42,
              WriteCapacityUnits: 1337
            },
            PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true },
            SSESpecification: { SSEEnabled: true },
            StreamSpecification: { StreamViewType: 'KEYS_ONLY' },
            TableName: 'MyTable',
            TimeToLiveSpecification: { AttributeName: 'timeToLive', Enabled: true }
          }
        }
      }
    });

    test.done();
  },

  'when specifying Read Auto Scaling'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 75.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60,
      scalingPolicyName: 'MyAwesomePolicyName'
    });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'partitionKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          AttributeDefinitions:
           [ { AttributeName: 'partitionKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'B' } ],
          TableName: 'MyTable' } },
        MyTableReadAutoScalingRoleFEE68E49:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableReadAutoScalingRoleDefaultPolicyF6A1975F:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableReadAutoScalingRoleDefaultPolicyF6A1975F',
          Roles: [ { Ref: 'MyTableReadAutoScalingRoleFEE68E49' } ] } },
        MyTableReadCapacityScalableTarget72B0B3BF:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableReadAutoScalingRoleFEE68E49', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableReadCapacityScalingPolicyCC18E396:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName: 'MyAwesomePolicyName',
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableReadCapacityScalableTarget72B0B3BF' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBReadCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'when specifying Read Auto Scaling via constructor'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337,
      readAutoScaling: {
        minCapacity: 50,
        maxCapacity: 500,
        targetValue: 75.0,
        scaleInCooldown: 80,
        scaleOutCooldown: 60,
        scalingPolicyName: 'MyAwesomePolicyName'
      }
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'partitionKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          AttributeDefinitions:
           [ { AttributeName: 'partitionKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'B' } ],
          TableName: 'MyTable' } },
        MyTableReadAutoScalingRoleFEE68E49:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableReadAutoScalingRoleDefaultPolicyF6A1975F:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableReadAutoScalingRoleDefaultPolicyF6A1975F',
          Roles: [ { Ref: 'MyTableReadAutoScalingRoleFEE68E49' } ] } },
        MyTableReadCapacityScalableTarget72B0B3BF:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableReadAutoScalingRoleFEE68E49', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableReadCapacityScalingPolicyCC18E396:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName: 'MyAwesomePolicyName',
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableReadCapacityScalableTarget72B0B3BF' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBReadCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'error when specifying Read Auto Scaling via constructor and attempting to addReadAutoScaling'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337,
      readAutoScaling: {
        minCapacity: 50,
        maxCapacity: 500,
        targetValue: 75.0,
        scaleInCooldown: 80,
        scaleOutCooldown: 60,
        scalingPolicyName: 'MyAwesomePolicyName'
      }
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    test.throws(() => table.addReadAutoScaling({
      minCapacity: 500,
      maxCapacity: 5000,
      targetValue: 25.0,
      scaleInCooldown: 40,
      scaleOutCooldown: 20,
      scalingPolicyName: 'MySecondAwesomePolicyName'
    }), /Read Auto Scaling already defined for Table/);

    test.done();
  },

  'when specifying Read Auto Scaling without scalingPolicyName'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 75.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'partitionKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          AttributeDefinitions:
           [ { AttributeName: 'partitionKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'B' } ],
          TableName: 'MyTable' } },
        MyTableReadAutoScalingRoleFEE68E49:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableReadAutoScalingRoleDefaultPolicyF6A1975F:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableReadAutoScalingRoleDefaultPolicyF6A1975F',
          Roles: [ { Ref: 'MyTableReadAutoScalingRoleFEE68E49' } ] } },
        MyTableReadCapacityScalableTarget72B0B3BF:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableReadAutoScalingRoleFEE68E49', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableReadCapacityScalingPolicyCC18E396:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName:
           { 'Fn::Join': [ '', [ { Ref: 'MyTable794EDED1' }, 'ReadCapacityScalingPolicy' ] ] },
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableReadCapacityScalableTarget72B0B3BF' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBReadCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'when specifying Read Auto Scaling without scalingPolicyName without Table Name'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 75.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'partitionKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          AttributeDefinitions:
           [ { AttributeName: 'partitionKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'B' } ] } },
        MyTableReadAutoScalingRoleFEE68E49:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableReadAutoScalingRoleDefaultPolicyF6A1975F:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableReadAutoScalingRoleDefaultPolicyF6A1975F',
          Roles: [ { Ref: 'MyTableReadAutoScalingRoleFEE68E49' } ] } },
        MyTableReadCapacityScalableTarget72B0B3BF:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableReadAutoScalingRoleFEE68E49', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableReadCapacityScalingPolicyCC18E396:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName:
           { 'Fn::Join': [ '', [ { Ref: 'MyTable794EDED1' }, 'ReadCapacityScalingPolicy' ] ] },
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableReadCapacityScalableTarget72B0B3BF' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBReadCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'error when specifying Read Auto Scaling with invalid scalingTargetValue < 10'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    test.throws(() => table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 5.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    // tslint:disable-next-line:max-line-length
    }), /scalingTargetValue for predefined metric type DynamoDBReadCapacityUtilization\/DynamoDBWriteCapacityUtilization must be between 10 and 90; Provided value is: 5/);

    test.done();
  },

  'error when specifying Read Auto Scaling with invalid scalingTargetValue > 90'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    test.throws(() => table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 95.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    // tslint:disable-next-line:max-line-length
    }), /scalingTargetValue for predefined metric type DynamoDBReadCapacityUtilization\/DynamoDBWriteCapacityUtilization must be between 10 and 90; Provided value is: 95/);

    test.done();
  },

  'error when specifying Read Auto Scaling with invalid scaleInCooldown'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    test.throws(() => table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 50.0,
      scaleInCooldown: -5,
      scaleOutCooldown: 60
    }), /scaleInCooldown must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  },

  'error when specifying Read Auto Scaling with invalid scaleOutCooldown'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    test.throws(() => table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 50.0,
      scaleInCooldown: 80,
      scaleOutCooldown: -5
    }), /scaleOutCooldown must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  },

  'error when specifying Read Auto Scaling with invalid maximumCapacity'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    test.throws(() => table.addReadAutoScaling({
      minCapacity: 50,
      maxCapacity: -5,
      targetValue: 50.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    }), /maximumCapacity must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  },

  'error when specifying Read Auto Scaling with invalid minimumCapacity'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    test.throws(() => table.addReadAutoScaling({
      minCapacity: -5,
      maxCapacity: 500,
      targetValue: 50.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    }), /minimumCapacity must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  },

  'when specifying Write Auto Scaling'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 75.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60,
      scalingPolicyName: 'MyAwesomePolicyName'
    });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'partitionKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          AttributeDefinitions:
           [ { AttributeName: 'partitionKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'B' } ],
          TableName: 'MyTable' } },
        MyTableWriteAutoScalingRoleDF7775DE:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB',
          Roles: [ { Ref: 'MyTableWriteAutoScalingRoleDF7775DE' } ] } },
        MyTableWriteCapacityScalableTarget56F9809A:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableWriteAutoScalingRoleDF7775DE', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableWriteCapacityScalingPolicy766EAD7A:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName: 'MyAwesomePolicyName',
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableWriteCapacityScalableTarget56F9809A' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBWriteCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'when specifying Write Auto Scaling via constructor'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337,
      writeAutoScaling: {
        minCapacity: 50,
        maxCapacity: 500,
        targetValue: 75.0,
        scaleInCooldown: 80,
        scaleOutCooldown: 60,
        scalingPolicyName: 'MyAwesomePolicyName'
      }
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'partitionKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          AttributeDefinitions:
           [ { AttributeName: 'partitionKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'B' } ],
          TableName: 'MyTable' } },
        MyTableWriteAutoScalingRoleDF7775DE:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB',
          Roles: [ { Ref: 'MyTableWriteAutoScalingRoleDF7775DE' } ] } },
        MyTableWriteCapacityScalableTarget56F9809A:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableWriteAutoScalingRoleDF7775DE', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableWriteCapacityScalingPolicy766EAD7A:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName: 'MyAwesomePolicyName',
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableWriteCapacityScalableTarget56F9809A' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBWriteCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'error when specifying Write Auto Scaling via constructor and attempting to addWriteAutoScaling'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337,
      writeAutoScaling: {
        minCapacity: 50,
        maxCapacity: 500,
        targetValue: 75.0,
        scaleInCooldown: 80,
        scaleOutCooldown: 60,
        scalingPolicyName: 'MyAwesomePolicyName'
      }
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    test.throws(() => table.addWriteAutoScaling({
      minCapacity: 500,
      maxCapacity: 5000,
      targetValue: 25.0,
      scaleInCooldown: 40,
      scaleOutCooldown: 20,
      scalingPolicyName: 'MySecondAwesomePolicyName'
    }), /Write Auto Scaling already defined for Table/);

    test.done();
  },

  'when specifying Write Auto Scaling without scalingPolicyName'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 75.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'partitionKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          AttributeDefinitions:
           [ { AttributeName: 'partitionKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'B' } ],
          TableName: 'MyTable' } },
        MyTableWriteAutoScalingRoleDF7775DE:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB',
          Roles: [ { Ref: 'MyTableWriteAutoScalingRoleDF7775DE' } ] } },
        MyTableWriteCapacityScalableTarget56F9809A:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableWriteAutoScalingRoleDF7775DE', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableWriteCapacityScalingPolicy766EAD7A:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName:
           { 'Fn::Join': [ '', [ { Ref: 'MyTable794EDED1' }, 'WriteCapacityScalingPolicy' ] ] },
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableWriteCapacityScalableTarget56F9809A' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBWriteCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'when specifying Write Auto Scaling without scalingPolicyName without Table Name'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 75.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    });
    const template = app.synthesizeTemplate();

    test.deepEqual(template, { Resources:
      { MyTable794EDED1:
         { Type: 'AWS::DynamoDB::Table',
         Properties:
          { KeySchema:
           [ { AttributeName: 'partitionKey', KeyType: 'HASH' },
             { AttributeName: 'sortKey', KeyType: 'RANGE' } ],
          ProvisionedThroughput: { ReadCapacityUnits: 42, WriteCapacityUnits: 1337 },
          AttributeDefinitions:
           [ { AttributeName: 'partitionKey', AttributeType: 'S' },
             { AttributeName: 'sortKey', AttributeType: 'B' } ] } },
        MyTableWriteAutoScalingRoleDF7775DE:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'application-autoscaling.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: [ 'dynamodb:DescribeTable', 'dynamodb:UpdateTable' ],
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [ 'MyTable794EDED1', 'Arn' ] } },
              { Action: [ 'cloudwatch:PutMetricAlarm', 'cloudwatch:DescribeAlarms', 'cloudwatch:GetMetricStatistics',
              'cloudwatch:SetAlarmState', 'cloudwatch:DeleteAlarms' ],
              Effect: 'Allow', Resource: '*' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyTableWriteAutoScalingRoleDefaultPolicyBF1A7EBB',
          Roles: [ { Ref: 'MyTableWriteAutoScalingRoleDF7775DE' } ] } },
        MyTableWriteCapacityScalableTarget56F9809A:
         { Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
         Properties:
          { MaxCapacity: 500,
          MinCapacity: 50,
          ResourceId:
           { 'Fn::Join': [ '', [ 'table/', { Ref: 'MyTable794EDED1' } ] ] },
          RoleARN:
           { 'Fn::GetAtt': [ 'MyTableWriteAutoScalingRoleDF7775DE', 'Arn' ] },
          ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
          ServiceNamespace: 'dynamodb' } },
        MyTableWriteCapacityScalingPolicy766EAD7A:
         { Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
         Properties:
          { PolicyName:
           { 'Fn::Join': [ '', [ { Ref: 'MyTable794EDED1' }, 'WriteCapacityScalingPolicy' ] ] },
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: 'MyTableWriteCapacityScalableTarget56F9809A' },
          TargetTrackingScalingPolicyConfiguration:
           { PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBWriteCapacityUtilization' },
             ScaleInCooldown: 80,
             ScaleOutCooldown: 60,
             TargetValue: 75 } } } } });

    test.done();
  },

  'error when specifying Write Auto Scaling with invalid scalingTargetValue < 10'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    test.throws(() => table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 5.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    // tslint:disable-next-line:max-line-length
    }), /scalingTargetValue for predefined metric type DynamoDBReadCapacityUtilization\/DynamoDBWriteCapacityUtilization must be between 10 and 90; Provided value is: 5/);

    test.done();
  },

  'error when specifying Write Auto Scaling with invalid scalingTargetValue > 90'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    test.throws(() => table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 95.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    // tslint:disable-next-line:max-line-length
    }), /scalingTargetValue for predefined metric type DynamoDBReadCapacityUtilization\/DynamoDBWriteCapacityUtilization must be between 10 and 90; Provided value is: 95/);

    test.done();
  },

  'error when specifying Write Auto Scaling with invalid scaleInCooldown'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    test.throws(() => table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 50.0,
      scaleInCooldown: -5,
      scaleOutCooldown: 60
    }), /scaleInCooldown must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  },

  'error when specifying Write Auto Scaling with invalid scaleOutCooldown'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    test.throws(() => table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: 500,
      targetValue: 50.0,
      scaleInCooldown: 80,
      scaleOutCooldown: -5
    }), /scaleOutCooldown must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  },

  'error when specifying Write Auto Scaling with invalid maximumCapacity'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    test.throws(() => table.addWriteAutoScaling({
      minCapacity: 50,
      maxCapacity: -5,
      targetValue: 50.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    }), /maximumCapacity must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  },

  'error when specifying Write Auto Scaling with invalid minimumCapacity'(test: Test) {
    const app = new TestApp();
    const table = new Table(app.stack, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 42,
      writeCapacity: 1337
    });
    table.addPartitionKey({ name: 'partitionKey', type: AttributeType.String });
    table.addSortKey({ name: 'sortKey', type: AttributeType.Binary });
    test.throws(() => table.addWriteAutoScaling({
      minCapacity: -5,
      maxCapacity: 500,
      targetValue: 50.0,
      scaleInCooldown: 80,
      scaleOutCooldown: 60
    }), /minimumCapacity must be greater than or equal to 0; Provided value is: -5/);

    test.done();
  }
};

class TestApp {
  private readonly app = new App();
  // tslint:disable-next-line:member-ordering
  public readonly stack: Stack = new Stack(this.app, 'MyStack');

  public synthesizeTemplate() {
    return this.app.synthesizeStack(this.stack.name).template;
  }
}
