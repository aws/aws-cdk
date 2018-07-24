using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Batch.cloudformation.JobQueueResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobqueue-computeenvironmentorder.html </remarks>
    public class ComputeEnvironmentOrderProperty : DeputyBase, IComputeEnvironmentOrderProperty
    {
        /// <summary>``JobQueueResource.ComputeEnvironmentOrderProperty.ComputeEnvironment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobqueue-computeenvironmentorder.html#cfn-batch-jobqueue-computeenvironmentorder-computeenvironment </remarks>
        [JsiiProperty("computeEnvironment", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ComputeEnvironment
        {
            get;
            set;
        }

        /// <summary>``JobQueueResource.ComputeEnvironmentOrderProperty.Order``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobqueue-computeenvironmentorder.html#cfn-batch-jobqueue-computeenvironmentorder-order </remarks>
        [JsiiProperty("order", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Order
        {
            get;
            set;
        }
    }
}