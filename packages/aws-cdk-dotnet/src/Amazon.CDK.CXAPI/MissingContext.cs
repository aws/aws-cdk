using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    /// <summary>
    /// Represents a missing piece of context.
    /// (should have been an interface, but jsii still doesn't have support for structs).
    /// </summary>
    public class MissingContext : DeputyBase, IMissingContext
    {
        [JsiiProperty("provider", "{\"primitive\":\"string\"}", true)]
        public string Provider
        {
            get;
            set;
        }

        [JsiiProperty("scope", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}", true)]
        public string[] Scope
        {
            get;
            set;
        }

        [JsiiProperty("args", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}", true)]
        public string[] Args
        {
            get;
            set;
        }
    }
}