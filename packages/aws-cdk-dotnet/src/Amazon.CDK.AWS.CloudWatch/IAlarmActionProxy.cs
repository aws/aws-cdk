using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Interface for objects that can be the targets of CloudWatch alarm actions</summary>
    [JsiiInterfaceProxy(typeof(IIAlarmAction), "@aws-cdk/aws-cloudwatch.IAlarmAction")]
    internal class IAlarmActionProxy : DeputyBase, IIAlarmAction
    {
        private IAlarmActionProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Return the ARN that should be used for a CloudWatch Alarm action</summary>
        [JsiiProperty("alarmActionArn", "{\"fqn\":\"@aws-cdk/cdk.Arn\"}")]
        public virtual Arn AlarmActionArn
        {
            get => GetInstanceProperty<Arn>();
        }
    }
}