import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import type * as logs from 'aws-cdk-lib/aws-logs';
import type { Construct } from 'constructs';
import type { ImageProps } from '../image';
import type { ImagePipelineProps } from '../image-pipeline';
import type { WorkflowConfiguration } from '../workflow';

/**
 * Returns the default execution role policy, for auto-generated execution roles.
 *
 * @param scope The construct scope
 * @param props Props input for the construct
 *
 * @see https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSServiceRoleForImageBuilder.html
 */
export const defaultExecutionRolePolicy = <PropsT extends ImagePipelineProps | ImageProps>(
  scope: Construct,
  props?: PropsT,
): iam.PolicyStatement[] => {
  const stack = cdk.Stack.of(scope);
  const partition = stack.partition;
  const region = stack.region;
  const account = stack.account;

  // Permissions are identical to https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSServiceRoleForImageBuilder.html
  // SLR policies cannot be attached to roles, and no managed policy exists for these permissions yet
  const policies = [
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ec2:RegisterImage'],
      resources: [`arn:${partition}:ec2:*::image/*`],
      conditions: {
        StringEquals: {
          'aws:RequestTag/CreatedBy': 'EC2 Image Builder',
        },
      },
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ec2:RegisterImage'],
      resources: [`arn:${partition}:ec2:*::snapshot/*`],
      conditions: {
        StringEquals: {
          'ec2:ResourceTag/CreatedBy': 'EC2 Image Builder',
        },
      },
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ec2:RunInstances'],
      resources: [
        `arn:${partition}:ec2:*::image/*`,
        `arn:${partition}:ec2:*::snapshot/*`,
        `arn:${partition}:ec2:*:*:subnet/*`,
        `arn:${partition}:ec2:*:*:network-interface/*`,
        `arn:${partition}:ec2:*:*:security-group/*`,
        `arn:${partition}:ec2:*:*:key-pair/*`,
        `arn:${partition}:ec2:*:*:launch-template/*`,
        `arn:${partition}:license-manager:*:*:license-configuration:*`,
      ],
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ec2:RunInstances'],
      resources: [`arn:${partition}:ec2:*:*:volume/*`, `arn:${partition}:ec2:*:*:instance/*`],
      conditions: {
        StringEquals: {
          'aws:RequestTag/CreatedBy': ['EC2 Image Builder', 'EC2 Fast Launch'],
        },
      },
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['iam:PassRole'],
      resources: ['*'],
      conditions: {
        StringEquals: {
          'iam:PassedToService': ['ec2.amazonaws.com', 'ec2.amazonaws.com.cn', 'vmie.amazonaws.com'],
        },
      },
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ec2:StopInstances', 'ec2:StartInstances', 'ec2:TerminateInstances'],
      resources: ['*'],
      conditions: {
        StringEquals: {
          'ec2:ResourceTag/CreatedBy': 'EC2 Image Builder',
        },
      },
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'ec2:CopyImage',
        'ec2:CreateImage',
        'ec2:CreateLaunchTemplate',
        'ec2:DeregisterImage',
        'ec2:DescribeImages',
        'ec2:DescribeInstanceAttribute',
        'ec2:DescribeInstanceStatus',
        'ec2:DescribeInstances',
        'ec2:DescribeInstanceTypeOfferings',
        'ec2:DescribeInstanceTypes',
        'ec2:DescribeSubnets',
        'ec2:DescribeTags',
        'ec2:ModifyImageAttribute',
        'ec2:DescribeImportImageTasks',
        'ec2:DescribeSnapshots',
        'ec2:DescribeHosts',
      ],
      resources: ['*'],
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ec2:ModifySnapshotAttribute'],
      resources: [`arn:${partition}:ec2:*::snapshot/*`],
      conditions: {
        StringEquals: {
          'ec2:ResourceTag/CreatedBy': 'EC2 Image Builder',
        },
      },
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ec2:CreateTags'],
      resources: ['*'],
      conditions: {
        StringEquals: {
          'ec2:CreateAction': ['RunInstances', 'CreateImage'],
          'aws:RequestTag/CreatedBy': ['EC2 Image Builder', 'EC2 Fast Launch'],
        },
      },
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ec2:CreateTags'],
      resources: [`arn:${partition}:ec2:*::image/*`, `arn:${partition}:ec2:*:*:export-image-task/*`],
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ec2:CreateTags'],
      resources: [`arn:${partition}:ec2:*::snapshot/*`, `arn:${partition}:ec2:*:*:launch-template/*`],
      conditions: {
        StringEquals: {
          'aws:RequestTag/CreatedBy': ['EC2 Image Builder', 'EC2 Fast Launch'],
        },
      },
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sns:Publish'],
      resources: [`arn:${partition}:sns:${region}:${account}:*`],
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'ssm:ListCommands',
        'ssm:ListCommandInvocations',
        'ssm:AddTagsToResource',
        'ssm:DescribeInstanceInformation',
        'ssm:ListInventoryEntries',
        'ssm:DescribeInstanceAssociationsStatus',
        'ssm:DescribeAssociationExecutions',
        'ssm:GetCommandInvocation',
      ],
      resources: ['*'],
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ssm:SendCommand'],
      resources: [
        `arn:${partition}:ssm:*:*:document/AWS-RunPowerShellScript`,
        `arn:${partition}:ssm:*:*:document/AWS-RunShellScript`,
        `arn:${partition}:ssm:*:*:document/AWSEC2-RunSysprep`,
        `arn:${partition}:s3:::*`,
      ],
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ssm:SendCommand'],
      resources: [`arn:${partition}:ec2:*:*:instance/*`],
      conditions: {
        StringEquals: {
          'ssm:resourceTag/CreatedBy': ['EC2 Image Builder'],
        },
      },
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ssm:CreateAssociation', 'ssm:DeleteAssociation'],
      resources: [
        `arn:${partition}:ssm:*:*:document/AWS-GatherSoftwareInventory`,
        `arn:${partition}:ssm:*:*:association/*`,
        `arn:${partition}:ec2:*:*:instance/*`,
      ],
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'kms:Encrypt',
        'kms:Decrypt',
        'kms:ReEncryptFrom',
        'kms:ReEncryptTo',
        'kms:GenerateDataKeyWithoutPlaintext',
      ],
      resources: ['*'],
      conditions: {
        'ForAllValues:StringEquals': {
          'kms:EncryptionContextKeys': ['aws:ebs:id'],
        },
        'StringLike': {
          'kms:ViaService': ['ec2.*.amazonaws.com'],
        },
      },
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['kms:DescribeKey'],
      resources: ['*'],
      conditions: {
        StringLike: {
          'kms:ViaService': ['ec2.*.amazonaws.com'],
        },
      },
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['kms:CreateGrant'],
      resources: ['*'],
      conditions: {
        Bool: {
          'kms:GrantIsForAWSResource': true,
        },
        StringLike: {
          'kms:ViaService': ['ec2.*.amazonaws.com'],
        },
      },
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['logs:CreateLogStream', 'logs:CreateLogGroup', 'logs:PutLogEvents'],
      resources: [`arn:${partition}:logs:*:*:log-group:/aws/imagebuilder/*`],
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['iam:CreateServiceLinkedRole'],
      resources: ['*'],
      conditions: {
        StringEquals: {
          'iam:AWSServiceName': ['ssm.amazonaws.com'],
        },
      },
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'events:DeleteRule',
        'events:DescribeRule',
        'events:PutRule',
        'events:PutTargets',
        'events:RemoveTargets',
      ],
      resources: [`arn:${partition}:events:*:*:rule/ImageBuilder-*`],
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ssm:GetParameter', 'ssm:PutParameter'],
      resources: [`arn:${partition}:ssm:*:*:parameter/imagebuilder/*`],
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ssm:GetParameter'],
      resources: [`arn:${partition}:ssm:*::parameter/aws/service/*`],
    }),
  ];

  const hasProps = props !== undefined;
  if (!hasProps || (props.recipe._isImageRecipe() && props.distributionConfiguration !== undefined)) {
    // Distribution-specific permissions if distribution settings are provided. All permissions here are for AMI builds
    // specifically.
    policies.push(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ec2:DescribeExportImageTasks'],
        resources: ['*'],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['license-manager:UpdateLicenseSpecificationsForResource'],
        resources: [`arn:${partition}:license-manager:*:${account}:license-configuration:*`],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sts:AssumeRole'],
        resources: [`arn:${partition}:iam::*:role/EC2ImageBuilderDistributionCrossAccountRole`],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ec2:DescribeLaunchTemplates', 'ec2:DescribeLaunchTemplateVersions'],
        resources: ['*'],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ec2:CreateLaunchTemplateVersion', 'ec2:ModifyLaunchTemplate'],
        resources: [`arn:${partition}:ec2:${region}:${account}:launch-template/*`],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ec2:ExportImage'],
        resources: [`arn:${partition}:ec2:*::image/*`],
        conditions: {
          StringEquals: {
            'ec2:ResourceTag/CreatedBy': 'EC2 Image Builder',
          },
        },
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ec2:ExportImage'],
        resources: [`arn:${partition}:ec2:*:*:export-image-task/*`],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ec2:CancelExportTask'],
        resources: [`arn:${partition}:ec2:*:*:export-image-task/*`],
        conditions: {
          StringEquals: {
            'ec2:ResourceTag/CreatedBy': 'EC2 Image Builder',
          },
        },
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['iam:CreateServiceLinkedRole'],
        resources: ['*'],
        conditions: {
          StringEquals: {
            'iam:AWSServiceName': ['ec2fastlaunch.amazonaws.com'],
          },
        },
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ec2:EnableFastLaunch'],
        resources: [`arn:${partition}:ec2:*::image/*`, `arn:${partition}:ec2:*:*:launch-template/*`],
        conditions: {
          StringEquals: {
            'ec2:ResourceTag/CreatedBy': 'EC2 Image Builder',
          },
        },
      }),
    );
  }

  if (!hasProps || props.imageScanningEnabled !== false) {
    // Add Inspector permissions if scanning is enabled
    policies.push(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['inspector2:ListCoverage', 'inspector2:ListFindings'],
        resources: ['*'],
      }),
    );

    // Add image scanning ECR permissions for container builds
    if (!hasProps || props.recipe._isContainerRecipe()) {
      policies.push(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['ecr:CreateRepository'],
          resources: ['*'],
          conditions: {
            StringEquals: {
              'aws:RequestTag/CreatedBy': 'EC2 Image Builder',
            },
          },
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['ecr:TagResource'],
          resources: [`arn:${partition}:ecr:*:*:repository/image-builder-*`],
          conditions: {
            StringEquals: {
              'aws:RequestTag/CreatedBy': 'EC2 Image Builder',
            },
          },
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['ecr:BatchDeleteImage'],
          resources: [`arn:${partition}:ecr:*:*:repository/image-builder-*`],
          conditions: {
            StringEquals: {
              'ecr:ResourceTag/CreatedBy': 'EC2 Image Builder',
            },
          },
        }),
      );
    }
  }

  return policies;
};

