using Amazon.CDK;
using Amazon.CDK.AWS.SNS.cloudformation.TopicResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic.html </remarks>
    public class TopicResourceProps : DeputyBase, ITopicResourceProps
    {
        /// <summary>``AWS::SNS::Topic.DisplayName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic.html#cfn-sns-topic-displayname </remarks>
        [JsiiProperty("displayName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DisplayName
        {
            get;
            set;
        }

        /// <summary>``AWS::SNS::Topic.Subscription``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic.html#cfn-sns-topic-subscription </remarks>
        [JsiiProperty("subscription", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-sns.cloudformation.TopicResource.SubscriptionProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Subscription
        {
            get;
            set;
        }

        /// <summary>``AWS::SNS::Topic.TopicName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic.html#cfn-sns-topic-topicname </remarks>
        [JsiiProperty("topicName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object TopicName
        {
            get;
            set;
        }
    }
}