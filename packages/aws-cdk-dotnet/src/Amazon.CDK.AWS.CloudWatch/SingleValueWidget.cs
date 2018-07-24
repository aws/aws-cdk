using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>A dashboard widget that displays the most recent value for every metric</summary>
    [JsiiClass(typeof(SingleValueWidget), "@aws-cdk/aws-cloudwatch.SingleValueWidget", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.SingleValueWidgetProps\"}}]")]
    public class SingleValueWidget : ConcreteWidget
    {
        public SingleValueWidget(ISingleValueWidgetProps props): base(new DeputyProps(new object[]{props}))
        {
        }

        protected SingleValueWidget(ByRefValue reference): base(reference)
        {
        }

        protected SingleValueWidget(DeputyProps props): base(props)
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