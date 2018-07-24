using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda.cloudformation.AliasResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-aliasroutingconfiguration.html </remarks>
    [JsiiInterface(typeof(IAliasRoutingConfigurationProperty), "@aws-cdk/aws-lambda.cloudformation.AliasResource.AliasRoutingConfigurationProperty")]
    public interface IAliasRoutingConfigurationProperty
    {
        /// <summary>``AliasResource.AliasRoutingConfigurationProperty.AdditionalVersionWeights``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-aliasroutingconfiguration.html#cfn-lambda-alias-aliasroutingconfiguration-additionalversionweights </remarks>
        [JsiiProperty("additionalVersionWeights", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.AliasResource.VersionWeightProperty\"}]}}}}]}}")]
        object AdditionalVersionWeights
        {
            get;
            set;
        }
    }
}