using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>
    /// Customize how instances are placed inside a VPC
    /// 
    /// Constructs that allow customization of VPC placement use parameters of this
    /// type to provide placement settings.
    /// </summary>
    [JsiiInterfaceProxy(typeof(IVpcPlacementStrategy), "@aws-cdk/aws-ec2.VpcPlacementStrategy")]
    internal class VpcPlacementStrategyProxy : DeputyBase, IVpcPlacementStrategy
    {
        private VpcPlacementStrategyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// Whether to use the VPC's public subnets to start instances
        /// 
        /// If false, the instances are started in the private subnets.
        /// </summary>
        /// <remarks>default: false</remarks>
        [JsiiProperty("usePublicSubnets", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? UsePublicSubnets
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }
    }
}