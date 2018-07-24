using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.StepFunctions.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html </remarks>
    [JsiiInterface(typeof(IActivityResourceProps), "@aws-cdk/aws-stepfunctions.cloudformation.ActivityResourceProps")]
    public interface IActivityResourceProps
    {
        /// <summary>``AWS::StepFunctions::Activity.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html#cfn-stepfunctions-activity-name </remarks>
        [JsiiProperty("activityName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ActivityName
        {
            get;
            set;
        }
    }
}