const path = require('path');

var constructs = require('constructs');
if (process.env.PACKAGE_LAYOUT_VERSION === '1') {
  var cdk = require('@aws-cdk/core');
  var ec2 = require('@aws-cdk/aws-ec2');
  var ecs = require('@aws-cdk/aws-ecs');
  var s3 = require('@aws-cdk/aws-s3');
  var ssm = require('@aws-cdk/aws-ssm');
  var iam = require('@aws-cdk/aws-iam');
  var sns = require('@aws-cdk/aws-sns');
  var sqs = require('@aws-cdk/aws-sqs');
  var lambda = require('@aws-cdk/aws-lambda');
  var sso = require('@aws-cdk/aws-sso');
  var docker = require('@aws-cdk/aws-ecr-assets');
  var appsync = require('@aws-cdk/aws-appsync');
} else {
  var cdk = require('aws-cdk-lib');
  var {
    DefaultStackSynthesizer,
    LegacyStackSynthesizer,
    aws_ec2: ec2,
    aws_ecs: ecs,
    aws_sso: sso,
    aws_s3: s3,
    aws_ssm: ssm,
    aws_iam: iam,
    aws_sns: sns,
    aws_sqs: sqs,
    aws_lambda: lambda,
    aws_ecr_assets: docker,
    aws_appsync: appsync,
    Stack
  } = require('aws-cdk-lib');
}

const { Annotations } = cdk;
const { StackWithNestedStack, StackWithDoublyNestedStack, StackWithNestedStackUsingParameters } = require('./nested-stack');

const stackPrefix = process.env.STACK_NAME_PREFIX;
if (!stackPrefix) {
  throw new Error(`the STACK_NAME_PREFIX environment variable is required`);
}

class MyStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    new sns.Topic(this, 'topic');

    if (cdk.AvailabilityZoneProvider) { // <= 0.34.0
      new cdk.AvailabilityZoneProvider(this).availabilityZones;
    } else if (cdk.Context) { // <= 0.35.0
      cdk.Context.getAvailabilityZones(this);
    } else {
      this.availabilityZones;
    }

    const parameterName = '/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2';
    getSsmParameterValue(this, parameterName);
  }
}

function getSsmParameterValue(scope, parameterName) {
  return ssm.StringParameter.valueFromLookup(scope, parameterName);
}

class YourStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    new sns.Topic(this, 'topic1');
    new sns.Topic(this, 'topic2');
  }
}

class NoticesStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    new sqs.Queue(this, 'queue');
  }
}

class SsoPermissionSetNoPolicy extends Stack {
  constructor(scope, id) {
    super(scope, id);

    new sso.CfnPermissionSet(this, "permission-set-without-managed-policy", {
      instanceArn: 'arn:aws:sso:::instance/testvalue',
      name: 'testName',
      permissionsBoundary: { customerManagedPolicyReference: { name: 'why', path: '/how/' }},
     })
  }
}

class SsoPermissionSetManagedPolicy extends Stack {
  constructor(scope, id) {
    super(scope, id);
    new sso.CfnPermissionSet(this, "permission-set-with-managed-policy", {
      managedPolicies: ['arn:aws:iam::aws:policy/administratoraccess'],
      customerManagedPolicyReferences: [{ name: 'forSSO' }],
      permissionsBoundary: { managedPolicyArn: 'arn:aws:iam::aws:policy/AdministratorAccess' },
      instanceArn: 'arn:aws:sso:::instance/testvalue',
      name: 'niceWork',
     })
  }
}

class SsoAssignment extends Stack {
  constructor(scope, id) {
    super(scope, id);
     new sso.CfnAssignment(this, "assignment", {
       instanceArn: 'arn:aws:sso:::instance/testvalue',
       permissionSetArn: 'arn:aws:sso:::testvalue',
       principalId: '11111111-2222-3333-4444-test',
       principalType: 'USER',
       targetId: '111111111111',
       targetType: 'AWS_ACCOUNT'
     });
  }
}

