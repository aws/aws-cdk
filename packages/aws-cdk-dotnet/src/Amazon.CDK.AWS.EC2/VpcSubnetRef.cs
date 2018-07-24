using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>A new or imported VPC Subnet</summary>
    [JsiiClass(typeof(VpcSubnetRef), "@aws-cdk/aws-ec2.VpcSubnetRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class VpcSubnetRef : Construct, IIDependable
    {
        protected VpcSubnetRef(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected VpcSubnetRef(ByRefValue reference): base(reference)
        {
        }

        protected VpcSubnetRef(DeputyProps props): base(props)
        {
        }

        /// <summary>The Availability Zone the subnet is located in</summary>
        [JsiiProperty("availabilityZone", "{\"primitive\":\"string\"}")]
        public virtual string AvailabilityZone
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>The subnetId for this particular subnet</summary>
        [JsiiProperty("subnetId", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetId\"}")]
        public virtual VpcSubnetId SubnetId
        {
            get => GetInstanceProperty<VpcSubnetId>();
        }

        /// <summary>Parts of this VPC subnet</summary>
        [JsiiProperty("dependencyElements", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.IDependable\"}}}")]
        public virtual IIDependable[] DependencyElements
        {
            get => GetInstanceProperty<IIDependable[]>();
        }

        [JsiiMethod("import", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetRef\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.VpcSubnetRefProps\"}}]")]
        public static VpcSubnetRef Import(Construct parent, string name, IVpcSubnetRefProps props)
        {
            return InvokeStaticMethod<VpcSubnetRef>(typeof(VpcSubnetRef), new object[]{parent, name, props});
        }
    }
}