import { Annotations, Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import { ManagedPolicy, Role, ServicePrincipal } from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as logs from '../../aws-logs';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import { RemovalPolicy, Stack, Annotations as CoreAnnotations } from '../../core';
import {
  RDS_PREVENT_RENDERING_DEPRECATED_CREDENTIALS,
  AURORA_CLUSTER_CHANGE_SCOPE_OF_INSTANCE_PARAMETER_GROUP_WITH_EACH_PARAMETERS,
} from '../../cx-api';
import {
  AuroraEngineVersion, AuroraMysqlEngineVersion, AuroraPostgresEngineVersion, CfnDBCluster, Credentials, DatabaseCluster,
  DatabaseClusterEngine, DatabaseClusterFromSnapshot, ParameterGroup, PerformanceInsightRetention, SubnetGroup, DatabaseSecret,
  DatabaseInstanceEngine, SqlServerEngineVersion, SnapshotCredentials, InstanceUpdateBehaviour, NetworkType, ClusterInstance, CaCertificate,
} from '../lib';

describe('cluster new api', () => {
  describe('errors are thrown', () => {
    test('when old and new props are provided', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      expect(() => {
        // WHEN
        new DatabaseCluster(stack, 'Database', {
          engine: DatabaseClusterEngine.AURORA,
          instanceProps: {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
            vpc,
          },
          writer: ClusterInstance.serverlessV2('writer'),
          iamAuthentication: true,
        });
        // THEN
      }).toThrow(/Cannot provide writer or readers if instances or instanceProps are provided/);
    });

    test('when no instances are provided', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      expect(() => {
        // WHEN
        new DatabaseCluster(stack, 'Database', {
          engine: DatabaseClusterEngine.AURORA,
          vpc,
          iamAuthentication: true,
        });
        // THEN
      }).toThrow(/writer must be provided/);
    });

    test('when vpc prop is not provided', () => {
      // GIVEN
      const stack = testStack();

      expect(() => {
        // WHEN
        new DatabaseCluster(stack, 'Database', {
          engine: DatabaseClusterEngine.AURORA,
          writer: ClusterInstance.serverlessV2('writer'),
          iamAuthentication: true,
        });
        // THEN
      }).toThrow(/If instanceProps is not provided then `vpc` must be provided./);
    });

    test('when both vpc and instanceProps.vpc are provided', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      expect(() => {
        // WHEN
        new DatabaseCluster(stack, 'Database', {
          engine: DatabaseClusterEngine.AURORA,
          instanceProps: {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
            vpc,
          },
          vpc,
          iamAuthentication: true,
        });
        // THEN
      }).toThrow(/Provide either vpc or instanceProps.vpc, but not both/);
    });

    test('when both vpcSubnets and instanceProps.vpcSubnets are provided', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      expect(() => {
        // WHEN
        new DatabaseCluster(stack, 'Database', {
          engine: DatabaseClusterEngine.AURORA,
          instanceProps: {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
            vpcSubnets: vpc.selectSubnets( { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS } ),
            vpc,
          },
          vpcSubnets: vpc.selectSubnets( { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS } ),
          iamAuthentication: true,
        });
        // THEN
      }).toThrow(/Provide either vpcSubnets or instanceProps.vpcSubnets, but not both/);
    });

    test.each([
      [0.5, 200, /serverlessV2MaxCapacity must be >= 0.5 & <= 128/],
      [0.5, 0, /serverlessV2MaxCapacity must be >= 0.5 & <= 128/],
      [0, 1, /serverlessV2MinCapacity must be >= 0.5 & <= 128/],
      [200, 1, /serverlessV2MinCapacity must be >= 0.5 & <= 128/],
      [0.5, 0.5, /If serverlessV2MinCapacity === 0.5 then serverlessV2MaxCapacity must be >=1/],
      [10.1, 12, /serverlessV2MinCapacity & serverlessV2MaxCapacity must be in 0.5 step increments/],
      [12, 12.1, /serverlessV2MinCapacity & serverlessV2MaxCapacity must be in 0.5 step increments/],
      [5, 1, /serverlessV2MaxCapacity must be greater than serverlessV2MinCapacity/],
    ])('when serverless capacity is incorrect', (minCapacity, maxCapacity, errorMessage) => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      expect(() => {
        // WHEN
        new DatabaseCluster(stack, 'Database', {
          engine: DatabaseClusterEngine.AURORA,
          vpc,
          vpcSubnets: vpc.selectSubnets( { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS } ),
          serverlessV2MaxCapacity: maxCapacity,
          serverlessV2MinCapacity: minCapacity,
          iamAuthentication: true,
        });
        // THEN
      }).toThrow(errorMessage);
    });
  });

  describe('cluster options', () => {
    test('with serverless instances', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.serverlessV2('writer'),
        iamAuthentication: true,
      });

      // THEN
      const template = Template.fromStack(stack);
      // serverless scaling config is set
      template.hasResourceProperties('AWS::RDS::DBCluster', Match.objectLike({
        ServerlessV2ScalingConfiguration: {
          MinCapacity: 0.5,
          MaxCapacity: 2,
        },
      }));

      // subnets are set correctly
      template.hasResourceProperties('AWS::RDS::DBSubnetGroup', {
        DBSubnetGroupDescription: 'Subnets for Database database',
        SubnetIds: [
          { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
          { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
          { Ref: 'VPCPrivateSubnet3Subnet3EDCD457' },
        ],
      });
    });

    test('vpcSubnets can be provided', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
        writer: ClusterInstance.serverlessV2('writer'),
        iamAuthentication: true,
      });

      // THEN
      const template = Template.fromStack(stack);
      // serverless scaling config is set
      template.hasResourceProperties('AWS::RDS::DBCluster', Match.objectLike({
        ServerlessV2ScalingConfiguration: {
          MinCapacity: 0.5,
          MaxCapacity: 2,
        },
      }));

      // subnets are set correctly
      template.hasResourceProperties('AWS::RDS::DBSubnetGroup', {
        DBSubnetGroupDescription: 'Subnets for Database database',
        SubnetIds: [
          { Ref: 'VPCPublicSubnet1SubnetB4246D30' },
          { Ref: 'VPCPublicSubnet2Subnet74179F39' },
          { Ref: 'VPCPublicSubnet3Subnet631C5E25' },
        ],
      });
    });
  });

  describe('migrate from instanceProps', () => {
    test('template contains no changes (provisioned instances)', () => {
      // GIVEN
      const stack1 = testStack();
      const stack2 = testStack();

      function createCase(stack: Stack) {
        const vpc = new ec2.Vpc(stack, 'VPC');

        // WHEN
        const pg = new ParameterGroup(stack, 'pg', {
          engine: DatabaseClusterEngine.AURORA,
        });
        const sg = new ec2.SecurityGroup(stack, 'sg', {
          vpc,
        });
        const instanceProps = {
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
          vpc,
          allowMajorVersionUpgrade: true,
          autoMinorVersionUpgrade: true,
          deleteAutomatedBackups: true,
          enablePerformanceInsights: true,
          parameterGroup: pg,
          securityGroups: [sg],
        };
        return instanceProps;
      }
      const test1 = createCase(stack1);
      const test2 = createCase(stack2);
      new DatabaseCluster(stack1, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        instanceProps: test1,
        iamAuthentication: true,
      });

      new DatabaseCluster(stack2, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc: test2.vpc,
        securityGroups: test2.securityGroups,
        writer: ClusterInstance.provisioned('Instance1', {
          ...test2,
          isFromLegacyInstanceProps: true,
        }),
        readers: [
          ClusterInstance.provisioned('Instance2', {
            ...test2,
            isFromLegacyInstanceProps: true,
          }),
        ],
        iamAuthentication: true,
      });

      // THEN
      const test1Template = Template.fromStack(stack1).toJSON();
      // deleteAutomatedBackups is not needed on the instance, it is set on the cluster
      delete test1Template.Resources.DatabaseInstance1844F58FD.Properties.DeleteAutomatedBackups;
      delete test1Template.Resources.DatabaseInstance2AA380DEE.Properties.DeleteAutomatedBackups;
      expect(
        test1Template,
      ).toEqual(Template.fromStack(stack2).toJSON());
    });

    test('template contains no changes (serverless instances)', () => {
      // GIVEN
      const stack1 = testStack();
      const stack2 = testStack();

      function createCase(stack: Stack) {
        const vpc = new ec2.Vpc(stack, 'VPC');

        // WHEN
        const pg = new ParameterGroup(stack, 'pg', {
          engine: DatabaseClusterEngine.AURORA,
        });
        const sg = new ec2.SecurityGroup(stack, 'sg', {
          vpc,
        });
        const instanceProps = {
          instanceType: new ec2.InstanceType('serverless'),
          vpc,
          allowMajorVersionUpgrade: true,
          autoMinorVersionUpgrade: true,
          deleteAutomatedBackups: true,
          enablePerformanceInsights: true,
          parameterGroup: pg,
          securityGroups: [sg],
        };
        return instanceProps;
      }
      const test1 = createCase(stack1);
      const test2 = createCase(stack2);

      // Create serverless cluster using workaround described here:
      // https://github.com/aws/aws-cdk/issues/20197#issuecomment-1284485844
      const workaroundCluster = new DatabaseCluster(stack1, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        instanceProps: test1,
        iamAuthentication: true,
      });

      cdk.Aspects.of(workaroundCluster).add({
        visit(node) {
          if (node instanceof CfnDBCluster) {
            node.serverlessV2ScalingConfiguration = {
              minCapacity: 1,
              maxCapacity: 12,
            };
          }
        },
      });

      // Create serverless cluster using new/official approach.
      // This should provide a non-breaking migration path from the workaround.
      new DatabaseCluster(stack2, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc: test2.vpc,
        securityGroups: test2.securityGroups,
        writer: ClusterInstance.serverlessV2('Instance1', {
          ...test2,
          isFromLegacyInstanceProps: true,
        }),
        readers: [
          ClusterInstance.serverlessV2('Instance2', {
            ...test2,
            scaleWithWriter: true,
            isFromLegacyInstanceProps: true,
          }),
        ],
        iamAuthentication: true,
        serverlessV2MinCapacity: 1,
        serverlessV2MaxCapacity: 12,
      });

      // THEN
      const test1Template = Template.fromStack(stack1).toJSON();
      // deleteAutomatedBackups is not needed on the instance, it is set on the cluster
      delete test1Template.Resources.DatabaseInstance1844F58FD.Properties.DeleteAutomatedBackups;
      delete test1Template.Resources.DatabaseInstance2AA380DEE.Properties.DeleteAutomatedBackups;
      expect(test1Template).toEqual(Template.fromStack(stack2).toJSON());
    });
  });

  describe('creates a writer instance', () => {
    test('serverlessV2 writer', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.serverlessV2('writer'),
        iamAuthentication: true,
      });

      // THEN
      const template = Template.fromStack(stack);
      // only the writer gets created
      template.resourceCountIs('AWS::RDS::DBInstance', 1);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.serverless',
        Engine: 'aurora',
        PromotionTier: 0,
      });
    });

    test('serverlessV2 writer with config', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        removalPolicy: RemovalPolicy.RETAIN,
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.serverlessV2('writer', {
          allowMajorVersionUpgrade: true,
          autoMinorVersionUpgrade: true,
          enablePerformanceInsights: true,
          parameterGroup: new ParameterGroup(stack, 'pg', { engine: DatabaseClusterEngine.AURORA }),
        }),
      });

      // THEN
      const template = Template.fromStack(stack);
      // only the writer gets created
      template.resourceCountIs('AWS::RDS::DBInstance', 1);
      template.hasResource('AWS::RDS::DBInstance', {
        Properties: {
          AllowMajorVersionUpgrade: true,
          AutoMinorVersionUpgrade: true,
          DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
          DBInstanceClass: 'db.serverless',
          DBParameterGroupName: { Ref: 'pg749EE6ED' },
          EnablePerformanceInsights: true,
          Engine: 'aurora',
          PerformanceInsightsRetentionPeriod: 7,
          PromotionTier: 0,
        },
        UpdateReplacePolicy: 'Retain',
        Type: 'AWS::RDS::DBInstance',
      });
    });

    test('provisioned writer', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.provisioned('writer'),
        iamAuthentication: true,
      });

      // THEN
      const template = Template.fromStack(stack);
      // only the writer gets created
      template.resourceCountIs('AWS::RDS::DBInstance', 1);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.t3.medium',
        PromotionTier: 0,
      });
    });

    test('provisioned writer with config', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.provisioned('writer', {
          allowMajorVersionUpgrade: true,
          autoMinorVersionUpgrade: true,
          enablePerformanceInsights: true,
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE ),
          parameterGroup: new ParameterGroup(stack, 'pg', { engine: DatabaseClusterEngine.AURORA }),
        }),
        iamAuthentication: true,
      });

      // THEN
      const template = Template.fromStack(stack);

      // only the writer gets created
      template.resourceCountIs('AWS::RDS::DBInstance', 1);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        AllowMajorVersionUpgrade: true,
        AutoMinorVersionUpgrade: true,
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.c4.large',
        DBParameterGroupName: { Ref: 'pg749EE6ED' },
        EnablePerformanceInsights: true,
        Engine: 'aurora',
        PerformanceInsightsRetentionPeriod: 7,
        PromotionTier: 0,
      });
    });
  });

  describe('instanceIdentifiers', () => {
    test('should contain writer and reader instance IDs', () => {
      //GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      //WHEN
      const cluster = new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.serverlessV2('writer'),
        readers: [ClusterInstance.serverlessV2('reader')],
        iamAuthentication: true,
      });

      //THEN
      expect(cluster.instanceIdentifiers).toHaveLength(2);
      expect(stack.resolve(cluster.instanceIdentifiers[0])).toEqual({
        Ref: 'Databasewriter2462CC03',
      });
    });
  });

  describe('provisioned writer with serverless readers', () => {
    test('serverless reader in promotion tier 2 throws warning', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      const cluster = new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.provisioned('writer'),
        readers: [ClusterInstance.serverlessV2('reader')],
        iamAuthentication: true,
      });

      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::RDS::DBInstance', 2);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.t3.medium',
        PromotionTier: 0,
      });

      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.serverless',
        PromotionTier: 2,
      });

      Annotations.fromStack(stack).hasWarning('*',
        `Cluster ${cluster.node.id} only has serverless readers and no reader is in promotion tier 0-1.`+
        'Serverless readers in promotion tiers >= 2 will NOT scale with the writer, which can lead to '+
        'availability issues if a failover event occurs. It is recommended that at least one reader '+
        'has `scaleWithWriter` set to true [ack: @aws-cdk/aws-rds:noFailoverServerlessReaders]',
      );
    });

    test('serverless reader in promotion tier 2 does not throws', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      const cluster = new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.provisioned('writer'),
        readers: [ClusterInstance.serverlessV2('reader')],
        iamAuthentication: true,
      });

      CoreAnnotations.of(stack).acknowledgeWarning('RDSNoFailoverServerlessReaders');
      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::RDS::DBInstance', 2);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.t3.medium',
        PromotionTier: 0,
      });

      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.serverless',
        PromotionTier: 2,
      });

      Annotations.fromStack(stack).hasNoWarning('*',
        `Cluster ${cluster.node.id} only has serverless readers and no reader is in promotion tier 0-1.`+
        'Serverless readers in promotion tiers >= 2 will NOT scale with the writer, which can lead to '+
        'availability issues if a failover event occurs. It is recommended that at least one reader '+
        'has `scaleWithWriter` set to true',
      );
    });

    test('serverless reader in promotion tier 2 does not throws with root context', () => {
      // GIVEN
      const app = new cdk.App({
        context: {
          ACKNOWLEDGEMENTS_CONTEXT_KEY: {
            RDSNoFailoverServerlessReaders: ['Default/Database'],

          },
        },
      });
      const stack = testStack(app);
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      const cluster = new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.provisioned('writer'),
        readers: [ClusterInstance.serverlessV2('reader')],
        iamAuthentication: true,
      });

      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::RDS::DBInstance', 2);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.t3.medium',
        PromotionTier: 0,
      });

      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.serverless',
        PromotionTier: 2,
      });

      Annotations.fromStack(stack).hasNoWarning('*',
        `Cluster ${cluster.node.id} only has serverless readers and no reader is in promotion tier 0-1.`+
        'Serverless readers in promotion tiers >= 2 will NOT scale with the writer, which can lead to '+
        'availability issues if a failover event occurs. It is recommended that at least one reader '+
        'has `scaleWithWriter` set to true',
      );
    });

    test('serverless reader in promotion tier 1', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.provisioned('writer'),
        readers: [ClusterInstance.serverlessV2('reader', { scaleWithWriter: true })],
        iamAuthentication: true,
      });

      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::RDS::DBInstance', 2);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.t3.medium',
        PromotionTier: 0,
      });

      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.serverless',
        PromotionTier: 1,
      });

      Annotations.fromStack(stack).hasNoWarning('*', '*');
    });

    test.each([
      [
        ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE24 ),
        undefined,
      ],
      [
        ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE ),
        4,
      ],
    ])('serverless reader cannot scale with writer, throw warning', (instanceType: ec2.InstanceType, maxCapacity?: number) => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.provisioned('writer', {
          instanceType,
        }),
        serverlessV2MaxCapacity: maxCapacity,
        readers: [ClusterInstance.serverlessV2('reader', { scaleWithWriter: true })],
        iamAuthentication: true,
      });

      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::RDS::DBInstance', 2);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: `db.${instanceType.toString()}`,
        PromotionTier: 0,
      });

      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.serverless',
        PromotionTier: 1,
      });

      Annotations.fromStack(stack).hasWarning('*',
        'For high availability any serverless instances in promotion tiers 0-1 '+
        'should be able to scale to match the provisioned instance capacity.\n'+
        'Serverless instance reader is in promotion tier 1,\n'+
        `But can not scale to match the provisioned writer instance (${instanceType.toString()}) [ack: @aws-cdk/aws-rds:serverlessInstanceCantScaleWithWriter]`,
      );
    });
  });

  describe('provisioned writer and readers', () => {
    test('single reader', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.provisioned('writer', {
          // instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE24 ),
        }),
        readers: [ClusterInstance.provisioned('reader')],
      });

      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::RDS::DBInstance', 2);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.t3.medium',
        PromotionTier: 0,
      });

      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.t3.medium',
        PromotionTier: 2,
      });

      Annotations.fromStack(stack).hasNoWarning('*', '*');
    });

    test('throws warning if instance types do not match', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.provisioned('writer', {
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE24 ),
        }),
        readers: [
          ClusterInstance.provisioned('reader'),
          ClusterInstance.provisioned('reader2', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE ),
          }),
        ],
      });

      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::RDS::DBInstance', 3);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.m5.24xlarge',
        PromotionTier: 0,
      });
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.t3.medium',
        PromotionTier: 2,
      });
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.m5.xlarge',
        PromotionTier: 2,
      });

      Annotations.fromStack(stack).hasWarning('*',
        'There are provisioned readers in the highest promotion tier 2 that do not have the same '+
        'InstanceSize as the writer. Any of these instances could be chosen as the new writer in the event '+
        'of a failover.\n'+
        'Writer InstanceSize: m5.24xlarge\n'+
        'Reader InstanceSizes: t3.medium, m5.xlarge [ack: @aws-cdk/aws-rds:provisionedReadersDontMatchWriter]',
      );
    });

    test('does not throw warning if highest tier matches', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.provisioned('writer', {
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE24 ),
        }),
        readers: [
          ClusterInstance.provisioned('reader'),
          ClusterInstance.provisioned('reader2', {
            promotionTier: 1,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE24 ),
          }),
        ],
      });

      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::RDS::DBInstance', 3);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.m5.24xlarge',
        PromotionTier: 0,
      });
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.t3.medium',
        PromotionTier: 2,
      });
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.m5.24xlarge',
        PromotionTier: 1,
      });

      Annotations.fromStack(stack).hasNoWarning('*', '*');
    });

    test('can create with multiple readers with each parameters', () => {
      // GIVEN
      const stack = testStack();
      stack.node.setContext(AURORA_CLUSTER_CHANGE_SCOPE_OF_INSTANCE_PARAMETER_GROUP_WITH_EACH_PARAMETERS, true);
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.provisioned('writer', {}),
        readers: [
          ClusterInstance.provisioned('reader', {
            parameters: {},
          }),
          ClusterInstance.provisioned('reader2', {
            parameters: {},
          }),
        ],
      });

      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::RDS::DBInstance', 3);
      template.resourceCountIs('AWS::RDS::DBParameterGroup', 2);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
      });
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBParameterGroupName: { Ref: 'DatabasereaderInstanceParameterGroupA66BCEF9' },
      });
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBParameterGroupName: { Ref: 'Databasereader2InstanceParameterGroupD35BEBC4' },
      });

      Annotations.fromStack(stack).hasNoWarning('*', '*');
    });
  });

  describe('mixed readers', () => {
    test('no warnings', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.provisioned('writer', {
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE24 ),
        }),
        readers: [
          ClusterInstance.serverlessV2('reader'),
          ClusterInstance.provisioned('reader2', {
            promotionTier: 1,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE24 ),
          }),
        ],
      });

      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::RDS::DBInstance', 3);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.m5.24xlarge',
        PromotionTier: 0,
      });
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.serverless',
        PromotionTier: 2,
      });
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.m5.24xlarge',
        PromotionTier: 1,
      });

      Annotations.fromStack(stack).hasNoWarning('*', '*');
    });

    test('throws warning if not scaling with writer', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.provisioned('writer', {
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE24 ),
        }),
        readers: [
          ClusterInstance.serverlessV2('reader'),
          ClusterInstance.provisioned('reader2', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE ),
          }),
        ],
      });

      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::RDS::DBInstance', 3);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.m5.24xlarge',
        PromotionTier: 0,
      });
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.serverless',
        PromotionTier: 2,
      });
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.m5.xlarge',
        PromotionTier: 2,
      });

      Annotations.fromStack(stack).hasWarning('*',
        'There are serverlessV2 readers in tier 2. Since there are no instances in a higher tier, '+
        'any instance in this tier is a failover target. Since this tier is > 1 the serverless reader will not scale '+
        'with the writer which could lead to availability issues during failover. [ack: @aws-cdk/aws-rds:serverlessInHighestTier2-15]',
      );

      Annotations.fromStack(stack).hasWarning('*',
        'There are provisioned readers in the highest promotion tier 2 that do not have the same '+
        'InstanceSize as the writer. Any of these instances could be chosen as the new writer in the event '+
        'of a failover.\n'+
        'Writer InstanceSize: m5.24xlarge\n'+
        'Reader InstanceSizes: m5.xlarge [ack: @aws-cdk/aws-rds:provisionedReadersDontMatchWriter]',
      );
    });

    test('support CA certificate identifier on writer and readers', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        vpc,
        writer: ClusterInstance.provisioned('writer', {
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE24 ),
          caCertificate: CaCertificate.RDS_CA_RDS4096_G1,
        }),
        readers: [
          ClusterInstance.serverlessV2('reader', {
            caCertificate: CaCertificate.RDS_CA_RDS2048_G1,
          }),
          ClusterInstance.provisioned('reader2', {
            promotionTier: 1,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE24 ),
            caCertificate: CaCertificate.of('custom-ca-id'),
          }),
        ],
      });

      // THEN
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::RDS::DBInstance', 3);
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.m5.24xlarge',
        PromotionTier: 0,
        CACertificateIdentifier: 'rds-ca-rsa4096-g1',
      });
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.serverless',
        PromotionTier: 2,
        CACertificateIdentifier: 'rds-ca-rsa2048-g1',
      });
      template.hasResourceProperties('AWS::RDS::DBInstance', {
        DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' },
        DBInstanceClass: 'db.m5.24xlarge',
        PromotionTier: 1,
        CACertificateIdentifier: 'custom-ca-id',
      });
    });
  });
});

