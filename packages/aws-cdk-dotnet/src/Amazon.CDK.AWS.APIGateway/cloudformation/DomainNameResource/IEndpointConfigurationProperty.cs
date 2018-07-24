using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation.DomainNameResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-endpointconfiguration.html </remarks>
    [JsiiInterface(typeof(IEndpointConfigurationProperty), "@aws-cdk/aws-apigateway.cloudformation.DomainNameResource.EndpointConfigurationProperty")]
    public interface IEndpointConfigurationProperty
    {
        /// <summary>``DomainNameResource.EndpointConfigurationProperty.Types``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-endpointconfiguration.html#cfn-apigateway-domainname-endpointconfiguration-types </remarks>
        [JsiiProperty("types", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Types
        {
            get;
            set;
        }
    }
}