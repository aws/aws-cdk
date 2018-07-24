using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    /// <summary>Properties for creating a new subscription</summary>
    [JsiiInterface(typeof(ISubscriptionProps), "@aws-cdk/aws-sns.SubscriptionProps")]
    public interface ISubscriptionProps
    {
        /// <summary>What type of subscription to add.</summary>
        [JsiiProperty("protocol", "{\"fqn\":\"@aws-cdk/aws-sns.SubscriptionProtocol\"}")]
        SubscriptionProtocol Protocol
        {
            get;
            set;
        }

        /// <summary>
        /// The subscription endpoint.
        /// 
        /// The meaning of this value depends on the value for 'protocol'.
        /// </summary>
        [JsiiProperty("endpoint", "{\"primitive\":\"any\"}")]
        object Endpoint
        {
            get;
            set;
        }

        /// <summary>The topic to subscribe to.</summary>
        [JsiiProperty("topic", "{\"fqn\":\"@aws-cdk/aws-sns.TopicRef\"}")]
        TopicRef Topic
        {
            get;
            set;
        }
    }
}