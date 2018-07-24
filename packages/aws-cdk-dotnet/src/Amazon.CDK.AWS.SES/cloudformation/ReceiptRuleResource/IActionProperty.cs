using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ReceiptRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html </remarks>
    [JsiiInterface(typeof(IActionProperty), "@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.ActionProperty")]
    public interface IActionProperty
    {
        /// <summary>``ReceiptRuleResource.ActionProperty.AddHeaderAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-addheaderaction </remarks>
        [JsiiProperty("addHeaderAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.AddHeaderActionProperty\"}]},\"optional\":true}")]
        object AddHeaderAction
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.BounceAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-bounceaction </remarks>
        [JsiiProperty("bounceAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.BounceActionProperty\"}]},\"optional\":true}")]
        object BounceAction
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.LambdaAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-lambdaaction </remarks>
        [JsiiProperty("lambdaAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.LambdaActionProperty\"}]},\"optional\":true}")]
        object LambdaAction
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.S3Action``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-s3action </remarks>
        [JsiiProperty("s3Action", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.S3ActionProperty\"}]},\"optional\":true}")]
        object S3Action
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.SNSAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-snsaction </remarks>
        [JsiiProperty("snsAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.SNSActionProperty\"}]},\"optional\":true}")]
        object SnsAction
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.StopAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-stopaction </remarks>
        [JsiiProperty("stopAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.StopActionProperty\"}]},\"optional\":true}")]
        object StopAction
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.WorkmailAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-workmailaction </remarks>
        [JsiiProperty("workmailAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.WorkmailActionProperty\"}]},\"optional\":true}")]
        object WorkmailAction
        {
            get;
            set;
        }
    }
}