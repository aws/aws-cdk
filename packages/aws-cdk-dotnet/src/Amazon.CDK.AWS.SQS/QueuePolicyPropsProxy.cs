using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SQS
{
    [JsiiInterfaceProxy(typeof(IQueuePolicyProps), "@aws-cdk/aws-sqs.QueuePolicyProps")]
    internal class QueuePolicyPropsProxy : DeputyBase, IQueuePolicyProps
    {
        private QueuePolicyPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The set of queues this policy applies to.</summary>
        [JsiiProperty("queues", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-sqs.QueueRef\"}}}")]
        public virtual QueueRef[] Queues
        {
            get => GetInstanceProperty<QueueRef[]>();
            set => SetInstanceProperty(value);
        }
    }
}