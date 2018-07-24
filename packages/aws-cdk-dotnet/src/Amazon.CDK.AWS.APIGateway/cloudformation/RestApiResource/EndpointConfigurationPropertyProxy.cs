using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation.RestApiResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-restapi-endpointconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(IEndpointConfigurationProperty), "@aws-cdk/aws-apigateway.cloudformation.RestApiResource.EndpointConfigurationProperty")]
    internal class EndpointConfigurationPropertyProxy : DeputyBase, Amazon.CDK.AWS.APIGateway.cloudformation.RestApiResource.IEndpointConfigurationProperty
    {
        private EndpointConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``RestApiResource.EndpointConfigurationProperty.Types``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-restapi-endpointconfiguration.html#cfn-apigateway-restapi-endpointconfiguration-types </remarks>
        [JsiiProperty("types", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        public virtual object Types
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}