using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>Instance properties for database instances</summary>
    [JsiiInterfaceProxy(typeof(IInstanceProps), "@aws-cdk/aws-rds.InstanceProps")]
    internal class InstancePropsProxy : DeputyBase, IInstanceProps
    {
        private InstancePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>What type of instance to start for the replicas</summary>
        [JsiiProperty("instanceType", "{\"fqn\":\"@aws-cdk/aws-ec2.InstanceType\"}")]
        public virtual InstanceType InstanceType
        {
            get => GetInstanceProperty<InstanceType>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// What subnets to run the RDS instances in.
        /// 
        /// Must be at least 2 subnets in two different AZs.
        /// </summary>
        [JsiiProperty("vpc", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}")]
        public virtual VpcNetworkRef Vpc
        {
            get => GetInstanceProperty<VpcNetworkRef>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Where to place the instances within the VPC</summary>
        [JsiiProperty("vpcPlacement", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcPlacementStrategy\",\"optional\":true}")]
        public virtual IVpcPlacementStrategy VpcPlacement
        {
            get => GetInstanceProperty<IVpcPlacementStrategy>();
            set => SetInstanceProperty(value);
        }
    }
}