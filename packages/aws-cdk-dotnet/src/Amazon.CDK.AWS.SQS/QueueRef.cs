using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    /// <summary>Reference to a new or existing Amazon SQS queue</summary>
    [JsiiClass(typeof(QueueRef), "@aws-cdk/aws-sqs.QueueRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class QueueRef : Construct
    {
        protected QueueRef(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected QueueRef(ByRefValue reference): base(reference)
        {
        }

        protected QueueRef(DeputyProps props): base(props)
        {
        }

        /// <summary>The ARN of this queue</summary>
        [JsiiProperty("queueArn", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueArn\"}")]
        public virtual QueueArn QueueArn
        {
            get => GetInstanceProperty<QueueArn>();
        }

        /// <summary>The URL of this queue</summary>
        [JsiiProperty("queueUrl", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueUrl\"}")]
        public virtual QueueUrl QueueUrl
        {
            get => GetInstanceProperty<QueueUrl>();
        }

        /// <summary>
        /// Controls automatic creation of policy objects.
        /// 
        /// Set by subclasses.
        /// </summary>
        [JsiiProperty("autoCreatePolicy", "{\"primitive\":\"boolean\"}")]
        protected virtual bool AutoCreatePolicy
        {
            get => GetInstanceProperty<bool>();
        }

        /// <summary>Import an existing queue</summary>
        [JsiiMethod("import", null, "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-sqs.QueueRefProps\"}}]")]
        public static void Import(Construct parent, string name, IQueueRefProps props)
        {
            InvokeStaticVoidMethod(typeof(QueueRef), new object[]{parent, name, props});
        }

        /// <summary>Export a queue</summary>
        [JsiiMethod("export", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueRefProps\"}", "[]")]
        public virtual IQueueRefProps Export()
        {
            return InvokeInstanceMethod<IQueueRefProps>(new object[]{});
        }

        /// <summary>
        /// Adds a statement to the IAM resource policy associated with this queue.
        /// 
        /// If this queue was created in this stack (`new Queue`), a queue policy
        /// will be automatically created upon the first call to `addToPolicy`. If
        /// the queue is improted (`Queue.import`), then this is a no-op.
        /// </summary>
        [JsiiMethod("addToResourcePolicy", null, "[{\"name\":\"statement\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        public virtual void AddToResourcePolicy(PolicyStatement statement)
        {
            InvokeInstanceVoidMethod(new object[]{statement});
        }
    }
}