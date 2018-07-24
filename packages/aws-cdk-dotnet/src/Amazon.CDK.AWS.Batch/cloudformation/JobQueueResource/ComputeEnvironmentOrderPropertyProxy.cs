using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Batch.cloudformation.JobQueueResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobqueue-computeenvironmentorder.html </remarks>
    [JsiiInterfaceProxy(typeof(IComputeEnvironmentOrderProperty), "@aws-cdk/aws-batch.cloudformation.JobQueueResource.ComputeEnvironmentOrderProperty")]
    internal class ComputeEnvironmentOrderPropertyProxy : DeputyBase, IComputeEnvironmentOrderProperty
    {
        private ComputeEnvironmentOrderPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``JobQueueResource.ComputeEnvironmentOrderProperty.ComputeEnvironment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobqueue-computeenvironmentorder.html#cfn-batch-jobqueue-computeenvironmentorder-computeenvironment </remarks>
        [JsiiProperty("computeEnvironment", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ComputeEnvironment
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``JobQueueResource.ComputeEnvironmentOrderProperty.Order``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobqueue-computeenvironmentorder.html#cfn-batch-jobqueue-computeenvironmentorder-order </remarks>
        [JsiiProperty("order", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Order
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}