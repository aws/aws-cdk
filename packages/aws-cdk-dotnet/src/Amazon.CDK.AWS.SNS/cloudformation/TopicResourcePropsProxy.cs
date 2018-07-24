using Amazon.CDK;
using Amazon.CDK.AWS.SNS.cloudformation.TopicResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic.html </remarks>
    [JsiiInterfaceProxy(typeof(ITopicResourceProps), "@aws-cdk/aws-sns.cloudformation.TopicResourceProps")]
    internal class TopicResourcePropsProxy : DeputyBase, ITopicResourceProps
    {
        private TopicResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::SNS::Topic.DisplayName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic.html#cfn-sns-topic-displayname </remarks>
        [JsiiProperty("displayName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object DisplayName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::SNS::Topic.Subscription``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic.html#cfn-sns-topic-subscription </remarks>
        [JsiiProperty("subscription", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-sns.cloudformation.TopicResource.SubscriptionProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object Subscription
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::SNS::Topic.TopicName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic.html#cfn-sns-topic-topicname </remarks>
        [JsiiProperty("topicName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object TopicName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}