using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Display the metric associated with an alarm, including the alarm line</summary>
    [JsiiClass(typeof(AlarmWidget), "@aws-cdk/aws-cloudwatch.AlarmWidget", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.AlarmWidgetProps\"}}]")]
    public class AlarmWidget : ConcreteWidget
    {
        public AlarmWidget(IAlarmWidgetProps props): base(new DeputyProps(new object[]{props}))
        {
        }

        protected AlarmWidget(ByRefValue reference): base(reference)
        {
        }

        protected AlarmWidget(DeputyProps props): base(props)
        {
        }

        /// <summary>Return the widget JSON for use in the dashboard</summary>
        [JsiiMethod("toJson", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        public override object[] ToJson()
        {
            return InvokeInstanceMethod<object[]>(new object[]{});
        }
    }
}