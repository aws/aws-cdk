using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>Instance properties for database instances</summary>
    [JsiiInterface(typeof(IInstanceProps), "@aws-cdk/aws-rds.InstanceProps")]
    public interface IInstanceProps
    {
        /// <summary>What type of instance to start for the replicas</summary>
        [JsiiProperty("instanceType", "{\"fqn\":\"@aws-cdk/aws-ec2.InstanceType\"}")]
        InstanceType InstanceType
        {
            get;
            set;
        }

        /// <summary>
        /// What subnets to run the RDS instances in.
        /// 
        /// Must be at least 2 subnets in two different AZs.
        /// </summary>
        [JsiiProperty("vpc", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}")]
        VpcNetworkRef Vpc
        {
            get;
            set;
        }

        /// <summary>Where to place the instances within the VPC</summary>
        [JsiiProperty("vpcPlacement", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcPlacementStrategy\",\"optional\":true}")]
        IVpcPlacementStrategy VpcPlacement
        {
            get;
            set;
        }
    }
}