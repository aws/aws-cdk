using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.IAM.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html </remarks>
    [JsiiClass(typeof(RoleResource_), "@aws-cdk/aws-iam.cloudformation.RoleResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.cloudformation.RoleResourceProps\"}}]")]
    public class RoleResource_ : Resource
    {
        public RoleResource_(Construct parent, string name, IRoleResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected RoleResource_(ByRefValue reference): base(reference)
        {
        }

        protected RoleResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(RoleResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("roleArn", "{\"fqn\":\"@aws-cdk/aws-iam.RoleArn\"}")]
        public virtual RoleArn RoleArn
        {
            get => GetInstanceProperty<RoleArn>();
        }

        /// <remarks>cloudformation_attribute: RoleId</remarks>
        [JsiiProperty("roleId", "{\"fqn\":\"@aws-cdk/aws-iam.RoleId\"}")]
        public virtual RoleId RoleId
        {
            get => GetInstanceProperty<RoleId>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}