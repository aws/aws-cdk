import autoscaling = require('@aws-cdk/aws-autoscaling');
import ec2 = require('@aws-cdk/aws-ec2');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import assert = require('assert');

class ResourceOverridesExample extends cdk.Stack {
    constructor(scope: cdk.App, id: string) {
        super(scope, id);

        const otherBucket = new s3.Bucket(this, 'Other');

        const bucket = new s3.Bucket(this, 'MyBucket', {
            versioned: true,
            encryption: s3.BucketEncryption.KmsManaged
        });

        const bucketResource2 = bucket.node.findChild('Resource') as s3.CfnBucket;
        bucketResource2.addPropertyOverride('BucketEncryption.ServerSideEncryptionConfiguration.0.EncryptEverythingAndAlways', true);
        bucketResource2.addPropertyDeletionOverride('BucketEncryption.ServerSideEncryptionConfiguration.0.ServerSideEncryptionByDefault');

        //
        // Accessing the L1 bucket resource from an L2 bucket
        //

        const bucketResource = bucket.node.findChild('Resource') as s3.CfnBucket;
        const anotherWay = bucket.node.children.find(c => (c as cdk.Resource).resourceType === 'AWS::S3::Bucket') as s3.CfnBucket;
        assert.equal(bucketResource, anotherWay);

        //
        // This is how to specify resource options such as dependencies, metadata, update policy
        //

        bucketResource.node.addDependency(otherBucket.node.findChild('Resource') as cdk.Resource);
        bucketResource.options.metadata = { MetadataKey: 'MetadataValue' };
        bucketResource.options.updatePolicy = {
            autoScalingRollingUpdate: {
                pauseTime: '390'
            }
        };

        //
        // This is how to specify "raw" overrides at the __resource__ level
        //

        bucketResource.addOverride('Type', 'AWS::S3::Bucketeer'); // even "Type" can be overridden
        bucketResource.addOverride('Transform', 'Boom');
        bucketResource.addOverride('Properties.CorsConfiguration', {
            Custom: 123,
            Bar: [ 'A', 'B' ]
        });

        // addPropertyOverrides simply allows you to omit the "Properties." prefix
        bucketResource.addPropertyOverride('VersioningConfiguration.Status', 'NewStatus');
        bucketResource.addPropertyOverride('Foo', null);
        bucketResource.addPropertyOverride('Token', otherBucket.bucketArn); // use tokens
        bucketResource.addPropertyOverride('LoggingConfiguration.DestinationBucketName', otherBucket.bucketName);

        //
        // It is also possible to request a deletion of a value by either assigning
        // `undefined` (in supported languages) or use the `addDeletionOverride` method
        //

        bucketResource.addDeletionOverride('Metadata');
        bucketResource.addPropertyDeletionOverride('CorsConfiguration.Bar');

        //
        // It is also possible to specify overrides via a strong-typed property
        // bag called `propertyOverrides`
        //

        bucketResource.propertyOverrides.analyticsConfigurations = [
            {
                id: 'config1',
                storageClassAnalysis: {
                    dataExport: {
                        outputSchemaVersion: '1',
                        destination: {
                            format: 'html',
                            bucketArn: otherBucket.bucketArn // use tokens freely
                        }
                    }
                }
            }
        ];

        bucketResource.propertyOverrides.corsConfiguration = {
            corsRules: [
                {
                    allowedMethods: [ 'GET' ],
                    allowedOrigins: [ '*' ]
                }
            ]
        };

        const vpc = new ec2.VpcNetwork(this, 'VPC', { maxAZs: 1 });
        const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
            instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.XLarge),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc
        });

        //
        // The default child resource is called `Resource`, but secondary resources, such as
        // an Auto Scaling Group's launch configuration might have a different ID. You will likely
        // need to consule the codebase or use the `.map.find` method above
        //

        const lc = asg.node.findChild('LaunchConfig') as autoscaling.CfnLaunchConfiguration;
        lc.addPropertyOverride('Foo.Bar', 'Hello');
    }
}

const app = new cdk.App();
new ResourceOverridesExample(app, 'resource-overrides');
app.run();