using Amazon.CDK;
using Amazon.CDK.AWS.KMS;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.KMS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kms-key.html </remarks>
    [JsiiClass(typeof(KeyResource), "@aws-cdk/aws-kms.cloudformation.KeyResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-kms.cloudformation.KeyResourceProps\"}}]")]
    public class KeyResource : Resource
    {
        public KeyResource(Construct parent, string name, IKeyResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected KeyResource(ByRefValue reference): base(reference)
        {
        }

        protected KeyResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(KeyResource));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("keyArn", "{\"fqn\":\"@aws-cdk/aws-kms.KeyArn\"}")]
        public virtual KeyArn KeyArn
        {
            get => GetInstanceProperty<KeyArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}