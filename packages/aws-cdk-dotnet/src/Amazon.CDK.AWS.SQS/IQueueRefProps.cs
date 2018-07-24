using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    /// <summary>Reference to a queue</summary>
    [JsiiInterface(typeof(IQueueRefProps), "@aws-cdk/aws-sqs.QueueRefProps")]
    public interface IQueueRefProps
    {
        [JsiiProperty("queueArn", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueArn\"}")]
        QueueArn QueueArn
        {
            get;
            set;
        }

        [JsiiProperty("queueUrl", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueUrl\"}")]
        QueueUrl QueueUrl
        {
            get;
            set;
        }
    }
}