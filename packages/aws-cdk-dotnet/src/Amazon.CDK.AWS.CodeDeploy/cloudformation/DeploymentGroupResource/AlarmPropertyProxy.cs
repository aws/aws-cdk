using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation.DeploymentGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-alarm.html </remarks>
    [JsiiInterfaceProxy(typeof(IAlarmProperty), "@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.AlarmProperty")]
    internal class AlarmPropertyProxy : DeputyBase, IAlarmProperty
    {
        private AlarmPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DeploymentGroupResource.AlarmProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-alarm.html#cfn-codedeploy-deploymentgroup-alarm-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Name
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}