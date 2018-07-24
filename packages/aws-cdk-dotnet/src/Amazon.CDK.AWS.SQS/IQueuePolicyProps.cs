using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    [JsiiInterface(typeof(IQueuePolicyProps), "@aws-cdk/aws-sqs.QueuePolicyProps")]
    public interface IQueuePolicyProps
    {
        /// <summary>The set of queues this policy applies to.</summary>
        [JsiiProperty("queues", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-sqs.QueueRef\"}}}")]
        QueueRef[] Queues
        {
            get;
            set;
        }
    }
}