using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.StepFunctions.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html </remarks>
    [JsiiInterfaceProxy(typeof(IActivityResourceProps), "@aws-cdk/aws-stepfunctions.cloudformation.ActivityResourceProps")]
    internal class ActivityResourcePropsProxy : DeputyBase, IActivityResourceProps
    {
        private ActivityResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::StepFunctions::Activity.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-activity.html#cfn-stepfunctions-activity-name </remarks>
        [JsiiProperty("activityName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ActivityName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}