using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>A single dashboard widget</summary>
    [JsiiInterfaceProxy(typeof(IIWidget), "@aws-cdk/aws-cloudwatch.IWidget")]
    internal class IWidgetProxy : DeputyBase, IIWidget
    {
        private IWidgetProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The amount of horizontal grid units the widget will take up</summary>
        [JsiiProperty("width", "{\"primitive\":\"number\"}")]
        public virtual double Width
        {
            get => GetInstanceProperty<double>();
        }

        /// <summary>The amount of vertical grid units the widget will take up</summary>
        [JsiiProperty("height", "{\"primitive\":\"number\"}")]
        public virtual double Height
        {
            get => GetInstanceProperty<double>();
        }

        /// <summary>Place the widget at a given position</summary>
        [JsiiMethod("position", null, "[{\"name\":\"x\",\"type\":{\"primitive\":\"number\"}},{\"name\":\"y\",\"type\":{\"primitive\":\"number\"}}]")]
        public virtual void Position(double x, double y)
        {
            InvokeInstanceVoidMethod(new object[]{x, y});
        }

        /// <summary>Return the widget JSON for use in the dashboard</summary>
        [JsiiMethod("toJson", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        public virtual object[] ToJson()
        {
            return InvokeInstanceMethod<object[]>(new object[]{});
        }
    }
}