using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>A dashboard widget that displays MarkDown</summary>
    [JsiiClass(typeof(TextWidget), "@aws-cdk/aws-cloudwatch.TextWidget", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.TextWidgetProps\"}}]")]
    public class TextWidget : ConcreteWidget
    {
        public TextWidget(ITextWidgetProps props): base(new DeputyProps(new object[]{props}))
        {
        }

        protected TextWidget(ByRefValue reference): base(reference)
        {
        }

        protected TextWidget(DeputyProps props): base(props)
        {
        }

        /// <summary>Place the widget at a given position</summary>
        [JsiiMethod("position", null, "[{\"name\":\"x\",\"type\":{\"primitive\":\"number\"}},{\"name\":\"y\",\"type\":{\"primitive\":\"number\"}}]")]
        public override void Position(double x, double y)
        {
            InvokeInstanceVoidMethod(new object[]{x, y});
        }

        /// <summary>Return the widget JSON for use in the dashboard</summary>
        [JsiiMethod("toJson", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        public override object[] ToJson()
        {
            return InvokeInstanceMethod<object[]>(new object[]{});
        }
    }
}