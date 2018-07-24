using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// Base class for the model side of context providers
    /// 
    /// Instances of this class communicate with context provider plugins in the 'cdk
    /// toolkit' via context variables (input), outputting specialized queries for
    /// more context variables (output).
    /// 
    /// ContextProvider needs access to a Construct to hook into the context mechanism.
    /// </summary>
    [JsiiClass(typeof(ContextProvider), "@aws-cdk/cdk.ContextProvider", "[{\"name\":\"context\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}}]")]
    public class ContextProvider : DeputyBase
    {
        public ContextProvider(Construct context): base(new DeputyProps(new object[]{context}))
        {
        }

        protected ContextProvider(ByRefValue reference): base(reference)
        {
        }

        protected ContextProvider(DeputyProps props): base(props)
        {
        }

        /// <summary>Read a provider value, verifying it's a string</summary>
        /// <param name = "provider">The name of the context provider</param>
        /// <param name = "scope">The scope (e.g. account/region) for the value</param>
        /// <param name = "args">Any arguments</param>
        /// <param name = "defaultValue">The value to return if there is no value defined for this context key</param>
        [JsiiMethod("getStringValue", "{\"primitive\":\"string\"}", "[{\"name\":\"provider\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"scope\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}},\"optional\":true}},{\"name\":\"args\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}},{\"name\":\"defaultValue\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual string GetStringValue(string provider, string[] scope, string[] args, string defaultValue)
        {
            return InvokeInstanceMethod<string>(new object[]{provider, scope, args, defaultValue});
        }

        /// <summary>Read a provider value, verifying it's a list</summary>
        /// <param name = "provider">The name of the context provider</param>
        /// <param name = "scope">The scope (e.g. account/region) for the value</param>
        /// <param name = "args">Any arguments</param>
        /// <param name = "defaultValue">The value to return if there is no value defined for this context key</param>
        [JsiiMethod("getStringListValue", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}", "[{\"name\":\"provider\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"scope\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}},\"optional\":true}},{\"name\":\"args\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}},{\"name\":\"defaultValue\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}}]")]
        public virtual string[] GetStringListValue(string provider, string[] scope, string[] args, string[] defaultValue)
        {
            return InvokeInstanceMethod<string[]>(new object[]{provider, scope, args, defaultValue});
        }

        /// <summary>Helper function to wrap up account and region into a scope tuple</summary>
        [JsiiMethod("accountRegionScope", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}},\"optional\":true}", "[{\"name\":\"providerDescription\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual string[] AccountRegionScope(string providerDescription)
        {
            return InvokeInstanceMethod<string[]>(new object[]{providerDescription});
        }
    }
}