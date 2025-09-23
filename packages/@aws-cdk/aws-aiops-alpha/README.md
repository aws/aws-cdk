# Amazon AIOps Construct Library

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

| **Language**                                                                                   | **Package**                             |
| :--------------------------------------------------------------------------------------------- | --------------------------------------- |
| ![Typescript Logo](https://docs.aws.amazon.com/cdk/api/latest/img/typescript32.png) TypeScript | `@aws-cdk/aws-aiops-alpha` |

[Amazon AIOps](https://aws.amazon.com/aiops/) provides AI-powered operations capabilities that help you proactively identify, investigate, and resolve operational issues in your AWS infrastructure. AIOps uses machine learning to analyze your operational data and provide intelligent insights to improve system reliability and performance.

This construct library facilitates the deployment of AIOps resources, enabling you to create sophisticated AI-powered operational monitoring and investigation capabilities for your AWS applications.

## Table of contents

- [Investigation Groups](#investigation-groups)
  - [Create an Investigation Group](#create-an-investigation-group)
  - [Investigation Group Properties](#investigation-group-properties)
  - [IAM Permissions](#iam-permissions)
  - [Custom IAM Role](#custom-iam-role)
  - [Granting Permissions](#granting-permissions)
  - [Importing Investigation Groups](#importing-investigation-groups)

## Investigation Groups

Amazon AIOps Investigation Groups provide a way to organize and manage operational investigations. Investigation Groups help you correlate related operational events, metrics, and logs to identify root causes of issues more effectively.

### Create an Investigation Group

Creating an Investigation Group is straightforward. The following example creates an Investigation Group with default settings:

```ts fixture=default
const investigationGroup = new InvestigationGroup(this, 'MyInvestigationGroup', {
  name: 'my-investigation-group'
});
```

You can also create an Investigation Group with custom properties:

```ts fixture=default
const group = new InvestigationGroup(this, 'MyInvestigationGroup', {
   name: string,
   role?: IRole,
   encryptionKey?: IKey,
   chatbotNotificationChannels?: [
      snsTopic
   ],
   crossAccountConfigurations?: [
      sourceAccountRole
   ],
   isCloudTrailEventHistoryEnabled?: boolean,
   retentionInDays?: Duration,
   removalPolicy?: RemovalPolicy.DESTROY,
   tagKeyBoundaries?: string[]
});
```

### Investigation Group Properties

The Investigation Group class supports the following properties:

| Name | Type       | Optional | Documentation |
|------|------------|----------|---------------|
| `name` | `string`   | No | Provides a name for the investigation group. |
| `role` | `IRole`    | Yes | Specify the ARN of the IAM role that CloudWatch investigations will use when it gathers investigation data. The permissions in this role determine which of your resources CloudWatch investigations will have access to during investigations. If not specified, CloudWatch investigations will create a role with the name `AIOpsRole-DefaultInvestigationGroup-{randomSixCharacterSuffix}` containing default permissions. |
| `retentionInDays` | `number`   | Yes | Retention period for all resources created under the investigation group container. Min: 7 days, Max: 90 days. If not specified, it will be 90 days by default. |
| `encryptionKey` | `IKey`     | Yes | This is a customer-managed KMS key to encrypt customer data during analysis. If not specified, AIOps will use an AWS-managed key to encrypt. |
| `chatbotNotificationChannels` | `Arn[]`    | Yes | Array of Chatbot notification channel ARNs. AIOps will send investigation group-related resource updates to those channels. |
| `tagKeyBoundaries` | `string[]` | Yes | Enter the existing custom tag keys for custom applications in your system. Resource tags help CloudWatch investigations narrow the search space when it is unable to discover definite relationships between resources. For example, to discover that an Amazon ECS service depends on an Amazon RDS database, CloudWatch investigations can discover this relationship using data sources such as X-Ray and CloudWatch Application Signals. However, if you haven't deployed these features, CloudWatch investigations will attempt to identify possible relationships. Tag boundaries can be used to narrow the resources that will be discovered by CloudWatch investigations in these cases. [More info](https://docs.aws.amazon.com/cloudwatchinvestigations/latest/APIReference/API_CreateInvestigationGroup.html). |
| `isCloudTrailEventHistoryEnabled` | `boolean`  | Yes | Flag to enable CloudTrail event history. If not specified, its default is false. |
| `crossAccountConfigurations` | `Arn[]`    | Yes | List of source account role ARN values that have been configured for cross-account access. |

### IAM Permissions

When you create an Investigation Group, it requires an IAM role with appropriate permissions to access AWS services for operational monitoring and investigation. If you don't specify a custom role, the construct will create a default role with the following permissions:

- **CloudWatch**: Read access to metrics, logs, and alarms
- **CloudWatch Logs**: Access to log groups and log streams for investigation
- **X-Ray**: Access to trace data for distributed system analysis

The default role includes these managed policies:

- AIOpsAssistantPolicy

### Custom IAM Role

You can provide your own IAM role if you need custom permissions or want to follow your organization's IAM policies:

```ts fixture=default
import * as iam from 'aws-cdk-lib/aws-iam';

// Create a custom role with specific permissions
const customRole = new iam.Role(this, 'CustomAIOpsRole', {
  assumedBy: new iam.ServicePrincipal('aiops.amazonaws.com'),
  description: 'Custom role for AIOps Investigation Group',
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchReadOnlyAccess'),
    iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsReadOnlyAccess'),
    iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXRayReadOnlyAccess'),
  ],
  inlinePolicies: {
    CustomAIOpsPolicy: new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'ec2:DescribeInstances',
            'ec2:DescribeSecurityGroups',
            'rds:DescribeDBInstances',
          ],
          resources: ['*'],
        }),
      ],
    }),
  },
});

const investigationGroup = new InvestigationGroup(this, 'MyInvestigationGroup', {
  name: 'my-investigation-group',
  role: customRole.roleArn,
});
```

### Granting Permissions

The Investigation Group construct provides methods to grant permissions to other AWS resources:

#### Grant Use Permissions

Grant permissions to use the investigation group for operational investigations:

```ts fixture=default
// Grant the Lambda function permission to use the investigation group
investigationGroup.grantCreate(new ServicePrincipal("<servicePrincipal>"));
```

### Importing Investigation Groups

You can import existing Investigation Groups using the `fromInvestigationGroupAttributes` method:

```ts fixture=default
// Import an existing investigation group by ARN
const importedInvestigationGroup = InvestigationGroup.fromInvestigationGroupAttributes(this, 'ImportedGroup', {
  investigationGroupArn: 'arn:aws:aiops:us-east-1:123456789012:investigation-group/my-existing-group',
  investigationGroupName: 'my-existing-group',
});

// Use the imported investigation group
console.log('Imported Investigation Group ARN:', importedInvestigationGroup.investigationGroupArn);
```

## Best Practices

### Naming Conventions

Use descriptive names for your Investigation Groups that reflect their purpose:

```ts fixture=default
// Good: Descriptive names
const webAppGroup = new InvestigationGroup(this, 'WebAppInvestigationGroup', {
  name: 'webapp-performance-investigations',
});

const databaseGroup = new InvestigationGroup(this, 'DatabaseInvestigationGroup', {
  name: 'database-reliability-investigations',
});
```

### Security Considerations

Follow the principle of least privilege when configuring IAM roles:

```ts fixture=default
import * as iam from 'aws-cdk-lib/aws-iam';

// Create a role with minimal required permissions
const restrictedRole = new iam.Role(this, 'RestrictedAIOpsRole', {
  assumedBy: new iam.ServicePrincipal('aiops.amazonaws.com'),
  description: 'Restricted role for AIOps Investigation Group',
  inlinePolicies: {
    MinimalAIOpsPolicy: new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'cloudwatch:GetMetricStatistics',
            'cloudwatch:ListMetrics',
            'logs:DescribeLogGroups',
            'logs:DescribeLogStreams',
            'logs:GetLogEvents',
          ],
          resources: [
            'arn:aws:cloudwatch:*:*:metric/*',
            'arn:aws:logs:*:*:log-group:/aws/lambda/*',
          ],
        }),
      ],
    }),
  },
});

const investigationGroup = new InvestigationGroup(this, 'SecureInvestigationGroup', {
  name: 'secure-investigation-group',
  role: restrictedRole.roleArn,
});
```

## Integration Examples

### Integration with CloudWatch Alarms

```ts fixture=default
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';

const investigationGroup = new InvestigationGroup(this, 'MyInvestigationGroup', {
  name: 'alarm-investigation-group',
});

// Create a CloudWatch alarm that could trigger investigations
const alarm = new cloudwatch.Alarm(this, 'HighErrorRateAlarm', {
  metric: new cloudwatch.Metric({
    namespace: 'AWS/Lambda',
    metricName: 'Errors',
    dimensionsMap: {
      FunctionName: 'my-function',
    },
    statistic: 'Sum',
  }),
  threshold: 10,
  evaluationPeriods: 2,
  alarmDescription: 'High error rate detected - investigate with AIOps',
});


alarm.addAlarmAction({
  bind(): AlarmActionConfig {
    return { alarmActionArn: investigationGroup.investigationGroupArn };
  },
});
```

This construct library provides a foundation for building AI-powered operational monitoring and investigation capabilities in your AWS infrastructure. As the AIOps service evolves, additional constructs and features will be added to support more comprehensive operational intelligence scenarios.