describe('cluster', () => {
  test('creating a Cluster also creates 2 DB Instances', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      iamAuthentication: true,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::RDS::DBCluster', {
      Properties: {
        Engine: 'aurora',
        DBSubnetGroupName: { Ref: 'DatabaseSubnets56F17B9A' },
        MasterUsername: 'admin',
        MasterUserPassword: 'tooshort',
        VpcSecurityGroupIds: [{ 'Fn::GetAtt': ['DatabaseSecurityGroup5C91FDCB', 'GroupId'] }],
        EnableIAMDatabaseAuthentication: true,
        CopyTagsToSnapshot: true,
      },
      DeletionPolicy: 'Snapshot',
      UpdateReplacePolicy: 'Snapshot',
    });

    Template.fromStack(stack).resourceCountIs('AWS::RDS::DBInstance', 2);
    Template.fromStack(stack).hasResource('AWS::RDS::DBInstance', {
      DeletionPolicy: 'Delete',
      UpdateReplacePolicy: 'Delete',
    });
  });

  test('validates that the number of instances is not a deploy-time value', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const parameter = new cdk.CfnParameter(stack, 'Param', { type: 'Number' });

    expect(() => {
      new DatabaseCluster(stack, 'Database', {
        instances: parameter.valueAsNumber,
        engine: DatabaseClusterEngine.AURORA,
        instanceProps: {
          vpc,
        },
      });
    }).toThrow('The number of instances an RDS Cluster consists of cannot be provided as a deploy-time only value!');
  });

  test('can create a cluster with a single instance', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora',
      DBSubnetGroupName: { Ref: 'DatabaseSubnets56F17B9A' },
      MasterUsername: 'admin',
      MasterUserPassword: 'tooshort',
      VpcSecurityGroupIds: [{ 'Fn::GetAtt': ['DatabaseSecurityGroup5C91FDCB', 'GroupId'] }],
    });

    expect(stack.resolve(cluster.clusterResourceIdentifier)).toEqual({ 'Fn::GetAtt': ['DatabaseB269D8BB', 'DBClusterResourceId'] });
    expect(cluster.instanceIdentifiers).toHaveLength(1);
    expect(stack.resolve(cluster.instanceIdentifiers[0])).toEqual({
      Ref: 'DatabaseInstance1844F58FD',
    });

    expect(cluster.instanceEndpoints).toHaveLength(1);
    expect(stack.resolve(cluster.instanceEndpoints[0])).toEqual({
      hostname: {
        'Fn::GetAtt': ['DatabaseInstance1844F58FD', 'Endpoint.Address'],
      },
      port: {
        'Fn::GetAtt': ['DatabaseB269D8BB', 'Endpoint.Port'],
      },
      socketAddress: {
        'Fn::Join': ['', [
          { 'Fn::GetAtt': ['DatabaseInstance1844F58FD', 'Endpoint.Address'] },
          ':',
          { 'Fn::GetAtt': ['DatabaseB269D8BB', 'Endpoint.Port'] },
        ]],
      },
    });
  });

  test('can create a cluster with ROLLING instance update behaviour', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 5,
      instanceProps: {
        vpc,
      },
      instanceUpdateBehaviour: InstanceUpdateBehaviour.ROLLING,
    });

    // THEN
    const instanceResources = Template.fromStack(stack).findResources('AWS::RDS::DBInstance');
    const instances = Object.keys(instanceResources);
    const instanceDependencies = Object.values(instanceResources)
      .map(properties => (properties.DependsOn as string[]).filter(dependency => instances.includes(dependency)));
    // check that there are only required dependencies to form a chain of dependant instances
    for (const dependencies of instanceDependencies) {
      expect(dependencies.length).toBeLessThanOrEqual(1);
    }
    // check that all but one instance are a dependency of another instance
    const dependantInstances = instanceDependencies.flat();
    expect(dependantInstances).toHaveLength(instances.length - 1);
    expect(instances.filter(it => !dependantInstances.includes(it))).toHaveLength(1);
  });

  test('can create a cluster with imported vpc and security group', () => {
    // GIVEN
    const stack = testStack();
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', {
      vpcId: 'VPC12345',
    });
    const sg = ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'SecurityGroupId12345');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
        securityGroups: [sg],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora',
      DBSubnetGroupName: { Ref: 'DatabaseSubnets56F17B9A' },
      MasterUsername: 'admin',
      MasterUserPassword: 'tooshort',
      VpcSecurityGroupIds: ['SecurityGroupId12345'],
    });
  });

  test('cluster with parameter group', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const group = new ParameterGroup(stack, 'Params', {
      engine: DatabaseClusterEngine.AURORA,
      description: 'bye',
      parameters: {
        param: 'value',
      },
    });
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      parameterGroup: group,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DBClusterParameterGroupName: { Ref: 'ParamsA8366201' },
    });
  });

  test("sets the retention policy of the SubnetGroup to 'Retain' if the Cluster is created with 'Retain'", () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new DatabaseCluster(stack, 'Cluster', {
      credentials: { username: 'admin' },
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
        vpc,
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    Template.fromStack(stack).hasResource('AWS::RDS::DBSubnetGroup', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
  });

  test('creates a secret when master credentials are not specified', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      credentials: {
        username: 'admin',
        excludeCharacters: '"@/\\',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      MasterUsername: {
        'Fn::Join': [
          '',
          [
            '{{resolve:secretsmanager:',
            {
              Ref: 'DatabaseSecret3B817195',
            },
            ':SecretString:username::}}',
          ],
        ],
      },
      MasterUserPassword: {
        'Fn::Join': [
          '',
          [
            '{{resolve:secretsmanager:',
            {
              Ref: 'DatabaseSecret3B817195',
            },
            ':SecretString:password::}}',
          ],
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        ExcludeCharacters: '\"@/\\',
        GenerateStringKey: 'password',
        PasswordLength: 30,
        SecretStringTemplate: '{"username":"admin"}',
      },
    });
  });

  test('create an encrypted cluster with custom KMS key', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      storageEncryptionKey: new kms.Key(stack, 'Key'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      KmsKeyId: {
        'Fn::GetAtt': [
          'Key961B73FD',
          'Arn',
        ],
      },
    });
  });

  test('cluster with instance parameter group', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const parameterGroup = new ParameterGroup(stack, 'ParameterGroup', {
      engine: DatabaseClusterEngine.AURORA,
      parameters: {
        key: 'value',
      },
    });

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        parameterGroup,
        vpc,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      DBParameterGroupName: {
        Ref: 'ParameterGroup5E32DECB',
      },
    });
  });

  test('cluster with inline parameter group', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      parameters: {
        locks: '100',
      },
      instanceProps: {
        vpc,
        parameters: {
          locks: '200',
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DBClusterParameterGroupName: {
        Ref: 'DatabaseParameterGroup2A921026',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        locks: '100',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      DBParameterGroupName: {
        Ref: 'DatabaseInstanceParameterGroup6968C5BF',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        locks: '200',
      },
    });
  });

  test('cluster with inline parameter group and parameterGroup arg fails', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const parameterGroup = new ParameterGroup(stack, 'ParameterGroup', {
      engine: DatabaseInstanceEngine.sqlServerEe({
        version: SqlServerEngineVersion.VER_11,
      }),
      parameters: {
        locks: '50',
      },
    });

    expect(() => {
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        parameters: {
          locks: '100',
        },
        parameterGroup,
        instanceProps: {
          vpc,
          parameters: {
            locks: '200',
          },
        },
      });
    }).toThrow(/You cannot specify both parameterGroup and parameters/);
  });

  test('instance with inline parameter group and parameterGroup arg fails', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const parameterGroup = new ParameterGroup(stack, 'ParameterGroup', {
      engine: DatabaseInstanceEngine.sqlServerEe({
        version: SqlServerEngineVersion.VER_11,
      }),
      parameters: {
        locks: '50',
      },
    });

    expect(() => {
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        parameters: {
          locks: '100',
        },
        instanceProps: {
          vpc,
          parameterGroup,
          parameters: {
            locks: '200',
          },
        },
      });
    }).toThrow(/You cannot specify both parameterGroup and parameters/);
  });

  test('instance with IPv4 network type', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        vpc,
      },
      networkType: NetworkType.IPV4,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      NetworkType: 'IPV4',
    });
  });

  test('instance with dual-stack network type', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        vpc,
      },
      networkType: NetworkType.DUAL,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      NetworkType: 'DUAL',
    });
  });

  describe('performance insights', () => {
    test('cluster with all performance insights properties', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        credentials: {
          username: 'admin',
        },
        instanceProps: {
          vpc,
          enablePerformanceInsights: true,
          performanceInsightRetention: PerformanceInsightRetention.LONG_TERM,
          performanceInsightEncryptionKey: new kms.Key(stack, 'Key'),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
        EnablePerformanceInsights: true,
        PerformanceInsightsRetentionPeriod: 731,
        PerformanceInsightsKMSKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
      });
    });

    test('setting performance insights fields enables performance insights', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      // WHEN
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        credentials: {
          username: 'admin',
        },
        instanceProps: {
          vpc,
          performanceInsightRetention: PerformanceInsightRetention.LONG_TERM,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
        EnablePerformanceInsights: true,
        PerformanceInsightsRetentionPeriod: 731,
      });
    });

    test('throws if performance insights fields are set but performance insights is disabled', () => {
      // GIVEN
      const stack = testStack();
      const vpc = new ec2.Vpc(stack, 'VPC');

      expect(() => {
        new DatabaseCluster(stack, 'Database', {
          engine: DatabaseClusterEngine.AURORA,
          credentials: {
            username: 'admin',
          },
          instanceProps: {
            vpc,
            enablePerformanceInsights: false,
            performanceInsightRetention: PerformanceInsightRetention.DEFAULT,
          },
        });
      }).toThrow(/`enablePerformanceInsights` disabled, but `performanceInsightRetention` or `performanceInsightEncryptionKey` was set/);
    });
  });

  test('cluster with disable automatic upgrade of minor version', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        autoMinorVersionUpgrade: false,
        vpc,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      AutoMinorVersionUpgrade: false,
    });
  });

  test('cluster with allow upgrade of major version', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        allowMajorVersionUpgrade: true,
        vpc,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      AllowMajorVersionUpgrade: true,
    });
  });

  test('cluster with disallow remove backups', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        deleteAutomatedBackups: false,
        vpc,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      DeleteAutomatedBackups: false,
    });
  });

  test('create a cluster using a specific version of MySQL', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraMysql({
        version: AuroraMysqlEngineVersion.VER_2_04_4,
      }),
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora-mysql',
      EngineVersion: '5.7.mysql_aurora.2.04.4',
    });
  });

  test('create a cluster using a specific version of Postgresql', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_10_7,
      }),
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora-postgresql',
      EngineVersion: '10.7',
    });
  });

  test('cluster exposes different read and write endpoints', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // THEN
    expect(stack.resolve(cluster.clusterEndpoint)).not.toEqual(stack.resolve(cluster.clusterReadEndpoint));
  });

  test('imported cluster with imported security group honors allowAllOutbound', () => {
    // GIVEN
    const stack = testStack();

    const cluster = DatabaseCluster.fromDatabaseClusterAttributes(stack, 'Database', {
      clusterEndpointAddress: 'addr',
      clusterIdentifier: 'identifier',
      instanceEndpointAddresses: ['addr'],
      instanceIdentifiers: ['identifier'],
      port: 3306,
      readerEndpointAddress: 'reader-address',
      securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
        allowAllOutbound: false,
      })],
    });

    // WHEN
    cluster.connections.allowToAnyIpv4(ec2.Port.tcp(443));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
      GroupId: 'sg-123456789',
    });
  });

  test('can import a cluster with minimal attributes', () => {
    const stack = testStack();

    const cluster = DatabaseCluster.fromDatabaseClusterAttributes(stack, 'Database', {
      clusterIdentifier: 'identifier',
    });

    expect(cluster.clusterIdentifier).toEqual('identifier');
  });

  test('minimal imported cluster throws on accessing attributes for unprovided parameters', () => {
    const stack = testStack();

    const cluster = DatabaseCluster.fromDatabaseClusterAttributes(stack, 'Database', {
      clusterIdentifier: 'identifier',
    });

    expect(() => cluster.clusterResourceIdentifier).toThrow(/Cannot access `clusterResourceIdentifier` of an imported cluster/);
    expect(() => cluster.clusterEndpoint).toThrow(/Cannot access `clusterEndpoint` of an imported cluster/);
    expect(() => cluster.clusterReadEndpoint).toThrow(/Cannot access `clusterReadEndpoint` of an imported cluster/);
    expect(() => cluster.instanceIdentifiers).toThrow(/Cannot access `instanceIdentifiers` of an imported cluster/);
    expect(() => cluster.instanceEndpoints).toThrow(/Cannot access `instanceEndpoints` of an imported cluster/);
  });

  test('imported cluster can access properties if attributes are provided', () => {
    const stack = testStack();

    const cluster = DatabaseCluster.fromDatabaseClusterAttributes(stack, 'Database', {
      clusterEndpointAddress: 'addr',
      clusterIdentifier: 'identifier',
      clusterResourceIdentifier: 'identifier',
      instanceEndpointAddresses: ['instance-addr'],
      instanceIdentifiers: ['identifier'],
      port: 3306,
      readerEndpointAddress: 'reader-address',
      securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
        allowAllOutbound: false,
      })],
    });

    expect(cluster.clusterResourceIdentifier).toEqual('identifier');
    expect(cluster.clusterEndpoint.socketAddress).toEqual('addr:3306');
    expect(cluster.clusterReadEndpoint.socketAddress).toEqual('reader-address:3306');
    expect(cluster.instanceIdentifiers).toEqual(['identifier']);
    expect(cluster.instanceEndpoints.map(endpoint => endpoint.socketAddress)).toEqual(['instance-addr:3306']);
  });

  test('cluster supports metrics', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_3_02_0 }),
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        vpc,
      },
    });

    expect(stack.resolve(cluster.metricCPUUtilization())).toEqual({
      dimensions: { DBClusterIdentifier: { Ref: 'DatabaseB269D8BB' } },
      namespace: 'AWS/RDS',
      metricName: 'CPUUtilization',
      period: cdk.Duration.minutes(5),
      statistic: 'Average',
      account: '12345',
      region: 'us-test-1',
    });
  });

  test('cluster with enabled monitoring (legacy)', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      monitoringInterval: cdk.Duration.minutes(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      MonitoringInterval: 60,
      MonitoringRoleArn: {
        'Fn::GetAtt': ['DatabaseMonitoringRole576991DA', 'Arn'],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'monitoring.rds.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole',
            ],
          ],
        },
      ],
    });
  });

  test('cluster with enabled monitoring should create default role with new api', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      vpc,
      writer: ClusterInstance.serverlessV2('writer'),
      iamAuthentication: true,
      monitoringInterval: cdk.Duration.minutes(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      MonitoringInterval: 60,
      MonitoringRoleArn: {
        'Fn::GetAtt': ['DatabaseMonitoringRole576991DA', 'Arn'],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'monitoring.rds.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole',
            ],
          ],
        },
      ],
    });
  });

  test('create a cluster with imported monitoring role', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const monitoringRole = new Role(stack, 'MonitoringRole', {
      assumedBy: new ServicePrincipal('monitoring.rds.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonRDSEnhancedMonitoringRole'),
      ],
    });

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      monitoringInterval: cdk.Duration.minutes(1),
      monitoringRole,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      MonitoringInterval: 60,
      MonitoringRoleArn: {
        'Fn::GetAtt': ['MonitoringRole90457BF9', 'Arn'],
      },
    });
  });

  test('addRotationSingleUser()', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // WHEN
    cluster.addRotationSingleUser();

    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'DatabaseSecretAttachmentE5D1B020',
      },
      RotationLambdaARN: {
        'Fn::GetAtt': [
          'DatabaseRotationSingleUser65F55654',
          'Outputs.RotationLambdaARN',
        ],
      },
      RotationRules: {
        ScheduleExpression: 'rate(30 days)',
      },
    });
  });

  test('addRotationMultiUser()', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    const userSecret = new DatabaseSecret(stack, 'UserSecret', { username: 'user' });
    cluster.addRotationMultiUser('user', { secret: userSecret.attach(cluster) });

    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'UserSecretAttachment16ACBE6D',
      },
      RotationLambdaARN: {
        'Fn::GetAtt': [
          'DatabaseuserECD1FB0C',
          'Outputs.RotationLambdaARN',
        ],
      },
      RotationRules: {
        ScheduleExpression: 'rate(30 days)',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
      Parameters: {
        masterSecretArn: {
          Ref: 'DatabaseSecretAttachmentE5D1B020',
        },
      },
    });
  });

  test('addRotationSingleUser() with custom automaticallyAfter, excludeCharacters, vpcSubnets and securityGroup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpcWithIsolated = ec2.Vpc.fromVpcAttributes(stack, 'Vpc', {
      vpcId: 'vpc-id',
      availabilityZones: ['az1'],
      publicSubnetIds: ['public-subnet-id-1', 'public-subnet-id-2'],
      publicSubnetNames: ['public-subnet-name-1', 'public-subnet-name-2'],
      privateSubnetIds: ['private-subnet-id-1', 'private-subnet-id-2'],
      privateSubnetNames: ['private-subnet-name-1', 'private-subnet-name-2'],
      isolatedSubnetIds: ['isolated-subnet-id-1', 'isolated-subnet-id-2'],
      isolatedSubnetNames: ['isolated-subnet-name-1', 'isolated-subnet-name-2'],
    });
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
      vpc: vpcWithIsolated,
    });

    // WHEN
    // DB in isolated subnet (no internet connectivity)
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc: vpcWithIsolated,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      },
    });

    // Rotation in private subnet (internet via NAT)
    cluster.addRotationSingleUser({
      automaticallyAfter: cdk.Duration.days(15),
      excludeCharacters: '°_@',
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroup,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      RotationRules: {
        ScheduleExpression: 'rate(15 days)',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
      Parameters: {
        endpoint: {
          'Fn::Join': ['', [
            'https://secretsmanager.',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
          ]],
        },
        vpcSubnetIds: 'private-subnet-id-1,private-subnet-id-2',
        excludeCharacters: '°_@',
        vpcSecurityGroupIds: {
          'Fn::GetAtt': [
            stack.getLogicalId(securityGroup.node.defaultChild as ec2.CfnSecurityGroup),
            'GroupId',
          ],
        },
      },
    });
  });

  test('addRotationMultiUser() with custom automaticallyAfter, excludeCharacters, vpcSubnets and securityGroup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpcWithIsolated = ec2.Vpc.fromVpcAttributes(stack, 'Vpc', {
      vpcId: 'vpc-id',
      availabilityZones: ['az1'],
      publicSubnetIds: ['public-subnet-id-1', 'public-subnet-id-2'],
      publicSubnetNames: ['public-subnet-name-1', 'public-subnet-name-2'],
      privateSubnetIds: ['private-subnet-id-1', 'private-subnet-id-2'],
      privateSubnetNames: ['private-subnet-name-1', 'private-subnet-name-2'],
      isolatedSubnetIds: ['isolated-subnet-id-1', 'isolated-subnet-id-2'],
      isolatedSubnetNames: ['isolated-subnet-name-1', 'isolated-subnet-name-2'],
    });
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
      vpc: vpcWithIsolated,
    });
    const userSecret = new DatabaseSecret(stack, 'UserSecret', { username: 'user' });

    // WHEN
    // DB in isolated subnet (no internet connectivity)
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc: vpcWithIsolated,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      },
    });

    // Rotation in private subnet (internet via NAT)
    cluster.addRotationMultiUser('user', {
      secret: userSecret.attach(cluster),
      automaticallyAfter: cdk.Duration.days(15),
      excludeCharacters: '°_@',
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroup,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      RotationRules: {
        ScheduleExpression: 'rate(15 days)',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
      Parameters: {
        endpoint: {
          'Fn::Join': ['', [
            'https://secretsmanager.',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
          ]],
        },
        vpcSubnetIds: 'private-subnet-id-1,private-subnet-id-2',
        excludeCharacters: '°_@',
        vpcSecurityGroupIds: {
          'Fn::GetAtt': [
            stack.getLogicalId(securityGroup.node.defaultChild as ec2.CfnSecurityGroup),
            'GroupId',
          ],
        },
      },
    });
  });

  test('addRotationSingleUser() with VPC interface endpoint', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpcIsolatedOnly = new ec2.Vpc(stack, 'Vpc', { natGateways: 0 });

    const endpoint = new ec2.InterfaceVpcEndpoint(stack, 'Endpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      vpc: vpcIsolatedOnly,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    });

    // DB in isolated subnet (no internet connectivity)
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc: vpcIsolatedOnly,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      },
    });

    // Rotation in isolated subnet with access to Secrets Manager API via endpoint
    cluster.addRotationSingleUser({ endpoint });

    Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
      Parameters: {
        endpoint: {
          'Fn::Join': ['', [
            'https://',
            { Ref: 'EndpointEEF1FD8F' },
            '.secretsmanager.',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
          ]],
        },
        functionName: 'DatabaseRotationSingleUser458A45BE',
        vpcSubnetIds: {
          'Fn::Join': ['', [
            { Ref: 'VpcIsolatedSubnet1SubnetE48C5737' },
            ',',
            { Ref: 'VpcIsolatedSubnet2Subnet16364B91' },
          ]],
        },
        vpcSecurityGroupIds: {
          'Fn::GetAtt': [
            'DatabaseRotationSingleUserSecurityGroupAC6E0E73',
            'GroupId',
          ],
        },
        excludeCharacters: " %+~`#$&*()|[]{}:;<>?!'/@\"\\",
      },
    });
  });

  test('addRotationSingleUser() without immediate rotation', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      writer: ClusterInstance.serverlessV2('writer'),
      vpc,
    });

    // WHEN
    cluster.addRotationSingleUser({ rotateImmediatelyOnUpdate: false });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'DatabaseSecretAttachmentE5D1B020',
      },
      RotationLambdaARN: {
        'Fn::GetAtt': [
          'DatabaseRotationSingleUser65F55654',
          'Outputs.RotationLambdaARN',
        ],
      },
      RotationRules: {
        ScheduleExpression: 'rate(30 days)',
      },
      RotateImmediatelyOnUpdate: false,
    });
  });

  test('addRotationMultiUser() without immediate rotation', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      writer: ClusterInstance.serverlessV2('writer'),
      vpc,
    });
    const userSecret = new DatabaseSecret(stack, 'UserSecret', { username: 'user' });

    // WHEN
    cluster.addRotationMultiUser('user', {
      secret: userSecret.attach(cluster),
      rotateImmediatelyOnUpdate: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'UserSecretAttachment16ACBE6D',
      },
      RotationLambdaARN: {
        'Fn::GetAtt': [
          'DatabaseuserECD1FB0C',
          'Outputs.RotationLambdaARN',
        ],
      },
      RotationRules: {
        ScheduleExpression: 'rate(30 days)',
      },
      RotateImmediatelyOnUpdate: false,
    });
  });

  test('throws when trying to add rotation to a cluster without secret', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // THEN
    expect(() => cluster.addRotationSingleUser()).toThrow(/without a secret/);
  });

  test('throws when trying to add single user rotation multiple times', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      credentials: { username: 'admin' },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // WHEN
    cluster.addRotationSingleUser();

    // THEN
    expect(() => cluster.addRotationSingleUser()).toThrow(/A single user rotation was already added to this cluster/);
  });

  test('create a cluster with s3 import role', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const associatedRole = new Role(stack, 'AssociatedRole', {
      assumedBy: new ServicePrincipal('rds.amazonaws.com'),
    });

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ImportRole: associatedRole,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'AssociatedRole824CFCD3',
            'Arn',
          ],
        },
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        aurora_load_from_s3_role: {
          'Fn::GetAtt': [
            'AssociatedRole824CFCD3',
            'Arn',
          ],
        },
      },
    });
  });

  test('create a cluster with s3 import buckets', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ImportBuckets: [bucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ImportRole377BC9C0',
            'Arn',
          ],
        },
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        aurora_load_from_s3_role: {
          'Fn::GetAtt': [
            'DatabaseS3ImportRole377BC9C0',
            'Arn',
          ],
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'Bucket83908E77',
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('cluster with s3 import bucket adds supported feature name to IAM role', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_10_12,
      }),
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ImportBuckets: [bucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ImportRole377BC9C0',
            'Arn',
          ],
        },
        FeatureName: 's3Import',
      }],
    });
  });

  test('throws when s3 import bucket or s3 export bucket is supplied for a Postgres version that does not support it', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN / THEN
    expect(() => {
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.auroraPostgres({
          version: AuroraPostgresEngineVersion.VER_10_4,
        }),
        instances: 1,
        credentials: {
          username: 'admin',
        },
        instanceProps: {
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
          vpc,
        },
        s3ImportBuckets: [bucket],
      });
    }).toThrow(/s3Import is not supported for Postgres version: 10.4. Use a version that supports the s3Import feature./);

    expect(() => {
      new DatabaseCluster(stack, 'AnotherDatabase', {
        engine: DatabaseClusterEngine.auroraPostgres({
          version: AuroraPostgresEngineVersion.VER_10_4,
        }),
        instances: 1,
        credentials: {
          username: 'admin',
        },
        instanceProps: {
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
          vpc,
        },
        s3ExportBuckets: [bucket],
      });
    }).toThrow(/s3Export is not supported for Postgres version: 10.4. Use a version that supports the s3Export feature./);
  });

  test('cluster with s3 export bucket adds supported feature name to IAM role', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_10_12,
      }),
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ExportBuckets: [bucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
        FeatureName: 's3Export',
      }],
    });
  });

  test('create a cluster with s3 export role', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const associatedRole = new Role(stack, 'AssociatedRole', {
      assumedBy: new ServicePrincipal('rds.amazonaws.com'),
    });

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ExportRole: associatedRole,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'AssociatedRole824CFCD3',
            'Arn',
          ],
        },
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        aurora_select_into_s3_role: {
          'Fn::GetAtt': [
            'AssociatedRole824CFCD3',
            'Arn',
          ],
        },
      },
    });
  });

  test('create a cluster with s3 export buckets', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ExportBuckets: [bucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        aurora_select_into_s3_role: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
              's3:DeleteObject*',
              's3:PutObject',
              's3:PutObjectLegalHold',
              's3:PutObjectRetention',
              's3:PutObjectTagging',
              's3:PutObjectVersionTagging',
              's3:Abort*',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'Bucket83908E77',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'Bucket83908E77',
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('create a cluster with s3 import and export buckets', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const importBucket = new s3.Bucket(stack, 'ImportBucket');
    const exportBucket = new s3.Bucket(stack, 'ExportBucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ImportBuckets: [importBucket],
      s3ExportBuckets: [exportBucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ImportRole377BC9C0',
            'Arn',
          ],
        },
      },
      {
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        aurora_load_from_s3_role: {
          'Fn::GetAtt': [
            'DatabaseS3ImportRole377BC9C0',
            'Arn',
          ],
        },
        aurora_select_into_s3_role: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
      },
    });
  });

  test('create a cluster with s3 import and export buckets and custom parameter group', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const parameterGroup = new ParameterGroup(stack, 'ParameterGroup', {
      engine: DatabaseClusterEngine.AURORA,
      parameters: {
        key: 'value',
      },
    });

    const importBucket = new s3.Bucket(stack, 'ImportBucket');
    const exportBucket = new s3.Bucket(stack, 'ExportBucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      parameterGroup,
      s3ImportBuckets: [importBucket],
      s3ExportBuckets: [exportBucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ImportRole377BC9C0',
            'Arn',
          ],
        },
      },
      {
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora5.6',
      Parameters: {
        key: 'value',
        aurora_load_from_s3_role: {
          'Fn::GetAtt': [
            'DatabaseS3ImportRole377BC9C0',
            'Arn',
          ],
        },
        aurora_select_into_s3_role: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
      },
    });
  });

  test('PostgreSQL cluster with s3 export buckets does not generate custom parameter group and specifies the correct port', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_11_6,
      }),
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ExportBuckets: [bucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [{
        RoleArn: {
          'Fn::GetAtt': [
            'DatabaseS3ExportRole9E328562',
            'Arn',
          ],
        },
      }],
      DBClusterParameterGroupName: 'default.aurora-postgresql11',
      Port: 5432,
    });

    Template.fromStack(stack).resourceCountIs('AWS::RDS::DBClusterParameterGroup', 0);
  });

  test('unversioned PostgreSQL cluster can be used with s3 import and s3 export buckets', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const bucket = new s3.Bucket(stack, 'Bucket');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      parameterGroup: ParameterGroup.fromParameterGroupName(stack, 'ParameterGroup', 'default.aurora-postgresql11'),
      s3ImportBuckets: [bucket],
      s3ExportBuckets: [bucket],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      AssociatedRoles: [
        {
          FeatureName: 's3Import',
          RoleArn: {
            'Fn::GetAtt': [
              'DatabaseS3ImportRole377BC9C0',
              'Arn',
            ],
          },
        },
        {
          FeatureName: 's3Export',
          RoleArn: {
            'Fn::GetAtt': [
              'DatabaseS3ExportRole9E328562',
              'Arn',
            ],
          },
        },
      ],
    });
  });

  test("Aurora PostgreSQL cluster uses a different default master username than 'admin', which is a reserved word", () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_9_6_12,
      }),
      instanceProps: { vpc },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        SecretStringTemplate: '{"username":"postgres"}',
      },
    });
  });

  test('MySQL cluster without S3 exports or imports references the correct default ParameterGroup', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DBClusterParameterGroupName: 'default.aurora-mysql5.7',
    });

    Template.fromStack(stack).resourceCountIs('AWS::RDS::DBClusterParameterGroup', 0);
  });

  test('MySQL cluster in version 8.0 uses aws_default_s3_role as a Parameter for S3 import/export, instead of aurora_load/select_from_s3_role', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      instanceProps: { vpc },
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_3_01_0 }),
      s3ImportBuckets: [new s3.Bucket(stack, 'ImportBucket')],
      s3ExportBuckets: [new s3.Bucket(stack, 'ExportBucket')],
    });

    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::RDS::DBClusterParameterGroup', {
      Family: 'aurora-mysql8.0',
      Parameters: {
        aws_default_s3_role: {
          'Fn::GetAtt': ['DatabaseS3ImportRole377BC9C0', 'Arn'],
        },
        aurora_load_from_s3_role: Match.absent(),
        aurora_select_into_s3_role: Match.absent(),
      },
    });
    assert.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('throws when s3ExportRole and s3ExportBuckets properties are both specified', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const exportRole = new Role(stack, 'ExportRole', {
      assumedBy: new ServicePrincipal('rds.amazonaws.com'),
    });
    const exportBucket = new s3.Bucket(stack, 'ExportBucket');

    // THEN
    expect(() => new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ExportRole: exportRole,
      s3ExportBuckets: [exportBucket],
    })).toThrow();
  });

  test('throws when s3ImportRole and s3ImportBuckets properties are both specified', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const importRole = new Role(stack, 'ImportRole', {
      assumedBy: new ServicePrincipal('rds.amazonaws.com'),
    });
    const importBucket = new s3.Bucket(stack, 'ImportBucket');

    // THEN
    expect(() => new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      s3ImportRole: importRole,
      s3ImportBuckets: [importBucket],
    })).toThrow();
  });

  test('can set CloudWatch log exports', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      cloudwatchLogsExports: ['error', 'general', 'slowquery', 'audit'],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      EnableCloudwatchLogsExports: ['error', 'general', 'slowquery', 'audit'],
    });
  });

  test('can set CloudWatch log retention', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      cloudwatchLogsExports: ['error', 'general'],
      cloudwatchLogsRetention: logs.RetentionDays.THREE_MONTHS,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
      ServiceToken: {
        'Fn::GetAtt': [
          'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
          'Arn',
        ],
      },
      LogGroupName: { 'Fn::Join': ['', ['/aws/rds/cluster/', { Ref: 'DatabaseB269D8BB' }, '/error']] },
      RetentionInDays: 90,
    });
    Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
      ServiceToken: {
        'Fn::GetAtt': [
          'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
          'Arn',
        ],
      },
      LogGroupName: { 'Fn::Join': ['', ['/aws/rds/cluster/', { Ref: 'DatabaseB269D8BB' }, '/general']] },
      RetentionInDays: 90,
    });
  });

  test('throws if given unsupported CloudWatch log exports', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    expect(() => {
      new DatabaseCluster(stack, 'Database', {
        engine: DatabaseClusterEngine.AURORA,
        credentials: {
          username: 'admin',
          password: cdk.SecretValue.unsafePlainText('tooshort'),
        },
        instanceProps: {
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
          vpc,
        },
        cloudwatchLogsExports: ['error', 'general', 'slowquery', 'audit', 'thislogdoesnotexist', 'neitherdoesthisone'],
      });
    }).toThrow(/Unsupported logs for the current engine type: thislogdoesnotexist,neitherdoesthisone/);
  });

  test('can set deletion protection', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      credentials: {
        username: 'admin',
        password: cdk.SecretValue.unsafePlainText('tooshort'),
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
      },
      deletionProtection: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DeletionProtection: true,
    });
  });

  test('does not throw (but adds a node error) if a (dummy) VPC does not have sufficient subnets', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = testStack(app, 'TestStack');
    const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instances: 1,
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpc,
        vpcSubnets: {
          subnetName: 'DefinitelyDoesNotExist',
        },
      },
    });

    // THEN
    const art = app.synth().getStackArtifact('TestStack');
    const meta = art.findMetadataByType('aws:cdk:error');
    expect(meta[0].data).toEqual('Cluster requires at least 2 subnets, got 0');
  });

  test('create a cluster from a snapshot', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
      iamAuthentication: true,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::RDS::DBCluster', {
      Properties: {
        Engine: 'aurora',
        EngineVersion: '5.6.mysql_aurora.1.22.2',
        DBSubnetGroupName: { Ref: 'DatabaseSubnets56F17B9A' },
        VpcSecurityGroupIds: [{ 'Fn::GetAtt': ['DatabaseSecurityGroup5C91FDCB', 'GroupId'] }],
        SnapshotIdentifier: 'mySnapshot',
        EnableIAMDatabaseAuthentication: true,
        CopyTagsToSnapshot: true,
      },
      DeletionPolicy: 'Snapshot',
      UpdateReplacePolicy: 'Snapshot',
    });

    Template.fromStack(stack).resourceCountIs('AWS::RDS::DBInstance', 2);

    expect(stack.resolve(cluster.clusterResourceIdentifier)).toEqual({ 'Fn::GetAtt': ['DatabaseB269D8BB', 'DBClusterResourceId'] });
    expect(cluster.instanceIdentifiers).toHaveLength(2);
    expect(stack.resolve(cluster.instanceIdentifiers[0])).toEqual({
      Ref: 'DatabaseInstance1844F58FD',
    });

    expect(cluster.instanceEndpoints).toHaveLength(2);
    expect(stack.resolve(cluster.instanceEndpoints[0])).toEqual({
      hostname: {
        'Fn::GetAtt': ['DatabaseInstance1844F58FD', 'Endpoint.Address'],
      },
      port: {
        'Fn::GetAtt': ['DatabaseB269D8BB', 'Endpoint.Port'],
      },
      socketAddress: {
        'Fn::Join': ['', [
          { 'Fn::GetAtt': ['DatabaseInstance1844F58FD', 'Endpoint.Address'] },
          ':',
          { 'Fn::GetAtt': ['DatabaseB269D8BB', 'Endpoint.Port'] },
        ]],
      },
    });

    Annotations.fromStack(stack).hasWarning('/Default/Database', Match.stringLikeRegexp('Generated credentials will not be applied to cluster'));
  });

  test('can generate a new snapshot password', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
      snapshotCredentials: SnapshotCredentials.fromGeneratedSecret('admin', {
        excludeCharacters: '"@/\\',
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      MasterUsername: Match.absent(),
      MasterUserPassword: {
        'Fn::Join': ['', [
          '{{resolve:secretsmanager:',
          { Ref: 'DatabaseSnapshotSecret2B5748BB8ee0a797cad8a68dbeb85f8698cdb5bb' },
          ':SecretString:password::}}',
        ]],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      Description: {
        'Fn::Join': ['', ['Generated by the CDK for stack: ', { Ref: 'AWS::StackName' }]],
      },
      GenerateSecretString: {
        ExcludeCharacters: '\"@/\\',
        GenerateStringKey: 'password',
        PasswordLength: 30,
        SecretStringTemplate: '{"username":"admin"}',
      },
    });
  });

  test('fromGeneratedSecret with replica regions', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
      snapshotCredentials: SnapshotCredentials.fromGeneratedSecret('admin', {
        replicaRegions: [{ region: 'eu-west-1' }],
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      ReplicaRegions: [
        {
          Region: 'eu-west-1',
        },
      ],
    });
  });

  test('throws if generating a new password without a username', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    expect(() => new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
      snapshotCredentials: { generatePassword: true },
    })).toThrow(/`snapshotCredentials` `username` must be specified when `generatePassword` is set to true/);
  });

  test('can set a new snapshot password from an existing Secret', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const secret = new DatabaseSecret(stack, 'DBSecret', {
      username: 'admin',
      encryptionKey: new kms.Key(stack, 'PasswordKey'),
    });
    new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
      snapshotCredentials: SnapshotCredentials.fromSecret(secret),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      MasterUsername: Match.absent(),
      MasterUserPassword: {
        'Fn::Join': ['', ['{{resolve:secretsmanager:', { Ref: 'DBSecretD58955BC' }, ':SecretString:password::}}']],
      },
    });
  });

  test('secret from deprecated credentials is created with feature flag unset', () => {
    // GIVEN
    const stack = testStack();
    stack.node.setContext(RDS_PREVENT_RENDERING_DEPRECATED_CREDENTIALS, false);

    const vpc = new ec2.Vpc(stack, 'VPC');

    const secret = new DatabaseSecret(stack, 'DBSecret', {
      username: 'admin',
      encryptionKey: new kms.Key(stack, 'PasswordKey'),
    });

    // WHEN
    new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      snapshotIdentifier: 'mySnapshot',
      snapshotCredentials: SnapshotCredentials.fromSecret(secret),
      writer: ClusterInstance.serverlessV2('writer'),
      vpc,
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::SecretsManager::Secret', 2);
  });

  test('secret from deprecated credentials is not created with feature flag set', () => {
    // GIVEN
    const stack = testStack();
    stack.node.setContext(RDS_PREVENT_RENDERING_DEPRECATED_CREDENTIALS, true);

    const vpc = new ec2.Vpc(stack, 'VPC');

    const secret = new DatabaseSecret(stack, 'DBSecret', {
      username: 'admin',
      encryptionKey: new kms.Key(stack, 'PasswordKey'),
    });

    // WHEN
    new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      snapshotIdentifier: 'mySnapshot',
      snapshotCredentials: SnapshotCredentials.fromSecret(secret),
      writer: ClusterInstance.serverlessV2('writer'),
      vpc,
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::SecretsManager::Secret', 1);
  });

  test('create a cluster from a snapshot with encrypted storage', () => {
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
      storageEncryptionKey: kms.Key.fromKeyArn(stack, 'Key', 'arn:aws:kms:us-east-1:456:key/my-key'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      KmsKeyId: 'arn:aws:kms:us-east-1:456:key/my-key',
      StorageEncrypted: true,
    });
  });

  test('create a cluster from a snapshot with single user secret rotation', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const cluster = new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
    });

    // WHEN
    cluster.addRotationSingleUser();

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      RotationRules: {
        ScheduleExpression: 'rate(30 days)',
      },
    });
  });

  test('throws when trying to add single user rotation multiple times on cluster from snapshot', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const cluster = new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
    });

    // WHEN
    cluster.addRotationSingleUser();

    // THEN
    expect(() => cluster.addRotationSingleUser()).toThrow(/A single user rotation was already added to this cluster/);
  });

  test('create a cluster from a snapshot with multi user secret rotation', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    const cluster = new DatabaseClusterFromSnapshot(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      instanceProps: {
        vpc,
      },
      snapshotIdentifier: 'mySnapshot',
    });

    // WHEN
    const userSecret = new DatabaseSecret(stack, 'UserSecret', { username: 'user' });
    cluster.addRotationMultiUser('user', { secret: userSecret.attach(cluster) });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'UserSecretAttachment16ACBE6D',
      },
      RotationLambdaARN: {
        'Fn::GetAtt': [
          'DatabaseuserECD1FB0C',
          'Outputs.RotationLambdaARN',
        ],
      },
      RotationRules: {
        ScheduleExpression: 'rate(30 days)',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
      Parameters: {
        masterSecretArn: {
          Ref: 'DatabaseSecretAttachmentE5D1B020',
        },
      },
    });
  });

  test('reuse an existing subnet group', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        vpc,
      },
      subnetGroup: SubnetGroup.fromSubnetGroupName(stack, 'SubnetGroup', 'my-subnet-group'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DBSubnetGroupName: 'my-subnet-group',
    });
    Template.fromStack(stack).resourceCountIs('AWS::RDS::DBSubnetGroup', 0);
  });

  test('defaultChild returns the DB Cluster', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      credentials: {
        username: 'admin',
      },
      instanceProps: {
        vpc,
      },
    });

    // THEN
    expect(cluster.node.defaultChild instanceof CfnDBCluster).toBeTruthy();
  });

  test('fromGeneratedSecret', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      credentials: Credentials.fromGeneratedSecret('admin'),
      instanceProps: {
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      MasterUsername: 'admin', // username is a string
      MasterUserPassword: {
        'Fn::Join': [
          '',
          [
            '{{resolve:secretsmanager:',
            {
              Ref: 'DatabaseSecretC9203AE33fdaad7efa858a3daf9490cf0a702aeb', // logical id is a hash
            },
            ':SecretString:password::}}',
          ],
        ],
      },
    });
  });

  test('fromGeneratedSecret with replica regions', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      credentials: Credentials.fromGeneratedSecret('admin', {
        replicaRegions: [{ region: 'eu-west-1' }],
      }),
      instanceProps: {
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      ReplicaRegions: [
        {
          Region: 'eu-west-1',
        },
      ],
    });
  });

  test('can set custom name to database secret by fromSecret', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const secretName = 'custom-secret-name';
    const secret = new DatabaseSecret(stack, 'Secret', {
      username: 'admin',
      secretName,
    } );

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      credentials: Credentials.fromSecret(secret),
      instanceProps: {
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      Name: secretName,
    });
  });

  test('can set custom name to database secret by fromGeneratedSecret', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const secretName = 'custom-secret-name';

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }),
      credentials: Credentials.fromGeneratedSecret('admin', { secretName }),
      instanceProps: {
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
      Name: secretName,
    });
  });

  test('can set public accessibility for database cluster with instances in private subnet', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        publiclyAccessible: true,
      },
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      Engine: 'aurora',
      PubliclyAccessible: true,
    });
  });

  test('can set public accessibility for database cluster with instances in public subnet', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
        publiclyAccessible: false,
      },
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      Engine: 'aurora',
      PubliclyAccessible: false,
    });
  });

  test('database cluster instances in public subnet should by default have publiclyAccessible set to true', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
      },
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      Engine: 'aurora',
      PubliclyAccessible: true,
    });
  });

  test('providing a writer to the cluster in a public subnet should by default have publiclyAccessible set to true', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      writer: ClusterInstance.serverlessV2('writer'),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      Engine: 'aurora',
      PubliclyAccessible: true,
    });
  });

  test('providing a writer to the cluster in a public subnet should use writer provided publiclyAccessible as true', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      writer: ClusterInstance.serverlessV2('writer', {
        publiclyAccessible: true,
      }),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      Engine: 'aurora',
      PubliclyAccessible: true,
    });
  });

  test('providing a writer to the cluster in a public subnet should use writer provided publiclyAccessible as false', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      writer: ClusterInstance.serverlessV2('writer', {
        publiclyAccessible: false,
      }),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      Engine: 'aurora',
      PubliclyAccessible: false,
    });
  });

  test('changes the case of the cluster identifier', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const clusterIdentifier = 'TestClusterIdentifier';
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: { vpc },
      clusterIdentifier,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DBClusterIdentifier: clusterIdentifier.toLowerCase(),
    });
  });

  test('does not changes the case of the cluster identifier if the lowercaseDbIdentifier feature flag is disabled', () => {
    // GIVEN
    const app = new cdk.App({ context: { '@aws-cdk/aws-rds:lowercaseDbIdentifier': false } });
    const stack = testStack(app);
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    const clusterIdentifier = 'TestClusterIdentifier';
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: { vpc },
      clusterIdentifier,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      DBClusterIdentifier: clusterIdentifier,
    });
  });

  test('cluster with copyTagsToSnapshot default', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      CopyTagsToSnapshot: true,
    });
  });

  test('cluster with copyTagsToSnapshot disabled', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        vpc,
      },
      copyTagsToSnapshot: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      CopyTagsToSnapshot: false,
    });
  });

  test('cluster with copyTagsToSnapshot enabled', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      copyTagsToSnapshot: true,
      instanceProps: {
        vpc,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      CopyTagsToSnapshot: true,
    });
  });

  test('cluster has BacktrackWindow in seconds', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.AURORA,
      instanceProps: {
        vpc,
      },
      backtrackWindow: cdk.Duration.days(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBCluster', {
      BacktrackWindow: 24 * 60 * 60,
    });
  });

  test('DB instances should not have engine version set when part of a cluster', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_14_3 }),
      instanceProps: { vpc },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::RDS::DBInstance', {
      EngineVersion: Match.absent(),
    });
  });

  test('grantConnect', () => {
    // GIVEN
    const stack = testStack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const role = new Role(stack, 'Role', {
      assumedBy: new ServicePrincipal('service.amazonaws.com'),
    });

    // WHEN
    const cluster = new DatabaseCluster(stack, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_14_3 }),
      instanceProps: { vpc },
    });
    cluster.grantConnect(role, 'someUser');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      Roles: [{ Ref: 'Role1ABCC5F0' }],
      PolicyDocument: {
        Statement: [{
          Action: 'rds-db:connect',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':rds-db:us-test-1:12345:dbuser:',
                {
                  'Fn::GetAtt': [
                    'DatabaseB269D8BB',
                    'DBClusterResourceId',
                  ],
                },
                '/someUser',
              ],
            ],
          },
        }],
      },
    });
  });
});

