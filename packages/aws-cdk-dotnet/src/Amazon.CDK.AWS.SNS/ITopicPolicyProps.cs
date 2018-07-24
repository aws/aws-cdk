using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    [JsiiInterface(typeof(ITopicPolicyProps), "@aws-cdk/aws-sns.TopicPolicyProps")]
    public interface ITopicPolicyProps
    {
        /// <summary>The set of topics this policy applies to.</summary>
        [JsiiProperty("topics", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-sns.TopicRef\"}}}")]
        TopicRef[] Topics
        {
            get;
            set;
        }
    }
}