using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptruleset.html </remarks>
    [JsiiInterface(typeof(IReceiptRuleSetResourceProps), "@aws-cdk/aws-ses.cloudformation.ReceiptRuleSetResourceProps")]
    public interface IReceiptRuleSetResourceProps
    {
        /// <summary>``AWS::SES::ReceiptRuleSet.RuleSetName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptruleset.html#cfn-ses-receiptruleset-rulesetname </remarks>
        [JsiiProperty("ruleSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RuleSetName
        {
            get;
            set;
        }
    }
}