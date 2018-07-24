using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.APIGateway.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-gatewayresponse.html </remarks>
    [JsiiClass(typeof(GatewayResponseResource), "@aws-cdk/aws-apigateway.cloudformation.GatewayResponseResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-apigateway.cloudformation.GatewayResponseResourceProps\"}}]")]
    public class GatewayResponseResource : Amazon.CDK.Resource
    {
        public GatewayResponseResource(Construct parent, string name, IGatewayResponseResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected GatewayResponseResource(ByRefValue reference): base(reference)
        {
        }

        protected GatewayResponseResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(GatewayResponseResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}