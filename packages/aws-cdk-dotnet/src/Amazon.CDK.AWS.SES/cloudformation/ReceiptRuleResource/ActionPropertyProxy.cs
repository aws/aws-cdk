using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ReceiptRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html </remarks>
    [JsiiInterfaceProxy(typeof(IActionProperty), "@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.ActionProperty")]
    internal class ActionPropertyProxy : DeputyBase, IActionProperty
    {
        private ActionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.AddHeaderAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-addheaderaction </remarks>
        [JsiiProperty("addHeaderAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.AddHeaderActionProperty\"}]},\"optional\":true}")]
        public virtual object AddHeaderAction
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.BounceAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-bounceaction </remarks>
        [JsiiProperty("bounceAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.BounceActionProperty\"}]},\"optional\":true}")]
        public virtual object BounceAction
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.LambdaAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-lambdaaction </remarks>
        [JsiiProperty("lambdaAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.LambdaActionProperty\"}]},\"optional\":true}")]
        public virtual object LambdaAction
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.S3Action``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-s3action </remarks>
        [JsiiProperty("s3Action", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.S3ActionProperty\"}]},\"optional\":true}")]
        public virtual object S3Action
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.SNSAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-snsaction </remarks>
        [JsiiProperty("snsAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.SNSActionProperty\"}]},\"optional\":true}")]
        public virtual object SnsAction
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.StopAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-stopaction </remarks>
        [JsiiProperty("stopAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.StopActionProperty\"}]},\"optional\":true}")]
        public virtual object StopAction
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ReceiptRuleResource.ActionProperty.WorkmailAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-workmailaction </remarks>
        [JsiiProperty("workmailAction", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.WorkmailActionProperty\"}]},\"optional\":true}")]
        public virtual object WorkmailAction
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}