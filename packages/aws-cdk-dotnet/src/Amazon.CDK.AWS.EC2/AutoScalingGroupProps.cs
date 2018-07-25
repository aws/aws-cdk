using Amazon.CDK.AWS.SNS.cloudformation;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Properties of a Fleet</summary>
    public class AutoScalingGroupProps : DeputyBase, IAutoScalingGroupProps
    {
        /// <summary>Type of instance to launch</summary>
        [JsiiProperty("instanceType", "{\"fqn\":\"@aws-cdk/aws-ec2.InstanceType\"}", true)]
        public InstanceType InstanceType
        {
            get;
            set;
        }

        /// <summary>Minimum number of instances in the fleet</summary>
        /// <remarks>default: 1</remarks>
        [JsiiProperty("minSize", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? MinSize
        {
            get;
            set;
        }

        /// <summary>Maximum number of instances in the fleet</summary>
        /// <remarks>default: 1</remarks>
        [JsiiProperty("maxSize", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? MaxSize
        {
            get;
            set;
        }

        /// <summary>Initial amount of instances in the fleet</summary>
        /// <remarks>default: 1</remarks>
        [JsiiProperty("desiredCapacity", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? DesiredCapacity
        {
            get;
            set;
        }

        /// <summary>Name of SSH keypair to grant access to instances</summary>
        /// <remarks>default: No SSH access will be possible</remarks>
        [JsiiProperty("keyName", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string KeyName
        {
            get;
            set;
        }

        /// <summary>AMI to launch</summary>
        [JsiiProperty("machineImage", "{\"fqn\":\"@aws-cdk/aws-ec2.IMachineImageSource\"}", true)]
        public IIMachineImageSource MachineImage
        {
            get;
            set;
        }

        /// <summary>VPC to launch these instances in.</summary>
        [JsiiProperty("vpc", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}", true)]
        public VpcNetworkRef Vpc
        {
            get;
            set;
        }

        /// <summary>Where to place instances within the VPC</summary>
        [JsiiProperty("vpcPlacement", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcPlacementStrategy\",\"optional\":true}", true)]
        public IVpcPlacementStrategy VpcPlacement
        {
            get;
            set;
        }

        /// <summary>SNS topic to send notifications about fleet changes</summary>
        /// <remarks>default: No fleet change notifications will be sent.</remarks>
        [JsiiProperty("notificationsTopic", "{\"fqn\":\"@aws-cdk/aws-sns.cloudformation.TopicResource\",\"optional\":true}", true)]
        public TopicResource NotificationsTopic
        {
            get;
            set;
        }

        /// <summary>Whether the instances can initiate connections to anywhere by default</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("allowAllOutbound", "{\"primitive\":\"boolean\",\"optional\":true}", true)]
        public bool? AllowAllOutbound
        {
            get;
            set;
        }
    }
}