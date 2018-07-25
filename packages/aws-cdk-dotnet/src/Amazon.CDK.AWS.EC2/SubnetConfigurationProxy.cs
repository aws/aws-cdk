using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Specify configuration parameters for a VPC to be built</summary>
    [JsiiInterfaceProxy(typeof(ISubnetConfiguration), "@aws-cdk/aws-ec2.SubnetConfiguration")]
    internal class SubnetConfigurationProxy : DeputyBase, ISubnetConfiguration
    {
        private SubnetConfigurationProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The CIDR Mask or the number of leading 1 bits in the routing mask
        /// 
        /// Valid values are 16 - 28
        /// </summary>
        [JsiiProperty("cidrMask", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? CidrMask
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The type of Subnet to configure.
        /// 
        /// The Subnet type will control the ability to route and connect to the
        /// Internet.
        /// </summary>
        [JsiiProperty("subnetType", "{\"fqn\":\"@aws-cdk/aws-ec2.SubnetType\"}")]
        public virtual SubnetType SubnetType
        {
            get => GetInstanceProperty<SubnetType>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The common Logical Name for the `VpcSubnet`
        /// 
        /// Thi name will be suffixed with an integer correlating to a specific
        /// availability zone.
        /// </summary>
        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        public virtual string Name
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}