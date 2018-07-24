using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ReceiptRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html </remarks>
    public class ActionProperty : DeputyBase, IActionProperty
    {
        /// <summary>``ReceiptRuleResource.ActionProperty.AddHeaderAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-addheaderaction </remarks>
        [JsiiProperty("addHeaderAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.AddHeaderActionProperty\"}]},\"optional\":true}", true)]
        public object AddHeaderAction
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.BounceAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-bounceaction </remarks>
        [JsiiProperty("bounceAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.BounceActionProperty\"}]},\"optional\":true}", true)]
        public object BounceAction
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.LambdaAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-lambdaaction </remarks>
        [JsiiProperty("lambdaAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.LambdaActionProperty\"}]},\"optional\":true}", true)]
        public object LambdaAction
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.S3Action``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-s3action </remarks>
        [JsiiProperty("s3Action", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.S3ActionProperty\"}]},\"optional\":true}", true)]
        public object S3Action
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.SNSAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-snsaction </remarks>
        [JsiiProperty("snsAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.SNSActionProperty\"}]},\"optional\":true}", true)]
        public object SnsAction
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.StopAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-stopaction </remarks>
        [JsiiProperty("stopAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.StopActionProperty\"}]},\"optional\":true}", true)]
        public object StopAction
        {
            get;
            set;
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.WorkmailAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-workmailaction </remarks>
        [JsiiProperty("workmailAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.WorkmailActionProperty\"}]},\"optional\":true}", true)]
        public object WorkmailAction
        {
            get;
            set;
        }
    }
}