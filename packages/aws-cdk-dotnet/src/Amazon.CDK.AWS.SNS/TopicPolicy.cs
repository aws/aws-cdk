using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    /// <summary>Applies a policy to SNS topics.</summary>
    [JsiiClass(typeof(TopicPolicy), "@aws-cdk/aws-sns.TopicPolicy", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-sns.TopicPolicyProps\"}}]")]
    public class TopicPolicy : Construct
    {
        public TopicPolicy(Construct parent, string name, ITopicPolicyProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected TopicPolicy(ByRefValue reference): base(reference)
        {
        }

        protected TopicPolicy(DeputyProps props): base(props)
        {
        }

        /// <summary>The IAM policy document for this policy.</summary>
        [JsiiProperty("document", "{\"fqn\":\"@aws-cdk/cdk.PolicyDocument\"}")]
        public virtual PolicyDocument Document
        {
            get => GetInstanceProperty<PolicyDocument>();
        }
    }
}