using Amazon.CDK;
using Amazon.CDK.AWS.APIGateway.cloudformation.DocumentationPartResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationpart.html </remarks>
    [JsiiInterface(typeof(IDocumentationPartResourceProps), "@aws-cdk/aws-apigateway.cloudformation.DocumentationPartResourceProps")]
    public interface IDocumentationPartResourceProps
    {
        /// <summary>``AWS::ApiGateway::DocumentationPart.Location``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationpart.html#cfn-apigateway-documentationpart-location </remarks>
        [JsiiProperty("location", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-apigateway.cloudformation.DocumentationPartResource.LocationProperty\"}]}}")]
        object Location
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::DocumentationPart.Properties``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationpart.html#cfn-apigateway-documentationpart-properties </remarks>
        [JsiiProperty("properties", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Properties
        {
            get;
            set;
        }

        /// <summary>``AWS::ApiGateway::DocumentationPart.RestApiId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-documentationpart.html#cfn-apigateway-documentationpart-restapiid </remarks>
        [JsiiProperty("restApiId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object RestApiId
        {
            get;
            set;
        }
    }
}