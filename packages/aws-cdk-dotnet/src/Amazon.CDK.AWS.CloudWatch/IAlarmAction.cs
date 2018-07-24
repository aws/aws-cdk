using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Interface for objects that can be the targets of CloudWatch alarm actions</summary>
    public class IAlarmAction : DeputyBase, IIAlarmAction
    {
        /// <summary>Return the ARN that should be used for a CloudWatch Alarm action</summary>
        [JsiiProperty("alarmActionArn", "{\"fqn\":\"@aws-cdk/cdk.Arn\"}", true)]
        public Arn AlarmActionArn
        {
            get;
        }
    }
}