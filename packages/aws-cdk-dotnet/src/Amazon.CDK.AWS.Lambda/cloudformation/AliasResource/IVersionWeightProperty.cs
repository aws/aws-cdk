using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda.cloudformation.AliasResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-versionweight.html </remarks>
    [JsiiInterface(typeof(IVersionWeightProperty), "@aws-cdk/aws-lambda.cloudformation.AliasResource.VersionWeightProperty")]
    public interface IVersionWeightProperty
    {
        /// <summary>``AliasResource.VersionWeightProperty.FunctionVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-versionweight.html#cfn-lambda-alias-versionweight-functionversion </remarks>
        [JsiiProperty("functionVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object FunctionVersion
        {
            get;
            set;
        }

        /// <summary>``AliasResource.VersionWeightProperty.FunctionWeight``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-alias-versionweight.html#cfn-lambda-alias-versionweight-functionweight </remarks>
        [JsiiProperty("functionWeight", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object FunctionWeight
        {
            get;
            set;
        }
    }
}