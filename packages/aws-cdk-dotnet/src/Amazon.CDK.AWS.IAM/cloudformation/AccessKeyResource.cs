using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.IAM.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-accesskey.html </remarks>
    [JsiiClass(typeof(AccessKeyResource), "@aws-cdk/aws-iam.cloudformation.AccessKeyResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.cloudformation.AccessKeyResourceProps\"}}]")]
    public class AccessKeyResource : Resource
    {
        public AccessKeyResource(Construct parent, string name, IAccessKeyResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected AccessKeyResource(ByRefValue reference): base(reference)
        {
        }

        protected AccessKeyResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(AccessKeyResource));
        /// <remarks>cloudformation_attribute: SecretAccessKey</remarks>
        [JsiiProperty("accessKeySecretAccessKey", "{\"fqn\":\"@aws-cdk/aws-iam.AccessKeySecretAccessKey\"}")]
        public virtual AccessKeySecretAccessKey AccessKeySecretAccessKey
        {
            get => GetInstanceProperty<AccessKeySecretAccessKey>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}