using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>A widget that doesn't display anything but takes up space</summary>
    [JsiiClass(typeof(Spacer), "@aws-cdk/aws-cloudwatch.Spacer", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.SpacerProps\"}}]")]
    public class Spacer : DeputyBase, IIWidget
    {
        public Spacer(ISpacerProps props): base(new DeputyProps(new object[]{props}))
        {
        }

        protected Spacer(ByRefValue reference): base(reference)
        {
        }

        protected Spacer(DeputyProps props): base(props)
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
        [JsiiMethod("position", null, "[{\"name\":\"_x\",\"type\":{\"primitive\":\"number\"}},{\"name\":\"_y\",\"type\":{\"primitive\":\"number\"}}]")]
        public virtual void Position(double _x, double _y)
        {
            InvokeInstanceVoidMethod(new object[]{_x, _y});
        }

        /// <summary>Return the widget JSON for use in the dashboard</summary>
        [JsiiMethod("toJson", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        public virtual object[] ToJson()
        {
            return InvokeInstanceMethod<object[]>(new object[]{});
        }
    }
}