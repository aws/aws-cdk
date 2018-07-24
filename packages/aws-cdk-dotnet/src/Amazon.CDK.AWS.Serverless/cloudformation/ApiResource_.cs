using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Serverless.cloudformation
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi </remarks>
    [JsiiClass(typeof(ApiResource_), "@aws-cdk/aws-serverless.cloudformation.ApiResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-serverless.cloudformation.ApiResourceProps\"}}]")]
    public class ApiResource_ : Resource
    {
        public ApiResource_(Construct parent, string name, IApiResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ApiResource_(ByRefValue reference): base(reference)
        {
        }

        protected ApiResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ApiResource_));
        /// <summary>The ``Transform`` a template must use in order to use this resource</summary>
        [JsiiProperty("requiredTransform", "{\"primitive\":\"string\"}")]
        public static string RequiredTransform
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ApiResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}