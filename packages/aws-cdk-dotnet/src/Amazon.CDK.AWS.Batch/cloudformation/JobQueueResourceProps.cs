using Amazon.CDK;
using Amazon.CDK.AWS.Batch.cloudformation.JobQueueResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Batch.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html </remarks>
    public class JobQueueResourceProps : DeputyBase, IJobQueueResourceProps
    {
        /// <summary>``AWS::Batch::JobQueue.ComputeEnvironmentOrder``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html#cfn-batch-jobqueue-computeenvironmentorder </remarks>
        [JsiiProperty("computeEnvironmentOrder", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-batch.cloudformation.JobQueueResource.ComputeEnvironmentOrderProperty\"}]}}}}]}}", true)]
        public object ComputeEnvironmentOrder
        {
            get;
            set;
        }

        /// <summary>``AWS::Batch::JobQueue.Priority``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html#cfn-batch-jobqueue-priority </remarks>
        [JsiiProperty("priority", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Priority
        {
            get;
            set;
        }

        /// <summary>``AWS::Batch::JobQueue.JobQueueName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html#cfn-batch-jobqueue-jobqueuename </remarks>
        [JsiiProperty("jobQueueName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object JobQueueName
        {
            get;
            set;
        }

        /// <summary>``AWS::Batch::JobQueue.State``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html#cfn-batch-jobqueue-state </remarks>
        [JsiiProperty("state", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object State
        {
            get;
            set;
        }
    }
}