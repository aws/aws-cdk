using Amazon.CDK;
using Amazon.CDK.AWS.Batch.cloudformation.ComputeEnvironmentResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Batch.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html </remarks>
    [JsiiInterface(typeof(IComputeEnvironmentResourceProps), "@aws-cdk/aws-batch.cloudformation.ComputeEnvironmentResourceProps")]
    public interface IComputeEnvironmentResourceProps
    {
        /// <summary>``AWS::Batch::ComputeEnvironment.ServiceRole``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-servicerole </remarks>
        [JsiiProperty("serviceRole", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ServiceRole
        {
            get;
            set;
        }

        /// <summary>``AWS::Batch::ComputeEnvironment.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Type
        {
            get;
            set;
        }

        /// <summary>``AWS::Batch::ComputeEnvironment.ComputeEnvironmentName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-computeenvironmentname </remarks>
        [JsiiProperty("computeEnvironmentName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ComputeEnvironmentName
        {
            get;
            set;
        }

        /// <summary>``AWS::Batch::ComputeEnvironment.ComputeResources``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-computeresources </remarks>
        [JsiiProperty("computeResources", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-batch.cloudformation.ComputeEnvironmentResource.ComputeResourcesProperty\"}]},\"optional\":true}")]
        object ComputeResources
        {
            get;
            set;
        }

        /// <summary>``AWS::Batch::ComputeEnvironment.State``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-state </remarks>
        [JsiiProperty("state", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object State
        {
            get;
            set;
        }
    }
}