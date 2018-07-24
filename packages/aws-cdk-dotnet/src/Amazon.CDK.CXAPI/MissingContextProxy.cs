using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    /// <summary>
    /// Represents a missing piece of context.
    /// (should have been an interface, but jsii still doesn't have support for structs).
    /// </summary>
    [JsiiInterfaceProxy(typeof(IMissingContext), "@aws-cdk/cx-api.MissingContext")]
    internal class MissingContextProxy : DeputyBase, IMissingContext
    {
        private MissingContextProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("provider", "{\"primitive\":\"string\"}")]
        public virtual string Provider
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("scope", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}")]
        public virtual string[] Scope
        {
            get => GetInstanceProperty<string[]>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("args", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}")]
        public virtual string[] Args
        {
            get => GetInstanceProperty<string[]>();
            set => SetInstanceProperty(value);
        }
    }
}