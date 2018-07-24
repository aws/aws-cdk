using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.RTV
{
    public class RuntimeValueProps : DeputyBase, IRuntimeValueProps
    {
        /// <summary>
        /// A namespace for the runtime value.
        /// It is recommended to use the name of the library/package that advertises this value.
        /// </summary>
        [JsiiProperty("package", "{\"primitive\":\"string\"}", true)]
        public string Package
        {
            get;
            set;
        }

        /// <summary>The value to advertise. Can be either a primitive value or a token.</summary>
        [JsiiProperty("value", "{\"primitive\":\"any\"}", true)]
        public object Value
        {
            get;
            set;
        }
    }
}