class SsoInstanceAccessControlConfig extends Stack {
  constructor(scope, id) {
    super(scope, id);
     new sso.CfnInstanceAccessControlAttributeConfiguration(this, 'instanceAccessControlConfig', {
       instanceArn: 'arn:aws:sso:::instance/testvalue',
       accessControlAttributes: [
         { key: 'first', value: { source: ['a'] } },
         { key: 'second', value: { source: ['b'] } },
         { key: 'third', value: { source: ['c'] } },
         { key: 'fourth', value: { source: ['d'] } },
         { key: 'fifth', value: { source: ['e'] } },
         { key: 'sixth', value: { source: ['f'] } },
       ]
     })
  }
}

class ListMultipleDependentStack extends Stack {
  constructor(scope, id) {
    super(scope, id);

    const dependentStack1 = new DependentStack1(this, 'DependentStack1');
    const dependentStack2 = new DependentStack2(this, 'DependentStack2');

    this.addDependency(dependentStack1);
    this.addDependency(dependentStack2);
  }
}

class DependentStack1 extends Stack {
  constructor(scope, id) {
    super(scope, id);

  }
}

class DependentStack2 extends Stack {
  constructor(scope, id) {
    super(scope, id);

  }
}

class ListStack extends Stack {
  constructor(scope, id) {
    super(scope, id);

    const dependentStack = new DependentStack(this, 'DependentStack');

    this.addDependency(dependentStack);
  }
}

class DependentStack extends Stack {
  constructor(scope, id) {
    super(scope, id);

    const innerDependentStack = new InnerDependentStack(this, 'InnerDependentStack');

    this.addDependency(innerDependentStack);
  }
}

class InnerDependentStack extends Stack {
  constructor(scope, id) {
    super(scope, id);

  }
}

class MigrateStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    if (!process.env.OMIT_TOPIC) {
      const queue = new sqs.Queue(this, 'Queue', {
        removalPolicy: process.env.ORPHAN_TOPIC ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      });

      new cdk.CfnOutput(this, 'QueueName', {
        value: queue.queueName,
      });

      new cdk.CfnOutput(this, 'QueueUrl', {
        value: queue.queueUrl,
      });

      new cdk.CfnOutput(this, 'QueueLogicalId', {
        value: queue.node.defaultChild.logicalId,
      });
    }
    if (process.env.SAMPLE_RESOURCES) {
      const myTopic = new sns.Topic(this, 'migratetopic1', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
      cdk.Tags.of(myTopic).add('tag1', 'value1');
      const myTopic2 = new sns.Topic(this, 'migratetopic2', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
      cdk.Tags.of(myTopic2).add('tag2', 'value2');
      const myQueue = new sqs.Queue(this, 'migratequeue1', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
      cdk.Tags.of(myQueue).add('tag3', 'value3');
    }
    if (process.env.LAMBDA_RESOURCES) {
      const myFunction = new lambda.Function(this, 'migratefunction1', {
        code: lambda.Code.fromInline('console.log("hello world")'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
      });
      cdk.Tags.of(myFunction).add('lambda-tag', 'lambda-value');

      const myFunction2 = new lambda.Function(this, 'migratefunction2', {
        code: lambda.Code.fromInline('console.log("hello world2")'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
      });
      cdk.Tags.of(myFunction2).add('lambda-tag', 'lambda-value');
    }
  }
}

class ImportableStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    new cdk.CfnWaitConditionHandle(this, 'Handle');

    if (process.env.INCLUDE_SINGLE_QUEUE === '1') {
      const queue = new sqs.Queue(this, 'Queue', {
        removalPolicy: (process.env.RETAIN_SINGLE_QUEUE === '1') ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      });

      new cdk.CfnOutput(this, 'QueueName', {
        value: queue.queueName,
      });

      new cdk.CfnOutput(this, 'QueueUrl', {
        value: queue.queueUrl,
      });

      new cdk.CfnOutput(this, 'QueueLogicalId', {
        value: queue.node.defaultChild.logicalId,
      });
    }

    if (process.env.LARGE_TEMPLATE === '1') {
      for (let i = 1; i <= 70; i++) {
        new sqs.Queue(this, `cdk-import-queue-test${i}`, {
          enforceSSL: true,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
      }
    }
  }
}

class StackUsingContext extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    new cdk.CfnResource(this, 'Handle', {
      type: 'AWS::CloudFormation::WaitConditionHandle'
    });

    new cdk.CfnOutput(this, 'Output', {
      value: this.availabilityZones[0],
    });
  }
}

class ParameterStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    new sns.Topic(this, 'TopicParameter', {
      topicName: new cdk.CfnParameter(this, 'TopicNameParam').valueAsString
    });
  }
}

class OtherParameterStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    new sns.Topic(this, 'TopicParameter', {
      topicName: new cdk.CfnParameter(this, 'OtherTopicNameParam').valueAsString
    });
  }
}

class MultiParameterStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    new sns.Topic(this, 'TopicParameter', {
      displayName: new cdk.CfnParameter(this, 'DisplayNameParam').valueAsString
    });
    new sns.Topic(this, 'OtherTopicParameter', {
      displayName: new cdk.CfnParameter(this, 'OtherDisplayNameParam').valueAsString
    });
  }
}

class OutputsStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const topic = new sns.Topic(this, 'MyOutput', {
      topicName: `${cdk.Stack.of(this).stackName}MyTopic`
    });

    new cdk.CfnOutput(this, 'TopicName', {
      value: topic.topicName
    })
  }
}

class AnotherOutputsStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const topic = new sns.Topic(this, 'MyOtherOutput', {
      topicName: `${cdk.Stack.of(this).stackName}MyOtherTopic`
    });

    new cdk.CfnOutput(this, 'TopicName', {
      value: topic.topicName
    });
  }
}

class IamStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    new iam.Role(this, 'SomeRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    });
  }
}

class ProvidingStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    this.topic = new sns.Topic(this, 'BogusTopic'); // Some filler
  }
}

class StackWithError extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    this.topic = new sns.Topic(this, 'BogusTopic'); // Some filler
    Annotations.of(this).addError('This is an error');
  }
}

class StageWithError extends cdk.Stage {
  constructor(parent, id, props) {
    super(parent, id, props);

    new StackWithError(this, 'Stack');
  }
}

class ConsumingStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    new sns.Topic(this, 'BogusTopic');  // Some filler
    new cdk.CfnOutput(this, 'IConsumedSomething', { value: props.providingStack.topic.topicArn });
  }
}

class MissingSSMParameterStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const parameterName = constructs.Node.of(this).tryGetContext('test:ssm-parameter-name');
    if (parameterName) {
      const param = getSsmParameterValue(this, parameterName);
      new iam.Role(this, 'PhonyRole', { assumedBy: new iam.AccountPrincipal(param) });
    }
  }
}

class LambdaStack extends cdk.Stack {
  constructor(parent, id, props) {
    // sometimes we need to specify the custom bootstrap bucket to use
    // see the 'upgrade legacy bootstrap stack' test
    const synthesizer = parent.node.tryGetContext('legacySynth') === 'true' ?
      new LegacyStackSynthesizer({
        fileAssetsBucketName: parent.node.tryGetContext('bootstrapBucket'),
      })
      : new DefaultStackSynthesizer({
        fileAssetsBucketName: parent.node.tryGetContext('bootstrapBucket'),
      })
    super(parent, id, {
      ...props,
      synthesizer: synthesizer,
    });

    const fn = new lambda.Function(this, 'my-function', {
      code: lambda.Code.asset(path.join(__dirname, 'lambda')),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler'
    });

    new cdk.CfnOutput(this, 'FunctionArn', { value: fn.functionArn });
  }
}

class IamRolesStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    // Environment variabile is used to create a bunch of roles to test
    // that large diff templates are uploaded to S3 to create the changeset.
    for(let i = 1; i <= Number(process.env.NUMBER_OF_ROLES) ; i++) {
      const role = new iam.Role(this, `Role${i}`, {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });
      const cfnRole = role.node.defaultChild;

      // For any extra IAM roles created, add a ton of metadata so that the template size is > 50 KiB.
      if (i > 1) {
        for(let i = 1; i <= 30 ; i++) {
          cfnRole.addMetadata('a'.repeat(1000), 'v');
        }
      }
    }
  }
}

class SessionTagsStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, {
      ...props,
      synthesizer: new DefaultStackSynthesizer({
        deployRoleAdditionalOptions: {
          Tags: [{ Key: 'Department', Value: 'Engineering' }]
        },
        fileAssetPublishingRoleAdditionalOptions: {
          Tags: [{ Key: 'Department', Value: 'Engineering' }]
        },
        imageAssetPublishingRoleAdditionalOptions: {
          Tags: [{ Key: 'Department', Value: 'Engineering' }]
        },
        lookupRoleAdditionalOptions: {
          Tags: [{ Key: 'Department', Value: 'Engineering' }]
        }
      })
    });

    // VPC lookup to test LookupRole
    ec2.Vpc.fromLookup(this, 'DefaultVPC', { isDefault: true });

    // Lambda Function to test AssetPublishingRole
    const fn = new lambda.Function(this, 'my-function', {
      code: lambda.Code.asset(path.join(__dirname, 'lambda')),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler'
    });

    // DockerImageAsset to test ImageAssetPublishingRole
    new docker.DockerImageAsset(this, 'image', {
      directory: path.join(__dirname, 'docker')
    });
  }
}

class NoExecutionRoleCustomSynthesizer extends cdk.DefaultStackSynthesizer {

  emitArtifact(session, options) {
    super.emitArtifact(session, {
      ...options,
      cloudFormationExecutionRoleArn: undefined,
    })
  }
}

class SessionTagsWithNoExecutionRoleCustomSynthesizerStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, {
      ...props,
      synthesizer: new NoExecutionRoleCustomSynthesizer({
        deployRoleAdditionalOptions: {
          Tags: [{ Key: 'Department', Value: 'Engineering' }]
        },
      })
    });

    new sqs.Queue(this, 'sessionTagsQueue');
  }
}
class LambdaHotswapStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const fn = new lambda.Function(this, 'my-function', {
      code: lambda.Code.asset(path.join(__dirname, 'lambda')),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      description: process.env.DYNAMIC_LAMBDA_PROPERTY_VALUE ?? "description",
      environment: {
        SomeVariable:
          process.env.DYNAMIC_LAMBDA_PROPERTY_VALUE ?? "environment",
        ImportValueVariable: process.env.USE_IMPORT_VALUE_LAMBDA_PROPERTY
          ? cdk.Fn.importValue(TEST_EXPORT_OUTPUT_NAME)
          : "no-import",
      },
    });

    new cdk.CfnOutput(this, 'FunctionName', { value: fn.functionName });
  }
}

class EcsHotswapStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    // define a simple vpc and cluster
    const vpc = new ec2.Vpc(this, 'vpc', {
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
      maxAzs: 1,
    });
    const cluster = new ecs.Cluster(this, 'cluster', {
      vpc,
    });

    // allow stack to be used to test failed deployments
    const image =
      process.env.USE_INVALID_ECS_HOTSWAP_IMAGE == 'true'
        ? 'nginx:invalidtag'
        : 'nginx:alpine';

    // deploy basic service
    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      'task-definition'
    );
    taskDefinition.addContainer('nginx', {
      image: ecs.ContainerImage.fromRegistry(image),
      environment: {
        SOME_VARIABLE: process.env.DYNAMIC_ECS_PROPERTY_VALUE ?? 'environment',
      },
      healthCheck: {
        command: ['CMD-SHELL', 'exit 0'], // fake health check to speed up deployment
        interval: cdk.Duration.seconds(5),
      },
    });
    const service = new ecs.FargateService(this, 'service', {
      cluster,
      taskDefinition,
      assignPublicIp: true, // required without NAT to pull image
      circuitBreaker: { rollback: false },
      desiredCount: 1,
    });

    new cdk.CfnOutput(this, 'ClusterName', { value: cluster.clusterName });
    new cdk.CfnOutput(this, 'ServiceName', { value: service.serviceName });
  }
}

class DockerStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    new docker.DockerImageAsset(this, 'image', {
      directory: path.join(__dirname, 'docker')
    });

    // Add at least a single resource (WaitConditionHandle), otherwise this stack will never
    // be deployed (and its assets never built)
    new cdk.CfnResource(this, 'Handle', {
      type: 'AWS::CloudFormation::WaitConditionHandle'
    });
  }
}

class DockerInUseStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    // Use the docker file in a lambda otherwise it will not be referenced in the template
    const fn = new lambda.Function(this, 'my-function', {
      code: lambda.Code.fromAssetImage(path.join(__dirname, 'docker')),
      runtime: lambda.Runtime.FROM_IMAGE,
      handler: lambda.Handler.FROM_IMAGE,
    });
  }
}

class DockerStackWithCustomFile extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    new docker.DockerImageAsset(this, 'image', {
      directory: path.join(__dirname, 'docker'),
      file: 'Dockerfile.Custom'
    });

    // Add at least a single resource (WaitConditionHandle), otherwise this stack will never
    // be deployed (and its assets never built)
    new cdk.CfnResource(this, 'Handle', {
      type: 'AWS::CloudFormation::WaitConditionHandle'
    });
  }
}

/**
 * A stack that will never succeed deploying (done in a way that CDK cannot detect but CFN will complain about)
 */
class FailedStack extends cdk.Stack {

  constructor(parent, id, props) {
    super(parent, id, props);

    // fails on 'Property PolicyDocument cannot be empty'.
    new cdk.CfnResource(this, 'EmptyPolicy', {
      type: 'AWS::IAM::Policy'
    })

  }

}

const VPC_TAG_NAME = 'custom-tag';
const VPC_TAG_VALUE = `${stackPrefix}-bazinga!`;

class DefineVpcStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 1,
    })
    cdk.Aspects.of(vpc).add(new cdk.Tag(VPC_TAG_NAME, VPC_TAG_VALUE));
  }
}

class ImportVpcStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    ec2.Vpc.fromLookup(this, 'DefaultVPC', { isDefault: true });
    ec2.Vpc.fromLookup(this, 'ByTag', { tags: { [VPC_TAG_NAME]: VPC_TAG_VALUE } });
  }
}

class ConditionalResourceStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    if (!process.env.NO_RESOURCE) {
      new iam.User(this, 'User');
    }
  }
}

const TEST_EXPORT_OUTPUT_NAME = 'test-export-output';

class ExportValueStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    // just need any resource to exist within the stack
    const topic = new sns.Topic(this, 'Topic');

    new cdk.CfnOutput(this, 'ExportValueOutput', {
      exportName: TEST_EXPORT_OUTPUT_NAME,
      value: topic.topicArn,
    });
  }
}

class BundlingStage extends cdk.Stage {
  constructor(parent, id, props) {
    super(parent, id, props);
    const stack = new cdk.Stack(this, 'BundlingStack');

    new lambda.Function(stack, 'Handler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });
  }
}

class SomeStage extends cdk.Stage {
  constructor(parent, id, props) {
    super(parent, id, props);

    new YourStack(this, 'StackInStage');
  }
}

class StageUsingContext extends cdk.Stage {
  constructor(parent, id, props) {
    super(parent, id, props);

    new StackUsingContext(this, 'StackInStage');
  }
}

class BuiltinLambdaStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // will deploy a Nodejs lambda backed custom resource
    });
  }
}

