using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda.cloudformation.AliasResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-aliasroutingconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(IAliasRoutingConfigurationProperty), "@aws-cdk/aws-lambda.cloudformation.AliasResource.AliasRoutingConfigurationProperty")]
    internal class AliasRoutingConfigurationPropertyProxy : DeputyBase, IAliasRoutingConfigurationProperty
    {
        private AliasRoutingConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AliasResource.AliasRoutingConfigurationProperty.AdditionalVersionWeights``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-aliasroutingconfiguration.html#cfn-lambda-alias-aliasroutingconfiguration-additionalversionweights </remarks>
        [JsiiProperty("additionalVersionWeights", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.AliasResource.VersionWeightProperty\"}]}}}}]}}")]
        public virtual object AdditionalVersionWeights
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}