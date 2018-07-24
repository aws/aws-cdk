using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>A new or imported VPC</summary>
    [JsiiClass(typeof(VpcNetworkRef), "@aws-cdk/aws-ec2.VpcNetworkRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class VpcNetworkRef : Construct, IIDependable
    {
        protected VpcNetworkRef(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected VpcNetworkRef(ByRefValue reference): base(reference)
        {
        }

        protected VpcNetworkRef(DeputyProps props): base(props)
        {
        }

        /// <summary>Identifier for this VPC</summary>
        [JsiiProperty("vpcId", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkId\"}")]
        public virtual VpcNetworkId VpcId
        {
            get => GetInstanceProperty<VpcNetworkId>();
        }

        /// <summary>List of public subnets in this VPC</summary>
        [JsiiProperty("publicSubnets", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetRef\"}}}")]
        public virtual VpcSubnetRef[] PublicSubnets
        {
            get => GetInstanceProperty<VpcSubnetRef[]>();
        }

        /// <summary>List of private subnets in this VPC</summary>
        [JsiiProperty("privateSubnets", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetRef\"}}}")]
        public virtual VpcSubnetRef[] PrivateSubnets
        {
            get => GetInstanceProperty<VpcSubnetRef[]>();
        }

        /// <summary>Parts of the VPC that constitute full construction</summary>
        [JsiiProperty("dependencyElements", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.IDependable\"}}}")]
        public virtual IIDependable[] DependencyElements
        {
            get => GetInstanceProperty<IIDependable[]>();
        }

        /// <summary>Import an exported VPC</summary>
        [JsiiMethod("import", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRefProps\"}}]")]
        public static VpcNetworkRef Import(Construct parent, string name, IVpcNetworkRefProps props)
        {
            return InvokeStaticMethod<VpcNetworkRef>(typeof(VpcNetworkRef), new object[]{parent, name, props});
        }

        /// <summary>Return the subnets appropriate for the placement strategy</summary>
        [JsiiMethod("subnets", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetRef\"}}}", "[{\"name\":\"placement\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcPlacementStrategy\",\"optional\":true}}]")]
        public virtual VpcSubnetRef[] Subnets(IVpcPlacementStrategy placement)
        {
            return InvokeInstanceMethod<VpcSubnetRef[]>(new object[]{placement});
        }

        /// <summary>Export this VPC from the stack</summary>
        [JsiiMethod("export", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRefProps\"}", "[]")]
        public virtual IVpcNetworkRefProps Export()
        {
            return InvokeInstanceMethod<IVpcNetworkRefProps>(new object[]{});
        }
    }
}