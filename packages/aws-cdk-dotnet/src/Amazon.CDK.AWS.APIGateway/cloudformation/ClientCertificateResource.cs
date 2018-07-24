using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.APIGateway.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-clientcertificate.html </remarks>
    [JsiiClass(typeof(ClientCertificateResource), "@aws-cdk/aws-apigateway.cloudformation.ClientCertificateResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-apigateway.cloudformation.ClientCertificateResourceProps\",\"optional\":true}}]")]
    public class ClientCertificateResource : Amazon.CDK.Resource
    {
        public ClientCertificateResource(Construct parent, string name, IClientCertificateResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ClientCertificateResource(ByRefValue reference): base(reference)
        {
        }

        protected ClientCertificateResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ClientCertificateResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}