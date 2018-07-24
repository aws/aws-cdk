using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet.html </remarks>
    [JsiiClass(typeof(SubnetResource), "@aws-cdk/aws-ec2.cloudformation.SubnetResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.SubnetResourceProps\"}}]")]
    public class SubnetResource : Resource
    {
        public SubnetResource(Construct parent, string name, ISubnetResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected SubnetResource(ByRefValue reference): base(reference)
        {
        }

        protected SubnetResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(SubnetResource));
        /// <remarks>cloudformation_attribute: AvailabilityZone</remarks>
        [JsiiProperty("subnetAvailabilityZone", "{\"fqn\":\"@aws-cdk/aws-ec2.SubnetAvailabilityZone\"}")]
        public virtual SubnetAvailabilityZone SubnetAvailabilityZone
        {
            get => GetInstanceProperty<SubnetAvailabilityZone>();
        }

        /// <remarks>cloudformation_attribute: Ipv6CidrBlocks</remarks>
        [JsiiProperty("subnetIpv6CidrBlocks", "{\"fqn\":\"@aws-cdk/aws-ec2.SubnetIpv6CidrBlocks\"}")]
        public virtual SubnetIpv6CidrBlocks SubnetIpv6CidrBlocks
        {
            get => GetInstanceProperty<SubnetIpv6CidrBlocks>();
        }

        /// <remarks>cloudformation_attribute: NetworkAclAssociationId</remarks>
        [JsiiProperty("subnetNetworkAclAssociationId", "{\"fqn\":\"@aws-cdk/aws-ec2.SubnetNetworkAclAssociationId\"}")]
        public virtual SubnetNetworkAclAssociationId SubnetNetworkAclAssociationId
        {
            get => GetInstanceProperty<SubnetNetworkAclAssociationId>();
        }

        /// <remarks>cloudformation_attribute: VpcId</remarks>
        [JsiiProperty("subnetVpcId", "{\"fqn\":\"@aws-cdk/aws-ec2.SubnetVpcId\"}")]
        public virtual SubnetVpcId SubnetVpcId
        {
            get => GetInstanceProperty<SubnetVpcId>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}