using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>A single dashboard widget</summary>
    [JsiiInterface(typeof(IIWidget), "@aws-cdk/aws-cloudwatch.IWidget")]
    public interface IIWidget
    {
        /// <summary>The amount of horizontal grid units the widget will take up</summary>
        [JsiiProperty("width", "{\"primitive\":\"number\"}")]
        double Width
        {
            get;
        }

        /// <summary>The amount of vertical grid units the widget will take up</summary>
        [JsiiProperty("height", "{\"primitive\":\"number\"}")]
        double Height
        {
            get;
        }

        /// <summary>Place the widget at a given position</summary>
        [JsiiMethod("position", null, "[{\"name\":\"x\",\"type\":{\"primitive\":\"number\"}},{\"name\":\"y\",\"type\":{\"primitive\":\"number\"}}]")]
        void Position(double x, double y);
        /// <summary>Return the widget JSON for use in the dashboard</summary>
        [JsiiMethod("toJson", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        object[] ToJson();
    }
}