class NotificationArnsStack extends cdk.Stack {
  constructor(parent, id, props) {

    const arnsFromEnv = process.env.INTEG_NOTIFICATION_ARNS;
    super(parent, id, {
      ...props,
      // comma separated list of arns. 
      // empty string means empty list.
      // undefined means undefined
      notificationArns: arnsFromEnv == '' ? [] : (arnsFromEnv ? arnsFromEnv.split(',') : undefined)
    });

    new cdk.CfnWaitConditionHandle(this, 'WaitConditionHandle');

  }
}

class AppSyncHotswapStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const api = new appsync.GraphqlApi(this, "Api", {
      name: "appsync-hotswap",
      definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.hotswap.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });

    const noneDataSource = api.addNoneDataSource("none");
    // create 50 appsync functions to hotswap
    for (const i of Array(50).keys()) {
      const appsyncFunction = new appsync.AppsyncFunction(this, `Function${i}`, {
        name: `appsync_function${i}`,
        api,
        dataSource: noneDataSource,
        requestMappingTemplate: appsync.MappingTemplate.fromString(process.env.DYNAMIC_APPSYNC_PROPERTY_VALUE ?? "$util.toJson({})"),
        responseMappingTemplate: appsync.MappingTemplate.fromString('$util.toJson({})'),
      });
    }
  }
}

class MetadataStack extends cdk.Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    const handle = new cdk.CfnWaitConditionHandle(this, 'WaitConditionHandle');
    handle.addMetadata('Key', process.env.INTEG_METADATA_VALUE ?? 'default')

  }  
}

const app = new cdk.App({
  context: {
    '@aws-cdk/core:assetHashSalt': process.env.CODEBUILD_BUILD_ID, // Force all assets to be unique, but consistent in one build
  },
});

const defaultEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

// Sometimes we don't want to synthesize all stacks because it will impact the results
const stackSet = process.env.INTEG_STACK_SET || 'default';

