using Amazon.CDK;
using Amazon.CDK.AWS.SQS;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.SQS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html </remarks>
    [JsiiClass(typeof(QueueResource), "@aws-cdk/aws-sqs.cloudformation.QueueResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-sqs.cloudformation.QueueResourceProps\",\"optional\":true}}]")]
    public class QueueResource : Resource
    {
        public QueueResource(Construct parent, string name, IQueueResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected QueueResource(ByRefValue reference): base(reference)
        {
        }

        protected QueueResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(QueueResource));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("queueArn", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueArn\"}")]
        public virtual QueueArn QueueArn
        {
            get => GetInstanceProperty<QueueArn>();
        }

        /// <remarks>cloudformation_attribute: QueueName</remarks>
        [JsiiProperty("queueName", "{\"fqn\":\"@aws-cdk/aws-sqs.QueueName\"}")]
        public virtual QueueName QueueName
        {
            get => GetInstanceProperty<QueueName>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}