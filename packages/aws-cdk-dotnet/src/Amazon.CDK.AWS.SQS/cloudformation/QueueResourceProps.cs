using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.SQS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html </remarks>
    public class QueueResourceProps : DeputyBase, IQueueResourceProps
    {
        /// <summary>``AWS::SQS::Queue.ContentBasedDeduplication``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html#aws-sqs-queue-contentbaseddeduplication </remarks>
        [JsiiProperty("contentBasedDeduplication", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ContentBasedDeduplication
        {
            get;
            set;
        }

        /// <summary>``AWS::SQS::Queue.DelaySeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html#aws-sqs-queue-delayseconds </remarks>
        [JsiiProperty("delaySeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DelaySeconds
        {
            get;
            set;
        }

        /// <summary>``AWS::SQS::Queue.FifoQueue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html#aws-sqs-queue-fifoqueue </remarks>
        [JsiiProperty("fifoQueue", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object FifoQueue
        {
            get;
            set;
        }

        /// <summary>``AWS::SQS::Queue.KmsDataKeyReusePeriodSeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html#aws-sqs-queue-kmsdatakeyreuseperiodseconds </remarks>
        [JsiiProperty("kmsDataKeyReusePeriodSeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object KmsDataKeyReusePeriodSeconds
        {
            get;
            set;
        }

        /// <summary>``AWS::SQS::Queue.KmsMasterKeyId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html#aws-sqs-queue-kmsmasterkeyid </remarks>
        [JsiiProperty("kmsMasterKeyId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object KmsMasterKeyId
        {
            get;
            set;
        }

        /// <summary>``AWS::SQS::Queue.MaximumMessageSize``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html#aws-sqs-queue-maxmesgsize </remarks>
        [JsiiProperty("maximumMessageSize", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object MaximumMessageSize
        {
            get;
            set;
        }

        /// <summary>``AWS::SQS::Queue.MessageRetentionPeriod``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html#aws-sqs-queue-msgretentionperiod </remarks>
        [JsiiProperty("messageRetentionPeriod", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object MessageRetentionPeriod
        {
            get;
            set;
        }

        /// <summary>``AWS::SQS::Queue.QueueName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html#aws-sqs-queue-name </remarks>
        [JsiiProperty("queueName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object QueueName
        {
            get;
            set;
        }

        /// <summary>``AWS::SQS::Queue.ReceiveMessageWaitTimeSeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html#aws-sqs-queue-receivemsgwaittime </remarks>
        [JsiiProperty("receiveMessageWaitTimeSeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ReceiveMessageWaitTimeSeconds
        {
            get;
            set;
        }

        /// <summary>``AWS::SQS::Queue.RedrivePolicy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html#aws-sqs-queue-redrive </remarks>
        [JsiiProperty("redrivePolicy", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object RedrivePolicy
        {
            get;
            set;
        }

        /// <summary>``AWS::SQS::Queue.VisibilityTimeout``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html#aws-sqs-queue-visiblitytimeout </remarks>
        [JsiiProperty("visibilityTimeout", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object VisibilityTimeout
        {
            get;
            set;
        }
    }
}