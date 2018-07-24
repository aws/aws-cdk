using Amazon.CDK;
using Amazon.CDK.AWS.Batch.cloudformation.JobQueueResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Batch.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html </remarks>
    [JsiiInterface(typeof(IJobQueueResourceProps), "@aws-cdk/aws-batch.cloudformation.JobQueueResourceProps")]
    public interface IJobQueueResourceProps
    {
        /// <summary>``AWS::Batch::JobQueue.ComputeEnvironmentOrder``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html#cfn-batch-jobqueue-computeenvironmentorder </remarks>
        [JsiiProperty("computeEnvironmentOrder", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-batch.cloudformation.JobQueueResource.ComputeEnvironmentOrderProperty\"}]}}}}]}}")]
        object ComputeEnvironmentOrder
        {
            get;
            set;
        }

        /// <summary>``AWS::Batch::JobQueue.Priority``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html#cfn-batch-jobqueue-priority </remarks>
        [JsiiProperty("priority", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Priority
        {
            get;
            set;
        }

        /// <summary>``AWS::Batch::JobQueue.JobQueueName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html#cfn-batch-jobqueue-jobqueuename </remarks>
        [JsiiProperty("jobQueueName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object JobQueueName
        {
            get;
            set;
        }

        /// <summary>``AWS::Batch::JobQueue.State``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html#cfn-batch-jobqueue-state </remarks>
        [JsiiProperty("state", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object State
        {
            get;
            set;
        }
    }
}