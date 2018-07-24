using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>
    /// A widget that contains other widgets in a vertical column
    /// 
    /// Widgets will be laid out next to each other
    /// </summary>
    [JsiiClass(typeof(Column), "@aws-cdk/aws-cloudwatch.Column", "[{\"name\":\"widgets\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.IWidget\"}}]")]
    public class Column : DeputyBase, IIWidget
    {
        public Column(IIWidget widgets): base(new DeputyProps(new object[]{widgets}))
        {
        }

        protected Column(ByRefValue reference): base(reference)
        {
        }

        protected Column(DeputyProps props): base(props)
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