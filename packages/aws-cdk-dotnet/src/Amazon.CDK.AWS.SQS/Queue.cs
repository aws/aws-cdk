using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    /// <summary>A new Amazon SQS queue</summary>
    [JsiiClass(typeof(Queue), "@aws-cdk/aws-sqs.Queue", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-sqs.QueueProps\",\"optional\":true}}]")]
    public class Queue : QueueRef
    {
        public Queue(Construct parent, string name, IQueueProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Queue(ByRefValue reference): base(reference)
        {
        }

        protected Queue(DeputyProps props): base(props)
        {
        }

        /// <summary>The ARN of this queue</summary>
        [JsiiProperty("queueArn", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueArn\"}")]
        public override QueueArn QueueArn
        {
            get => GetInstanceProperty<QueueArn>();
        }

        /// <summary>The name of this queue</summary>
        [JsiiProperty("queueName", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueName\"}")]
        public virtual QueueName QueueName
        {
            get => GetInstanceProperty<QueueName>();
        }

        /// <summary>The URL of this queue</summary>
        [JsiiProperty("queueUrl", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueUrl\"}")]
        public override QueueUrl QueueUrl
        {
            get => GetInstanceProperty<QueueUrl>();
        }

        /// <summary>
        /// Controls automatic creation of policy objects.
        /// 
        /// Set by subclasses.
        /// </summary>
        [JsiiProperty("autoCreatePolicy", "{\"primitive\":\"boolean\"}")]
        protected override bool AutoCreatePolicy
        {
            get => GetInstanceProperty<bool>();
        }
    }
}