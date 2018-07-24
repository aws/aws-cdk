using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation.DomainNameResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-endpointconfiguration.html </remarks>
    public class EndpointConfigurationProperty : DeputyBase, Amazon.CDK.AWS.APIGateway.cloudformation.DomainNameResource.IEndpointConfigurationProperty
    {
        /// <summary>``DomainNameResource.EndpointConfigurationProperty.Types``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-endpointconfiguration.html#cfn-apigateway-domainname-endpointconfiguration-types </remarks>
        [JsiiProperty("types", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object Types
        {
            get;
            set;
        }
    }
}