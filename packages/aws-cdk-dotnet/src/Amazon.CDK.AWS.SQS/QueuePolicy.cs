using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    /// <summary>Applies a policy to SQS queues.</summary>
    [JsiiClass(typeof(QueuePolicy), "@aws-cdk/aws-sqs.QueuePolicy", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-sqs.QueuePolicyProps\"}}]")]
    public class QueuePolicy : Construct
    {
        public QueuePolicy(Construct parent, string name, IQueuePolicyProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected QueuePolicy(ByRefValue reference): base(reference)
        {
        }

        protected QueuePolicy(DeputyProps props): base(props)
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