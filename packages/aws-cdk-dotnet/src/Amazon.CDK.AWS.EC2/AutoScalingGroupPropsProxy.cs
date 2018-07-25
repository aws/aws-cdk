using Amazon.CDK.AWS.SNS.cloudformation;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Properties of a Fleet</summary>
    [JsiiInterfaceProxy(typeof(IAutoScalingGroupProps), "@aws-cdk/aws-ec2.AutoScalingGroupProps")]
    internal class AutoScalingGroupPropsProxy : DeputyBase, IAutoScalingGroupProps
    {
        private AutoScalingGroupPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Type of instance to launch</summary>
        [JsiiProperty("instanceType", "{\"fqn\":\"@aws-cdk/aws-ec2.InstanceType\"}")]
        public virtual InstanceType InstanceType
        {
            get => GetInstanceProperty<InstanceType>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Minimum number of instances in the fleet</summary>
        /// <remarks>default: 1</remarks>
        [JsiiProperty("minSize", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? MinSize
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Maximum number of instances in the fleet</summary>
        /// <remarks>default: 1</remarks>
        [JsiiProperty("maxSize", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? MaxSize
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Initial amount of instances in the fleet</summary>
        /// <remarks>default: 1</remarks>
        [JsiiProperty("desiredCapacity", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? DesiredCapacity
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Name of SSH keypair to grant access to instances</summary>
        /// <remarks>default: No SSH access will be possible</remarks>
        [JsiiProperty("keyName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string KeyName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>AMI to launch</summary>
        [JsiiProperty("machineImage", "{\"fqn\":\"@aws-cdk/aws-ec2.IMachineImageSource\"}")]
        public virtual IIMachineImageSource MachineImage
        {
            get => GetInstanceProperty<IIMachineImageSource>();
            set => SetInstanceProperty(value);
        }

        /// <summary>VPC to launch these instances in.</summary>
        [JsiiProperty("vpc", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}")]
        public virtual VpcNetworkRef Vpc
        {
            get => GetInstanceProperty<VpcNetworkRef>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Where to place instances within the VPC</summary>
        [JsiiProperty("vpcPlacement", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcPlacementStrategy\",\"optional\":true}")]
        public virtual IVpcPlacementStrategy VpcPlacement
        {
            get => GetInstanceProperty<IVpcPlacementStrategy>();
            set => SetInstanceProperty(value);
        }

        /// <summary>SNS topic to send notifications about fleet changes</summary>
        /// <remarks>default: No fleet change notifications will be sent.</remarks>
        [JsiiProperty("notificationsTopic", "{\"fqn\":\"@aws-cdk/aws-sns.cloudformation.TopicResource\",\"optional\":true}")]
        public virtual TopicResource NotificationsTopic
        {
            get => GetInstanceProperty<TopicResource>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Whether the instances can initiate connections to anywhere by default</summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("allowAllOutbound", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? AllowAllOutbound
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }
    }
}