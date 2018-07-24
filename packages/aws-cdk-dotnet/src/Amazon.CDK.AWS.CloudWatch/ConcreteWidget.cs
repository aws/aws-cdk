using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>
    /// A real CloudWatch widget that has its own fixed size and remembers its position
    /// 
    /// This is in contrast to other widgets which exist for layout purposes.
    /// </summary>
    [JsiiClass(typeof(ConcreteWidget), "@aws-cdk/aws-cloudwatch.ConcreteWidget", "[{\"name\":\"width\",\"type\":{\"primitive\":\"number\"}},{\"name\":\"height\",\"type\":{\"primitive\":\"number\"}}]")]
    public abstract class ConcreteWidget : DeputyBase, IIWidget
    {
        protected ConcreteWidget(double width, double height): base(new DeputyProps(new object[]{width, height}))
        {
        }

        protected ConcreteWidget(ByRefValue reference): base(reference)
        {
        }

        protected ConcreteWidget(DeputyProps props): base(props)
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

        [JsiiProperty("x", "{\"primitive\":\"number\",\"optional\":true}")]
        protected virtual double? X
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("y", "{\"primitive\":\"number\",\"optional\":true}")]
        protected virtual double? Y
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>Place the widget at a given position</summary>
        [JsiiMethod("position", null, "[{\"name\":\"x\",\"type\":{\"primitive\":\"number\"}},{\"name\":\"y\",\"type\":{\"primitive\":\"number\"}}]")]
        public virtual void Position(double x, double y)
        {
            InvokeInstanceVoidMethod(new object[]{x, y});
        }

        /// <summary>Return the widget JSON for use in the dashboard</summary>
        [JsiiMethod("toJson", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        public abstract object[] ToJson();
    }
}