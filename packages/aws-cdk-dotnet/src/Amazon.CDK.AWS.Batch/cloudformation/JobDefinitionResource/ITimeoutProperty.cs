using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Batch.cloudformation.JobDefinitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-timeout.html </remarks>
    [JsiiInterface(typeof(ITimeoutProperty), "@aws-cdk/aws-batch.cloudformation.JobDefinitionResource.TimeoutProperty")]
    public interface ITimeoutProperty
    {
        /// <summary>``JobDefinitionResource.TimeoutProperty.AttemptDurationSeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-timeout.html#cfn-batch-jobdefinition-timeout-attemptdurationseconds </remarks>
        [JsiiProperty("attemptDurationSeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AttemptDurationSeconds
        {
            get;
            set;
        }
    }
}