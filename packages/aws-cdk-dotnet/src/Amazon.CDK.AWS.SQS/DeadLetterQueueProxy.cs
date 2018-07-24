using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    /// <summary>Dead letter queue settings</summary>
    [JsiiInterfaceProxy(typeof(IDeadLetterQueue), "@aws-cdk/aws-sqs.DeadLetterQueue")]
    internal class DeadLetterQueueProxy : DeputyBase, IDeadLetterQueue
    {
        private DeadLetterQueueProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The dead-letter queue to which Amazon SQS moves messages after the value of maxReceiveCount is exceeded.</summary>
        [JsiiProperty("queue", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueRef\"}")]
        public virtual QueueRef Queue
        {
            get => GetInstanceProperty<QueueRef>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The number of times a message can be unsuccesfully dequeued before being moved to the dead-letter queue.</summary>
        [JsiiProperty("maxReceiveCount", "{\"primitive\":\"number\"}")]
        public virtual double MaxReceiveCount
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }
    }
}