using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    /// <summary>Reference to a queue</summary>
    [JsiiInterfaceProxy(typeof(IQueueRefProps), "@aws-cdk/aws-sqs.QueueRefProps")]
    internal class QueueRefPropsProxy : DeputyBase, IQueueRefProps
    {
        private QueueRefPropsProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("queueArn", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueArn\"}")]
        public virtual QueueArn QueueArn
        {
            get => GetInstanceProperty<QueueArn>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("queueUrl", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueUrl\"}")]
        public virtual QueueUrl QueueUrl
        {
            get => GetInstanceProperty<QueueUrl>();
            set => SetInstanceProperty(value);
        }
    }
}