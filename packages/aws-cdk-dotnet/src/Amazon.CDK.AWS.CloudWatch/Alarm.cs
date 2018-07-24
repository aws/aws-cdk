using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>An alarm on a CloudWatch metric</summary>
    [JsiiClass(typeof(Alarm), "@aws-cdk/aws-cloudwatch.Alarm", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.AlarmProps\"}}]")]
    public class Alarm : Construct
    {
        public Alarm(Construct parent, string name, IAlarmProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Alarm(ByRefValue reference): base(reference)
        {
        }

        protected Alarm(DeputyProps props): base(props)
        {
        }

        /// <summary>ARN of this alarm</summary>
        [JsiiProperty("alarmArn", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.AlarmArn\"}")]
        public virtual AlarmArn AlarmArn
        {
            get => GetInstanceProperty<AlarmArn>();
        }

        /// <summary>The metric object this alarm was based on</summary>
        [JsiiProperty("metric", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}")]
        public virtual Metric Metric
        {
            get => GetInstanceProperty<Metric>();
        }

        /// <summary>
        /// Trigger this action if the alarm fires
        /// 
        /// Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
        /// </summary>
        [JsiiMethod("onAlarm", null, "[{\"name\":\"actions\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.IAlarmAction\"}}]")]
        public virtual void OnAlarm(IIAlarmAction actions)
        {
            InvokeInstanceVoidMethod(new object[]{actions});
        }

        /// <summary>
        /// Trigger this action if there is insufficient data to evaluate the alarm
        /// 
        /// Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
        /// </summary>
        [JsiiMethod("onInsufficientData", null, "[{\"name\":\"actions\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.IAlarmAction\"}}]")]
        public virtual void OnInsufficientData(IIAlarmAction actions)
        {
            InvokeInstanceVoidMethod(new object[]{actions});
        }

        /// <summary>
        /// Trigger this action if the alarm returns from breaching state into ok state
        /// 
        /// Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
        /// </summary>
        [JsiiMethod("onOk", null, "[{\"name\":\"actions\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.IAlarmAction\"}}]")]
        public virtual void OnOk(IIAlarmAction actions)
        {
            InvokeInstanceVoidMethod(new object[]{actions});
        }

        /// <summary>
        /// Turn this alarm into a horizontal annotation
        /// 
        /// This is useful if you want to represent an Alarm in a non-AlarmWidget.
        /// An `AlarmWidget` can directly show an alarm, but it can only show a
        /// single alarm and no other metrics. Instead, you can convert the alarm to
        /// a HorizontalAnnotation and add it as an annotation to another graph.
        /// 
        /// This might be useful if:
        /// 
        /// - You want to show multiple alarms inside a single graph, for example if
        ///    you have both a "small margin/long period" alarm as well as a
        ///    "large margin/short period" alarm.
        /// 
        /// - You want to show an Alarm line in a graph with multiple metrics in it.
        /// </summary>
        [JsiiMethod("toAnnotation", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.HorizontalAnnotation\"}", "[]")]
        public virtual IHorizontalAnnotation ToAnnotation()
        {
            return InvokeInstanceMethod<IHorizontalAnnotation>(new object[]{});
        }
    }
}