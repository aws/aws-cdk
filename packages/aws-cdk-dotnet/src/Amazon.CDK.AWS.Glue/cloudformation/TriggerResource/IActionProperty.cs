using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.Glue.cloudformation.TriggerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html </remarks>
    [JsiiInterface(typeof(IActionProperty), "@aws-cdk/aws-glue.cloudformation.TriggerResource.ActionProperty")]
    public interface IActionProperty
    {
        /// <summary>``TriggerResource.ActionProperty.Arguments``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html#cfn-glue-trigger-action-arguments </remarks>
        [JsiiProperty("arguments", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Arguments
        {
            get;
            set;
        }

        /// <summary>``TriggerResource.ActionProperty.JobName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html#cfn-glue-trigger-action-jobname </remarks>
        [JsiiProperty("jobName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object JobName
        {
            get;
            set;
        }
    }
}