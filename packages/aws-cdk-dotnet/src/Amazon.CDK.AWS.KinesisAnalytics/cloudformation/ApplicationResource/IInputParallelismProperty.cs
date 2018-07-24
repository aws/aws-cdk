using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation.ApplicationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputparallelism.html </remarks>
    [JsiiInterface(typeof(IInputParallelismProperty), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationResource.InputParallelismProperty")]
    public interface IInputParallelismProperty
    {
        /// <summary>``ApplicationResource.InputParallelismProperty.Count``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputparallelism.html#cfn-kinesisanalytics-application-inputparallelism-count </remarks>
        [JsiiProperty("count", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Count
        {
            get;
            set;
        }
    }
}