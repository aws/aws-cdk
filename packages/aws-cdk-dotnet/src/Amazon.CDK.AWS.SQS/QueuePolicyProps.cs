using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    public class QueuePolicyProps : DeputyBase, IQueuePolicyProps
    {
        /// <summary>The set of queues this policy applies to.</summary>
        [JsiiProperty("queues", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-sqs.QueueRef\"}}}", true)]
        public QueueRef[] Queues
        {
            get;
            set;
        }
    }
}