using Amazon.CDK;
using Amazon.CDK.AWS.Lambda;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Lambda.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html </remarks>
    [JsiiClass(typeof(VersionResource), "@aws-cdk/aws-lambda.cloudformation.VersionResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.VersionResourceProps\"}}]")]
    public class VersionResource : Resource
    {
        public VersionResource(Construct parent, string name, IVersionResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected VersionResource(ByRefValue reference): base(reference)
        {
        }

        protected VersionResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(VersionResource));
        /// <remarks>cloudformation_attribute: Version</remarks>
        [JsiiProperty("version", "{\"fqn\":\"@aws-cdk/aws-lambda.Version\"}")]
        public virtual Version Version
        {
            get => GetInstanceProperty<Version>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}