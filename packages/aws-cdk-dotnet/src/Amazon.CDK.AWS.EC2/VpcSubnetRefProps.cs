using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    public class VpcSubnetRefProps : DeputyBase, IVpcSubnetRefProps
    {
        /// <summary>The Availability Zone the subnet is located in</summary>
        [JsiiProperty("availabilityZone", "{\"primitive\":\"string\"}", true)]
        public string AvailabilityZone
        {
            get;
            set;
        }

        /// <summary>The subnetId for this particular subnet</summary>
        [JsiiProperty("subnetId", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetId\"}", true)]
        public VpcSubnetId SubnetId
        {
            get;
            set;
        }
    }
}