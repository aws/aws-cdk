using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceCatalog.cloudformation.CloudFormationProvisionedProductResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningparameter.html </remarks>
    [JsiiInterfaceProxy(typeof(IProvisioningParameterProperty), "@aws-cdk/aws-servicecatalog.cloudformation.CloudFormationProvisionedProductResource.ProvisioningParameterProperty")]
    internal class ProvisioningParameterPropertyProxy : DeputyBase, IProvisioningParameterProperty
    {
        private ProvisioningParameterPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``CloudFormationProvisionedProductResource.ProvisioningParameterProperty.Key``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningparameter.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningparameter-key </remarks>
        [JsiiProperty("key", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Key
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``CloudFormationProvisionedProductResource.ProvisioningParameterProperty.Value``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningparameter.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningparameter-value </remarks>
        [JsiiProperty("value", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Value
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}