test.each([
  [cdk.RemovalPolicy.RETAIN, 'Retain', 'Retain', 'Retain'],
  [cdk.RemovalPolicy.SNAPSHOT, 'Snapshot', 'Delete', Match.absent()],
  [cdk.RemovalPolicy.DESTROY, 'Delete', 'Delete', Match.absent()],
])('if Cluster RemovalPolicy is \'%s\', the DBCluster has DeletionPolicy \'%s\', the DBInstance has \'%s\' and the DBSubnetGroup has \'%s\'', (clusterRemovalPolicy, clusterValue, instanceValue, subnetValue) => {
  const stack = new cdk.Stack();

  // WHEN
  new DatabaseCluster(stack, 'Cluster', {
    credentials: { username: 'admin' },
    engine: DatabaseClusterEngine.AURORA,
    instanceProps: {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
      vpc: new ec2.Vpc(stack, 'Vpc'),
    },
    removalPolicy: clusterRemovalPolicy,
  });

  // THEN
  Template.fromStack(stack).hasResource('AWS::RDS::DBCluster', {
    DeletionPolicy: clusterValue,
    UpdateReplacePolicy: clusterValue,
  });

  Template.fromStack(stack).hasResource('AWS::RDS::DBInstance', {
    DeletionPolicy: instanceValue,
    UpdateReplacePolicy: instanceValue,
  });

  Template.fromStack(stack).hasResource('AWS::RDS::DBSubnetGroup', {
    DeletionPolicy: subnetValue,
  });
});

