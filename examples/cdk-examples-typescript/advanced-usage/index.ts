import { StackResource } from '@aws-cdk/cloudformation';
import * as cdk from '@aws-cdk/core';
import { PolicyStatement, ServicePrincipal } from '@aws-cdk/core';
import { InstanceResource, WindowsImage, WindowsVersion } from '@aws-cdk/ec2';
import { } from '@aws-cdk/ec2';
import { Role } from '@aws-cdk/iam';
import { Bucket } from '@aws-cdk/s3';
import { SubscriptionResource, TopicResource } from '@aws-cdk/sns';
import { QueueResource } from '@aws-cdk/sqs';

/**
 * This stack demonstrates the use of the IAM policy library shipped with the CDK.
 */
class PolicyExample extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        // here's how to create an IAM Role with an assume policy for the Lambda
        // service principal.
        const role = new Role(this, 'Role', {
            assumedBy: new ServicePrincipal('lambda.amazon.aws.com')
        });

        // when you call `addToPolicy`, a default policy is defined and attached
        // to the bucket.
        const bucket = new Bucket(this, 'MyBucket');

        // the role also has a policy attached to it.
        role.addToPolicy(new PolicyStatement()
            .addResource(bucket.arnForObjects('*'))
            .addResource(bucket.bucketArn)
            .addActions('s3:*'));
    }
}

/**
 * This stack demonstrates the use of environmental context such as availablity zones
 * and SSM parameters. You will notice there are two instances of this stack in the app -
 * one in us-east-1 and one in eu-west-2. When you "cx synth" these stacks, you will see how
 * the AZ list and the AMI IDs are different.
 */
class EnvContextExample extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        // get the list of AZs for the current region/account
        const azs = new cdk.AvailabilityZoneProvider(this).availabilityZones;

        // get the AMI ID for a specific Windows version in this region
        const ami = new WindowsImage(WindowsVersion.WindowsServer2016EnglishNanoBase).getImage(this);

        for (const az of azs) {
            if (typeof(az) !== 'string') {
                continue;
            }

            // render construct name based on it's availablity zone
            const constructName = `InstanceFor${az.replace(/-/g, '').toUpperCase()}`;

            new InstanceResource(this, constructName, {
                imageId: ami.imageId,
                availabilityZone: az,
            });
        }
    }
}

/**
 * This stack shows how to use the Include construct to merge an existing CloudFormation template
 * into your CDK stack and then add constructs and resources programmatically to it.
 */
class IncludeExample extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        // so you have an existing template...
        // you can also load it from a file:
        //     const template = JSON.parse(fs.readFileSync('./my-template.json).toString());
        const template = {
            Resources: {
                IncludedQueue: {
                    Type: "AWS::SQS::Queue",
                    Properties: {
                        VisibilityTimeout: 300
                    }
                }
            }
        };

        // merge template as-is into the stack
        new cdk.Include(this, 'Include', { template });

        // add constructs (and resources) programmatically
        new EnvContextExample(parent, 'Example');
        new QueueResource(this, 'CDKQueue', {});
    }
}

class NestedStackExample extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        // pick up to 3 AZs from environment.
        const azs = new cdk.AvailabilityZoneProvider(this).availabilityZones.slice(0, 3);

        // add an "AWS::CloudFormation::Stack" resource which uses the MongoDB quickstart
        // https://aws.amazon.com/quickstart/architecture/mongodb/
        // only non-default values are provided here.
        new StackResource(this, 'NestedStack', {
            templateUrl: 'https://s3.amazonaws.com/quickstart-reference/mongodb/latest/templates/mongodb-master.template',
            parameters: {
                KeyPairName: 'my-key-pair',
                RemoteAccessCIDR: '0.0.0.0/0',
                AvailabilityZones: azs.join(','),
                NumberOfAZs: azs.length.toString(),
                MongoDBAdminPassword: 'root1234',
            }
        });
    }
}

/**
 * Demonstrates how resources can be referenced using .ref and .<attribute>
 * It also demonstrates how to modify resource options such as metadata
 */
class ResourceReferencesExample extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        const topic = new TopicResource(this, 'Topic', {});
        const queue = new QueueResource(this, 'Queue', {});

        new SubscriptionResource(this, 'Subscription', {
            topicArn: topic.ref, // resolves to { Ref: <topic-id> }
            protocol: 'sqs',
            endpoint: queue.queueArn // resolves to { "Fn::GetAtt": [ <queue-id>, "Arn" ] }
        });

        // resource.options can be used to set options on a resource construct
        queue.options.metadata = {
            MyKey: "MyValue"
        };
    }
}

/**
 * Demonstrates how to use CloudFormation parameters, outputs, pseudo parameters and intrinsic functions.
 */
class CloudFormationExample extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        // parameters are constructs that synthesize into the template's "Parameters" section
        const param = new cdk.Parameter(this, 'MyTemplateParameter', {
            type: 'String',
            default: 'HelloWorld'
        });

        // outputs are constructs the synthesize into the template's "Outputs" section
        new cdk.Output(this, 'Output', {
            description: 'This is an output of the template',
            value: new cdk.FnJoin(',', new cdk.AwsAccountId(), '/', param.ref)
        });

        // stack.templateOptions can be used to specify template-level options
        this.templateOptions.description = 'This goes into the "Description" attribute of the template';
        this.templateOptions.metadata = {

            // all CloudFormation's pseudo-parameters are supported via the `cdk.AwsXxx` classes
            PseudoParameters: [
                new cdk.AwsAccountId(),
                new cdk.AwsDomainSuffix(),
                new cdk.AwsNotificationARNs(),
                new cdk.AwsNoValue(),
                new cdk.AwsPartition(),
                new cdk.AwsRegion(),
                new cdk.AwsStackId(),
                new cdk.AwsStackName(),
            ],

            // all CloudFormation's intrinsic functions are supported via the `cdk.FnXxx` classes
            IntrinsicFunctions: [
                new cdk.FnAnd(
                    new cdk.FnFindInMap('MyMap', 'K1', 'K2'),
                    new cdk.FnSub('hello ${world}', {
                        world: new cdk.FnBase64(param.ref)  // resolves to { Ref: <param-id> }
                    }))
            ],
        };
    }
}

const app = new cdk.App(process.argv);

new PolicyExample(app, 'PolicyExample');
new IncludeExample(app, 'IncludeExample');
new NestedStackExample(app, 'NestedStackExample');
new ResourceReferencesExample(app, 'ResourceReferenceExample');
new CloudFormationExample(app, 'CloudFormationExample');

new EnvContextExample(app, 'EnvContextExampleNA', { env: { region: 'us-east-1' }});
new EnvContextExample(app, 'EnvContextExampleEU', { env: { region: 'eu-west-2' }});

process.stdout.write(app.run());
