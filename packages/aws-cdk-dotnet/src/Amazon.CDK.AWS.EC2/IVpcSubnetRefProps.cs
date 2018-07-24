using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiInterface(typeof(IVpcSubnetRefProps), "@aws-cdk/aws-ec2.VpcSubnetRefProps")]
    public interface IVpcSubnetRefProps
    {
        /// <summary>The Availability Zone the subnet is located in</summary>
        [JsiiProperty("availabilityZone", "{\"primitive\":\"string\"}")]
        string AvailabilityZone
        {
            get;
            set;
        }

        /// <summary>The subnetId for this particular subnet</summary>
        [JsiiProperty("subnetId", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetId\"}")]
        VpcSubnetId SubnetId
        {
            get;
            set;
        }
    }
}