test.each([
  [cdk.RemovalPolicy.RETAIN, 'Retain', 'Retain', 'Retain'],
  [cdk.RemovalPolicy.SNAPSHOT, 'Snapshot', 'Delete', Match.absent()],
  [cdk.RemovalPolicy.DESTROY, 'Delete', 'Delete', Match.absent()],
])('if Cluster RemovalPolicy is \'%s\', the DBCluster has DeletionPolicy \'%s\', the DBInstance has \'%s\' and the DBSubnetGroup has \'%s\'', (clusterRemovalPolicy, clusterValue, instanceValue, subnetValue) => {
  const stack = new cdk.Stack();

  // WHEN
  new DatabaseCluster(stack, 'Cluster', {
    credentials: { username: 'admin' },
    engine: DatabaseClusterEngine.AURORA,
    instanceProps: {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
      vpc: new ec2.Vpc(stack, 'Vpc'),
    },
    removalPolicy: clusterRemovalPolicy,
  });

  // THEN
  Template.fromStack(stack).hasResource('AWS::RDS::DBCluster', {
    DeletionPolicy: clusterValue,
    UpdateReplacePolicy: clusterValue,
  });

  Template.fromStack(stack).hasResource('AWS::RDS::DBInstance', {
    DeletionPolicy: instanceValue,
    UpdateReplacePolicy: instanceValue,
  });

  Template.fromStack(stack).hasResource('AWS::RDS::DBSubnetGroup', {
    DeletionPolicy: subnetValue,
    UpdateReplacePolicy: subnetValue,
  });
});

function testStack(app?: cdk.App, stackId?: string) {
  const stack = new cdk.Stack(app, stackId, { env: { account: '12345', region: 'us-test-1' } });
  stack.node.setContext('availability-zones:12345:us-test-1', ['us-test-1a', 'us-test-1b']);
  return stack;
}
