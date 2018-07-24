using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-security-group.html </remarks>
    [JsiiClass(typeof(SecurityGroupResource_), "@aws-cdk/aws-ec2.cloudformation.SecurityGroupResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.SecurityGroupResourceProps\"}}]")]
    public class SecurityGroupResource_ : Resource
    {
        public SecurityGroupResource_(Construct parent, string name, ISecurityGroupResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected SecurityGroupResource_(ByRefValue reference): base(reference)
        {
        }

        protected SecurityGroupResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(SecurityGroupResource_));
        /// <remarks>cloudformation_attribute: GroupId</remarks>
        [JsiiProperty("securityGroupId", "{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupId\"}")]
        public virtual SecurityGroupId SecurityGroupId
        {
            get => GetInstanceProperty<SecurityGroupId>();
        }

        /// <remarks>cloudformation_attribute: VpcId</remarks>
        [JsiiProperty("securityGroupVpcId", "{\"fqn\":\"@aws-cdk/aws-ec2.SecurityGroupVpcId\"}")]
        public virtual SecurityGroupVpcId SecurityGroupVpcId
        {
            get => GetInstanceProperty<SecurityGroupVpcId>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}