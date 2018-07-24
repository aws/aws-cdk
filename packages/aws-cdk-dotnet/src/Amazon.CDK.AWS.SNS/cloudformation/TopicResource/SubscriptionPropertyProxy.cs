using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS.cloudformation.TopicResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-subscription.html </remarks>
    [JsiiInterfaceProxy(typeof(ISubscriptionProperty), "@aws-cdk/aws-sns.cloudformation.TopicResource.SubscriptionProperty")]
    internal class SubscriptionPropertyProxy : DeputyBase, ISubscriptionProperty
    {
        private SubscriptionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``TopicResource.SubscriptionProperty.Endpoint``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-subscription.html#cfn-sns-topic-subscription-endpoint </remarks>
        [JsiiProperty("endpoint", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Endpoint
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``TopicResource.SubscriptionProperty.Protocol``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-subscription.html#cfn-sns-topic-subscription-protocol </remarks>
        [JsiiProperty("protocol", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Protocol
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}