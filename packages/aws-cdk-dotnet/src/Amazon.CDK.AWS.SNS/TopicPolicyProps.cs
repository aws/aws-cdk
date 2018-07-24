using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    public class TopicPolicyProps : DeputyBase, ITopicPolicyProps
    {
        /// <summary>The set of topics this policy applies to.</summary>
        [JsiiProperty("topics", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-sns.TopicRef\"}}}", true)]
        public TopicRef[] Topics
        {
            get;
            set;
        }
    }
}