switch (stackSet) {
  case 'default':
    // Deploy all does a wildcard ${stackPrefix}-test-*
    new MyStack(app, `${stackPrefix}-test-1`, { env: defaultEnv });
    new YourStack(app, `${stackPrefix}-test-2`);
    new NoticesStack(app, `${stackPrefix}-notices`);
    // Deploy wildcard with parameters does ${stackPrefix}-param-test-*
    new ParameterStack(app, `${stackPrefix}-param-test-1`);
    new OtherParameterStack(app, `${stackPrefix}-param-test-2`);
    // Deploy stack with multiple parameters
    new MultiParameterStack(app, `${stackPrefix}-param-test-3`);
    // Deploy stack with outputs does ${stackPrefix}-outputs-test-*
    new OutputsStack(app, `${stackPrefix}-outputs-test-1`);
    new AnotherOutputsStack(app, `${stackPrefix}-outputs-test-2`);
    // Not included in wildcard
    new IamStack(app, `${stackPrefix}-iam-test`, { env: defaultEnv });
    const providing = new ProvidingStack(app, `${stackPrefix}-order-providing`);
    new ConsumingStack(app, `${stackPrefix}-order-consuming`, { providingStack: providing });

    new MissingSSMParameterStack(app, `${stackPrefix}-missing-ssm-parameter`, { env: defaultEnv });

    new LambdaStack(app, `${stackPrefix}-lambda`);

    // This stack is used to test diff with large templates by creating a role with a ton of metadata
    new IamRolesStack(app, `${stackPrefix}-iam-roles`);

    if (process.env.ENABLE_VPC_TESTING == 'IMPORT') {
      // this stack performs a VPC lookup so we gate synth
      const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };
      new SessionTagsStack(app, `${stackPrefix}-session-tags`, { env });
    }

    new SessionTagsWithNoExecutionRoleCustomSynthesizerStack(app, `${stackPrefix}-session-tags-with-custom-synthesizer`);
    new LambdaHotswapStack(app, `${stackPrefix}-lambda-hotswap`);
    new EcsHotswapStack(app, `${stackPrefix}-ecs-hotswap`);
    new AppSyncHotswapStack(app, `${stackPrefix}-appsync-hotswap`);
    new DockerStack(app, `${stackPrefix}-docker`);
    new DockerInUseStack(app, `${stackPrefix}-docker-in-use`);
    new DockerStackWithCustomFile(app, `${stackPrefix}-docker-with-custom-file`);

    new NotificationArnsStack(app, `${stackPrefix}-notification-arns`);

    // SSO stacks
    new SsoInstanceAccessControlConfig(app, `${stackPrefix}-sso-access-control`);
    new SsoAssignment(app, `${stackPrefix}-sso-assignment`);
    new SsoPermissionSetManagedPolicy(app, `${stackPrefix}-sso-perm-set-with-managed-policy`);
    new SsoPermissionSetNoPolicy(app, `${stackPrefix}-sso-perm-set-without-managed-policy`);

    const failed = new FailedStack(app, `${stackPrefix}-failed`)

    // A stack that depends on the failed stack -- used to test that '-e' does not deploy the failing stack
    const dependsOnFailed = new OutputsStack(app, `${stackPrefix}-depends-on-failed`);
    dependsOnFailed.addDependency(failed);

    if (process.env.ENABLE_VPC_TESTING) { // Gating so we don't do context fetching unless that's what we are here for
      const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };
      if (process.env.ENABLE_VPC_TESTING === 'DEFINE')
        new DefineVpcStack(app, `${stackPrefix}-define-vpc`, { env });
      if (process.env.ENABLE_VPC_TESTING === 'IMPORT')
        new ImportVpcStack(app, `${stackPrefix}-import-vpc`, { env });
    }

    new ConditionalResourceStack(app, `${stackPrefix}-conditional-resource`)

    new StackWithNestedStack(app, `${stackPrefix}-with-nested-stack`);
    new StackWithNestedStackUsingParameters(app, `${stackPrefix}-with-nested-stack-using-parameters`);
    new StackWithDoublyNestedStack(app, `${stackPrefix}-with-doubly-nested-stack`);
    new ListStack(app, `${stackPrefix}-list-stacks`)
    new ListMultipleDependentStack(app, `${stackPrefix}-list-multiple-dependent-stacks`);

    new YourStack(app, `${stackPrefix}-termination-protection`, {
      terminationProtection: process.env.TERMINATION_PROTECTION !== 'FALSE' ? true : false,
    });

    new SomeStage(app, `${stackPrefix}-stage`);

    new BuiltinLambdaStack(app, `${stackPrefix}-builtin-lambda-function`);

    new ImportableStack(app, `${stackPrefix}-importable-stack`);

    new MigrateStack(app, `${stackPrefix}-migrate-stack`);

    new ExportValueStack(app, `${stackPrefix}-export-value-stack`);

    new BundlingStage(app, `${stackPrefix}-bundling-stage`);

    new MetadataStack(app, `${stackPrefix}-metadata`);
    break;

  case 'stage-using-context':
    // Cannot be combined with other test stacks, because we use this to test
    // that stage context is propagated up and causes synth to fail when combined
    // with '--no-lookups'.

    // Needs a dummy stack at the top level because the CLI will fail otherwise
    new YourStack(app, `${stackPrefix}-toplevel`, { env: defaultEnv });
    new StageUsingContext(app, `${stackPrefix}-stage-using-context`, {
      env: defaultEnv,
    });
    break;

  case 'stage-with-errors':
    const stage = new StageWithError(app, `${stackPrefix}-stage-with-errors`);
    stage.synth({ validateOnSynthesis: true });
    break;

  case 'stage-with-no-stacks':
    break;

  default:
    throw new Error(`Unrecognized INTEG_STACK_SET: '${stackSet}'`);
}

app.synth();
