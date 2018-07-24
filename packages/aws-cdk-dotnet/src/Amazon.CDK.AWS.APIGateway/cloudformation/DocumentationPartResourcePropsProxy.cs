using Amazon.CDK;
using Amazon.CDK.AWS.APIGateway.cloudformation.DocumentationPartResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationpart.html </remarks>
    [JsiiInterfaceProxy(typeof(IDocumentationPartResourceProps), "@aws-cdk/aws-apigateway.cloudformation.DocumentationPartResourceProps")]
    internal class DocumentationPartResourcePropsProxy : DeputyBase, IDocumentationPartResourceProps
    {
        private DocumentationPartResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::ApiGateway::DocumentationPart.Location``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationpart.html#cfn-apigateway-documentationpart-location </remarks>
        [JsiiProperty("location", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-apigateway.cloudformation.DocumentationPartResource.LocationProperty\"}]}}")]
        public virtual object Location
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::ApiGateway::DocumentationPart.Properties``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationpart.html#cfn-apigateway-documentationpart-properties </remarks>
        [JsiiProperty("properties", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Properties
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::ApiGateway::DocumentationPart.RestApiId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationpart.html#cfn-apigateway-documentationpart-restapiid </remarks>
        [JsiiProperty("restApiId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object RestApiId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}