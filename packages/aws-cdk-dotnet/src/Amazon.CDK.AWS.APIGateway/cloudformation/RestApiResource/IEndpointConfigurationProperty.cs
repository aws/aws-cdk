using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation.RestApiResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-restapi-endpointconfiguration.html </remarks>
    [JsiiInterface(typeof(IEndpointConfigurationProperty), "@aws-cdk/aws-apigateway.cloudformation.RestApiResource.EndpointConfigurationProperty")]
    public interface IEndpointConfigurationProperty
    {
        /// <summary>``RestApiResource.EndpointConfigurationProperty.Types``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-restapi-endpointconfiguration.html#cfn-apigateway-restapi-endpointconfiguration-types </remarks>
        [JsiiProperty("types", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Types
        {
            get;
            set;
        }
    }
}