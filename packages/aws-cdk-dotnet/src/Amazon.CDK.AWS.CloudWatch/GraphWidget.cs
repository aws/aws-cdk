using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>A dashboard widget that displays MarkDown</summary>
    [JsiiClass(typeof(GraphWidget), "@aws-cdk/aws-cloudwatch.GraphWidget", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.GraphWidgetProps\"}}]")]
    public class GraphWidget : ConcreteWidget
    {
        public GraphWidget(IGraphWidgetProps props): base(new DeputyProps(new object[]{props}))
        {
        }

        protected GraphWidget(ByRefValue reference): base(reference)
        {
        }

        protected GraphWidget(DeputyProps props): base(props)
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