using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Specify configuration parameters for a VPC subnet</summary>
    [JsiiInterfaceProxy(typeof(IVpcSubnetProps), "@aws-cdk/aws-ec2.VpcSubnetProps")]
    internal class VpcSubnetPropsProxy : DeputyBase, IVpcSubnetProps
    {
        private VpcSubnetPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The availability zone for the subnet</summary>
        [JsiiProperty("availabilityZone", "{\"primitive\":\"string\"}")]
        public virtual string AvailabilityZone
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The VPC which this subnet is part of</summary>
        [JsiiProperty("vpcId", "{\"fqn\":\"@aws-cdk/cdk.Token\"}")]
        public virtual Token VpcId
        {
            get => GetInstanceProperty<Token>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The CIDR notation for this subnet</summary>
        [JsiiProperty("cidrBlock", "{\"primitive\":\"string\"}")]
        public virtual string CidrBlock
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Controls if a public IP is associated to an instance at launch
        /// 
        /// Defaults to true in Subnet.Public, false in Subnet.Private or Subnet.Isolated.
        /// </summary>
        [JsiiProperty("mapPublicIpOnLaunch", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? MapPublicIpOnLaunch
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }
    }
}