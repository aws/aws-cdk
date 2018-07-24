using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Batch.cloudformation.JobDefinitionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-retrystrategy.html </remarks>
    [JsiiInterface(typeof(IRetryStrategyProperty), "@aws-cdk/aws-batch.cloudformation.JobDefinitionResource.RetryStrategyProperty")]
    public interface IRetryStrategyProperty
    {
        /// <summary>``JobDefinitionResource.RetryStrategyProperty.Attempts``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-retrystrategy.html#cfn-batch-jobdefinition-retrystrategy-attempts </remarks>
        [JsiiProperty("attempts", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Attempts
        {
            get;
            set;
        }
    }
}