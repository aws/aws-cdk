using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.APIGateway.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationversion.html </remarks>
    [JsiiClass(typeof(DocumentationVersionResource), "@aws-cdk/aws-apigateway.cloudformation.DocumentationVersionResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-apigateway.cloudformation.DocumentationVersionResourceProps\"}}]")]
    public class DocumentationVersionResource : Amazon.CDK.Resource
    {
        public DocumentationVersionResource(Construct parent, string name, IDocumentationVersionResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected DocumentationVersionResource(ByRefValue reference): base(reference)
        {
        }

        protected DocumentationVersionResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(DocumentationVersionResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}