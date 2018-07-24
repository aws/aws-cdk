using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Properties that reference an external VpcNetwork</summary>
    [JsiiInterface(typeof(IVpcNetworkRefProps), "@aws-cdk/aws-ec2.VpcNetworkRefProps")]
    public interface IVpcNetworkRefProps
    {
        /// <summary>VPC's identifier</summary>
        [JsiiProperty("vpcId", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkId\"}")]
        VpcNetworkId VpcId
        {
            get;
            set;
        }

        /// <summary>
        /// List of a availability zones, one for every subnet.
        /// 
        /// The first half are for the public subnets, the second half are for
        /// the private subnets.
        /// </summary>
        [JsiiProperty("availabilityZones", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}")]
        string[] AvailabilityZones
        {
            get;
            set;
        }

        /// <summary>
        /// List of public subnet IDs, one for every subnet
        /// 
        /// Must match the availability zones and private subnet ids in length and order.
        /// </summary>
        [JsiiProperty("publicSubnetIds", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetId\"}}}")]
        VpcSubnetId[] PublicSubnetIds
        {
            get;
            set;
        }

        /// <summary>
        /// List of private subnet IDs, one for every subnet
        /// 
        /// Must match the availability zones and public subnet ids in length and order.
        /// </summary>
        [JsiiProperty("privateSubnetIds", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetId\"}}}")]
        VpcSubnetId[] PrivateSubnetIds
        {
            get;
            set;
        }
    }
}