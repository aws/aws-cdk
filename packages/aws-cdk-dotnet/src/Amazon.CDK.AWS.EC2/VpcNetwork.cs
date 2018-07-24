using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>
    /// VpcNetwork deploys an AWS VPC, with public and private subnets per Availability Zone.
    /// For example:
    /// 
    /// import { VpcNetwork } from '@aws-cdk/aws-ec2'
    /// 
    /// const vpc = new VpcNetwork(this, {
    ///      cidr: "10.0.0.0/16"
    /// })
    /// 
    /// // Iterate the public subnets
    /// for (let subnet of vpc.publicSubnets) {
    /// 
    /// }
    /// 
    /// // Iterate the private subnets
    /// for (let subnet of vpc.privateSubnets) {
    /// 
    /// }
    /// </summary>
    [JsiiClass(typeof(VpcNetwork), "@aws-cdk/aws-ec2.VpcNetwork", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkProps\",\"optional\":true}}]")]
    public class VpcNetwork : VpcNetworkRef
    {
        public VpcNetwork(Construct parent, string name, IVpcNetworkProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected VpcNetwork(ByRefValue reference): base(reference)
        {
        }

        protected VpcNetwork(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// The default CIDR range used when creating VPCs.
        /// This can be overridden using VpcNetworkProps when creating a VPCNetwork resource.
        /// e.g. new VpcResource(this, { cidr: '192.168.0.0./16' })
        /// </summary>
        [JsiiProperty("DEFAULT_CIDR_RANGE", "{\"primitive\":\"string\"}")]
        public static string DEFAULT_CIDR_RANGE
        {
            get;
        }

        = GetStaticProperty<string>(typeof(VpcNetwork));
        /// <summary>Identifier for this VPC</summary>
        [JsiiProperty("vpcId", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkId\"}")]
        public override VpcNetworkId VpcId
        {
            get => GetInstanceProperty<VpcNetworkId>();
        }

        /// <summary>List of public subnets in this VPC</summary>
        [JsiiProperty("publicSubnets", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetRef\"}}}")]
        public override VpcSubnetRef[] PublicSubnets
        {
            get => GetInstanceProperty<VpcSubnetRef[]>();
        }

        /// <summary>List of private subnets in this VPC</summary>
        [JsiiProperty("privateSubnets", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetRef\"}}}")]
        public override VpcSubnetRef[] PrivateSubnets
        {
            get => GetInstanceProperty<VpcSubnetRef[]>();
        }

        /// <returns>The IPv4 CidrBlock as returned by the VPC</returns>
        [JsiiProperty("cidr", "{\"fqn\":\"@aws-cdk/cdk.Token\"}")]
        public virtual Token Cidr
        {
            get => GetInstanceProperty<Token>();
        }
    }
}