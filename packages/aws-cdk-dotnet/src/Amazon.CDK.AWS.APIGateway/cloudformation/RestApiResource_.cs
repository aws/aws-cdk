using Amazon.CDK;
using Amazon.CDK.AWS.APIGateway;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.APIGateway.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html </remarks>
    [JsiiClass(typeof(RestApiResource_), "@aws-cdk/aws-apigateway.cloudformation.RestApiResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-apigateway.cloudformation.RestApiResourceProps\",\"optional\":true}}]")]
    public class RestApiResource_ : Amazon.CDK.Resource
    {
        public RestApiResource_(Construct parent, string name, IRestApiResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected RestApiResource_(ByRefValue reference): base(reference)
        {
        }

        protected RestApiResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(RestApiResource_));
        /// <remarks>cloudformation_attribute: RootResourceId</remarks>
        [JsiiProperty("restApiRootResourceId", "{\"fqn\":\"@aws-cdk/aws-apigateway.RestApiRootResourceId\"}")]
        public virtual RestApiRootResourceId RestApiRootResourceId
        {
            get => GetInstanceProperty<RestApiRootResourceId>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}