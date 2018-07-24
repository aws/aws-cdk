using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    /// <summary>Options for email subscriptions.</summary>
    [JsiiInterfaceProxy(typeof(IEmailSubscriptionOptions), "@aws-cdk/aws-sns.EmailSubscriptionOptions")]
    internal class EmailSubscriptionOptionsProxy : DeputyBase, IEmailSubscriptionOptions
    {
        private EmailSubscriptionOptionsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// Indicates if the full notification JSON should be sent to the email
        /// address or just the message text.
        /// </summary>
        /// <remarks>default: Message text (false)</remarks>
        [JsiiProperty("json", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? Json
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }
    }
}