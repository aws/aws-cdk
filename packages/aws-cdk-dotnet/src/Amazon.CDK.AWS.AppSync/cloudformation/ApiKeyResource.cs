using Amazon.CDK;
using Amazon.CDK.AWS.AppSync;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.AppSync.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-apikey.html </remarks>
    [JsiiClass(typeof(ApiKeyResource), "@aws-cdk/aws-appsync.cloudformation.ApiKeyResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-appsync.cloudformation.ApiKeyResourceProps\"}}]")]
    public class ApiKeyResource : Resource
    {
        public ApiKeyResource(Construct parent, string name, IApiKeyResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ApiKeyResource(ByRefValue reference): base(reference)
        {
        }

        protected ApiKeyResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ApiKeyResource));
        /// <remarks>cloudformation_attribute: ApiKey</remarks>
        [JsiiProperty("apiKey", "{\"fqn\":\"@aws-cdk/aws-appsync.ApiKey\"}")]
        public virtual ApiKey ApiKey
        {
            get => GetInstanceProperty<ApiKey>();
        }

        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("apiKeyArn", "{\"fqn\":\"@aws-cdk/aws-appsync.ApiKeyArn\"}")]
        public virtual ApiKeyArn ApiKeyArn
        {
            get => GetInstanceProperty<ApiKeyArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}