export const getExecutionRole = (
  scope: Construct,
  grantDefaultExecutionRolePermissions: (grantee: iam.IGrantable) => void,
  {
    executionRole,
    workflows,
    imageLogGroup,
    imagePipelineLogGroup,
  }: {
    executionRole?: iam.IRole;
    imageLogGroup?: logs.ILogGroup;
    imagePipelineLogGroup?: logs.ILogGroup;
    workflows?: WorkflowConfiguration[];
  },
): iam.IRole | undefined => {
  const { executionRoleRequired, applyGrants } = getExecutionRoleRequirements({
    workflows,
    imageLogGroup,
    imagePipelineLogGroup,
  });
  if (!executionRoleRequired) {
    return executionRole;
  }

  if (executionRole !== undefined) {
    applyGrants(executionRole);
    return executionRole;
  }

  const autoGeneratedExecutionRole = new iam.Role(scope, 'ExecutionRole', {
    assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
  });
  grantDefaultExecutionRolePermissions(autoGeneratedExecutionRole);
  applyGrants(autoGeneratedExecutionRole);

  return autoGeneratedExecutionRole;
};

const getExecutionRoleRequirements = ({
  workflows,
  imageLogGroup,
  imagePipelineLogGroup,
}: {
  imageLogGroup?: logs.ILogGroup;
  imagePipelineLogGroup?: logs.ILogGroup;
  workflows?: WorkflowConfiguration[];
}): { executionRoleRequired: boolean; applyGrants: (role: iam.IRole) => void } => {
  const granters: Array<(role: iam.IRole) => void> = [];

  const hasWorkflows = Boolean(workflows?.length);
  const addImageLogGroupPermissions =
    imageLogGroup !== undefined &&
    !cdk.Token.isUnresolved(imageLogGroup.logGroupName) &&
    !imageLogGroup.logGroupName.startsWith('/aws/imagebuilder/');
  const addPipelineLogGroupPermissions =
    imagePipelineLogGroup !== undefined &&
    !cdk.Token.isUnresolved(imagePipelineLogGroup.logGroupName) &&
    !imagePipelineLogGroup.logGroupName.startsWith('/aws/imagebuilder/');

  if (addImageLogGroupPermissions) {
    granters.push((role) => imageLogGroup!.grantWrite(role));
  }

  if (addPipelineLogGroupPermissions) {
    granters.push((role) => imagePipelineLogGroup!.grantWrite(role));
  }

  return {
    executionRoleRequired: hasWorkflows || addImageLogGroupPermissions || addPipelineLogGroupPermissions,
    applyGrants: (role: iam.IRole) => granters.forEach((granter) => granter(role)),
  };
};
