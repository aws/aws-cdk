using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    /// <summary>Dead letter queue settings</summary>
    [JsiiInterface(typeof(IDeadLetterQueue), "@aws-cdk/aws-sqs.DeadLetterQueue")]
    public interface IDeadLetterQueue
    {
        /// <summary>The dead-letter queue to which Amazon SQS moves messages after the value of maxReceiveCount is exceeded.</summary>
        [JsiiProperty("queue", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueRef\"}")]
        QueueRef Queue
        {
            get;
            set;
        }

        /// <summary>The number of times a message can be unsuccesfully dequeued before being moved to the dead-letter queue.</summary>
        [JsiiProperty("maxReceiveCount", "{\"primitive\":\"number\"}")]
        double MaxReceiveCount
        {
            get;
            set;
        }
    }
}