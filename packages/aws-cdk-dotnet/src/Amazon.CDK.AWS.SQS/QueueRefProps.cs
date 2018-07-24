using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    /// <summary>Reference to a queue</summary>
    public class QueueRefProps : DeputyBase, IQueueRefProps
    {
        [JsiiProperty("queueArn", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueArn\"}", true)]
        public QueueArn QueueArn
        {
            get;
            set;
        }

        [JsiiProperty("queueUrl", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueUrl\"}", true)]
        public QueueUrl QueueUrl
        {
            get;
            set;
        }
    }
}