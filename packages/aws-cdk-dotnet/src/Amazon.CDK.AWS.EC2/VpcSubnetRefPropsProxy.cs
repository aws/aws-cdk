using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiInterfaceProxy(typeof(IVpcSubnetRefProps), "@aws-cdk/aws-ec2.VpcSubnetRefProps")]
    internal class VpcSubnetRefPropsProxy : DeputyBase, IVpcSubnetRefProps
    {
        private VpcSubnetRefPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The Availability Zone the subnet is located in</summary>
        [JsiiProperty("availabilityZone", "{\"primitive\":\"string\"}")]
        public virtual string AvailabilityZone
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The subnetId for this particular subnet</summary>
        [JsiiProperty("subnetId", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetId\"}")]
        public virtual VpcSubnetId SubnetId
        {
            get => GetInstanceProperty<VpcSubnetId>();
            set => SetInstanceProperty(value);
        }
    }
}