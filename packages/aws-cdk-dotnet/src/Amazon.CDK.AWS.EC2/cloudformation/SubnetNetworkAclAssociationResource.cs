using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet-network-acl-assoc.html </remarks>
    [JsiiClass(typeof(SubnetNetworkAclAssociationResource), "@aws-cdk/aws-ec2.cloudformation.SubnetNetworkAclAssociationResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.SubnetNetworkAclAssociationResourceProps\"}}]")]
    public class SubnetNetworkAclAssociationResource : Resource
    {
        public SubnetNetworkAclAssociationResource(Construct parent, string name, ISubnetNetworkAclAssociationResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected SubnetNetworkAclAssociationResource(ByRefValue reference): base(reference)
        {
        }

        protected SubnetNetworkAclAssociationResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(SubnetNetworkAclAssociationResource));
        /// <remarks>cloudformation_attribute: AssociationId</remarks>
        [JsiiProperty("subnetNetworkAclAssociationAssociationId", "{\"fqn\":\"@aws-cdk/aws-ec2.SubnetNetworkAclAssociationAssociationId\"}")]
        public virtual SubnetNetworkAclAssociationAssociationId SubnetNetworkAclAssociationAssociationId
        {
            get => GetInstanceProperty<SubnetNetworkAclAssociationAssociationId>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}