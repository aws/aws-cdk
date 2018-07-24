using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.RTV
{
    [JsiiInterfaceProxy(typeof(IRuntimeValueProps), "@aws-cdk/rtv.RuntimeValueProps")]
    internal class RuntimeValuePropsProxy : DeputyBase, IRuntimeValueProps
    {
        private RuntimeValuePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// A namespace for the runtime value.
        /// It is recommended to use the name of the library/package that advertises this value.
        /// </summary>
        [JsiiProperty("package", "{\"primitive\":\"string\"}")]
        public virtual string Package
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The value to advertise. Can be either a primitive value or a token.</summary>
        [JsiiProperty("value", "{\"primitive\":\"any\"}")]
        public virtual object Value
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}