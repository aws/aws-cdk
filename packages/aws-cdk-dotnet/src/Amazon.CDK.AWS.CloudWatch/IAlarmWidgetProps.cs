using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Properties for an AlarmWidget</summary>
    [JsiiInterface(typeof(IAlarmWidgetProps), "@aws-cdk/aws-cloudwatch.AlarmWidgetProps")]
    public interface IAlarmWidgetProps : IMetricWidgetProps
    {
        /// <summary>The alarm to show</summary>
        [JsiiProperty("alarm", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Alarm\"}")]
        Alarm Alarm
        {
            get;
            set;
        }

        /// <summary>Range of left Y axis</summary>
        /// <remarks>default: 0..automatic</remarks>
        [JsiiProperty("leftAxisRange", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.YAxisRange\",\"optional\":true}")]
        IYAxisRange LeftAxisRange
        {
            get;
            set;
        }
    }
}