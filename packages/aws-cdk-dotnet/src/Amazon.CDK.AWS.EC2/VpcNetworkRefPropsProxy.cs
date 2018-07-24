using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Properties that reference an external VpcNetwork</summary>
    [JsiiInterfaceProxy(typeof(IVpcNetworkRefProps), "@aws-cdk/aws-ec2.VpcNetworkRefProps")]
    internal class VpcNetworkRefPropsProxy : DeputyBase, IVpcNetworkRefProps
    {
        private VpcNetworkRefPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>VPC's identifier</summary>
        [JsiiProperty("vpcId", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkId\"}")]
        public virtual VpcNetworkId VpcId
        {
            get => GetInstanceProperty<VpcNetworkId>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// List of a availability zones, one for every subnet.
        /// 
        /// The first half are for the public subnets, the second half are for
        /// the private subnets.
        /// </summary>
        [JsiiProperty("availabilityZones", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}")]
        public virtual string[] AvailabilityZones
        {
            get => GetInstanceProperty<string[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// List of public subnet IDs, one for every subnet
        /// 
        /// Must match the availability zones and private subnet ids in length and order.
        /// </summary>
        [JsiiProperty("publicSubnetIds", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetId\"}}}")]
        public virtual VpcSubnetId[] PublicSubnetIds
        {
            get => GetInstanceProperty<VpcSubnetId[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// List of private subnet IDs, one for every subnet
        /// 
        /// Must match the availability zones and public subnet ids in length and order.
        /// </summary>
        [JsiiProperty("privateSubnetIds", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetId\"}}}")]
        public virtual VpcSubnetId[] PrivateSubnetIds
        {
            get => GetInstanceProperty<VpcSubnetId[]>();
            set => SetInstanceProperty(value);
        }
    }
}