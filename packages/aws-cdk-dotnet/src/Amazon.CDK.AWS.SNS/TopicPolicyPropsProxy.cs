using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    [JsiiInterfaceProxy(typeof(ITopicPolicyProps), "@aws-cdk/aws-sns.TopicPolicyProps")]
    internal class TopicPolicyPropsProxy : DeputyBase, ITopicPolicyProps
    {
        private TopicPolicyPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The set of topics this policy applies to.</summary>
        [JsiiProperty("topics", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-sns.TopicRef\"}}}")]
        public virtual TopicRef[] Topics
        {
            get => GetInstanceProperty<TopicRef[]>();
            set => SetInstanceProperty(value);
        }
    }
}