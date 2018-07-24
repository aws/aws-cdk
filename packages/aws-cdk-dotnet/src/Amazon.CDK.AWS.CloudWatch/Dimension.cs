using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>Metric dimension</summary>
    public class Dimension : DeputyBase, IDimension
    {
        /// <summary>Name of the dimension</summary>
        [JsiiProperty("name", "{\"primitive\":\"string\"}", true)]
        public string Name
        {
            get;
            set;
        }

        /// <summary>Value of the dimension</summary>
        [JsiiProperty("value", "{\"primitive\":\"any\"}", true)]
        public object Value
        {
            get;
            set;
        }
    }
}