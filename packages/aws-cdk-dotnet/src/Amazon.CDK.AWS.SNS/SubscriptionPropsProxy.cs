using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    /// <summary>Properties for creating a new subscription</summary>
    [JsiiInterfaceProxy(typeof(ISubscriptionProps), "@aws-cdk/aws-sns.SubscriptionProps")]
    internal class SubscriptionPropsProxy : DeputyBase, ISubscriptionProps
    {
        private SubscriptionPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>What type of subscription to add.</summary>
        [JsiiProperty("protocol", "{\"fqn\":\"@aws-cdk/aws-sns.SubscriptionProtocol\"}")]
        public virtual SubscriptionProtocol Protocol
        {
            get => GetInstanceProperty<SubscriptionProtocol>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The subscription endpoint.
        /// 
        /// The meaning of this value depends on the value for 'protocol'.
        /// </summary>
        [JsiiProperty("endpoint", "{\"primitive\":\"any\"}")]
        public virtual object Endpoint
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The topic to subscribe to.</summary>
        [JsiiProperty("topic", "{\"fqn\":\"@aws-cdk/aws-sns.TopicRef\"}")]
        public virtual TopicRef Topic
        {
            get => GetInstanceProperty<TopicRef>();
            set => SetInstanceProperty(value);
        }
    }
}