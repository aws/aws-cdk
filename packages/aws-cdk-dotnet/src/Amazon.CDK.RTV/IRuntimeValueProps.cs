using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.RTV
{
    [JsiiInterface(typeof(IRuntimeValueProps), "@aws-cdk/rtv.RuntimeValueProps")]
    public interface IRuntimeValueProps
    {
        /// <summary>
        /// A namespace for the runtime value.
        /// It is recommended to use the name of the library/package that advertises this value.
        /// </summary>
        [JsiiProperty("package", "{\"primitive\":\"string\"}")]
        string Package
        {
            get;
            set;
        }

        /// <summary>The value to advertise. Can be either a primitive value or a token.</summary>
        [JsiiProperty("value", "{\"primitive\":\"any\"}")]
        object Value
        {
            get;
            set;
        }
    }
}