using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html </remarks>
    [JsiiClass(typeof(VPCResource), "@aws-cdk/aws-ec2.cloudformation.VPCResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.VPCResourceProps\"}}]")]
    public class VPCResource : Resource
    {
        public VPCResource(Construct parent, string name, IVPCResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected VPCResource(ByRefValue reference): base(reference)
        {
        }

        protected VPCResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(VPCResource));
        /// <remarks>cloudformation_attribute: CidrBlock</remarks>
        [JsiiProperty("vpcCidrBlock", "{\"fqn\":\"@aws-cdk/aws-ec2.VPCCidrBlock\"}")]
        public virtual VPCCidrBlock VpcCidrBlock
        {
            get => GetInstanceProperty<VPCCidrBlock>();
        }

        /// <remarks>cloudformation_attribute: CidrBlockAssociations</remarks>
        [JsiiProperty("vpcCidrBlockAssociations", "{\"fqn\":\"@aws-cdk/aws-ec2.VPCCidrBlockAssociations\"}")]
        public virtual VPCCidrBlockAssociations VpcCidrBlockAssociations
        {
            get => GetInstanceProperty<VPCCidrBlockAssociations>();
        }

        /// <remarks>cloudformation_attribute: DefaultNetworkAcl</remarks>
        [JsiiProperty("vpcDefaultNetworkAcl", "{\"fqn\":\"@aws-cdk/aws-ec2.VPCDefaultNetworkAcl\"}")]
        public virtual VPCDefaultNetworkAcl VpcDefaultNetworkAcl
        {
            get => GetInstanceProperty<VPCDefaultNetworkAcl>();
        }

        /// <remarks>cloudformation_attribute: DefaultSecurityGroup</remarks>
        [JsiiProperty("vpcDefaultSecurityGroup", "{\"fqn\":\"@aws-cdk/aws-ec2.VPCDefaultSecurityGroup\"}")]
        public virtual VPCDefaultSecurityGroup VpcDefaultSecurityGroup
        {
            get => GetInstanceProperty<VPCDefaultSecurityGroup>();
        }

        /// <remarks>cloudformation_attribute: Ipv6CidrBlocks</remarks>
        [JsiiProperty("vpcIpv6CidrBlocks", "{\"fqn\":\"@aws-cdk/aws-ec2.VPCIpv6CidrBlocks\"}")]
        public virtual VPCIpv6CidrBlocks VpcIpv6CidrBlocks
        {
            get => GetInstanceProperty<VPCIpv6CidrBlocks>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}