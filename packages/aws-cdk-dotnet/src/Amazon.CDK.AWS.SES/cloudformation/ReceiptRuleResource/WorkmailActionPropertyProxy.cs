using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.ReceiptRuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-workmailaction.html </remarks>
    [JsiiInterfaceProxy(typeof(IWorkmailActionProperty), "@aws-cdk/aws-ses.cloudformation.ReceiptRuleResource.WorkmailActionProperty")]
    internal class WorkmailActionPropertyProxy : DeputyBase, IWorkmailActionProperty
    {
        private WorkmailActionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ReceiptRuleResource.WorkmailActionProperty.OrganizationArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-workmailaction.html#cfn-ses-receiptrule-workmailaction-organizationarn </remarks>
        [JsiiProperty("organizationArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object OrganizationArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ReceiptRuleResource.WorkmailActionProperty.TopicArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-workmailaction.html#cfn-ses-receiptrule-workmailaction-topicarn </remarks>
        [JsiiProperty("topicArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object TopicArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}