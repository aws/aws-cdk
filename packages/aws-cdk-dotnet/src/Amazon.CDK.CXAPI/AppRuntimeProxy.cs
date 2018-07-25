using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.CXAPI
{
    /// <summary>Information about the application's runtime components.</summary>
    [JsiiInterfaceProxy(typeof(IAppRuntime), "@aws-cdk/cx-api.AppRuntime")]
    internal class AppRuntimeProxy : DeputyBase, IAppRuntime
    {
        private AppRuntimeProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The list of libraries loaded in the application, associated with their versions.</summary>
        [JsiiProperty("libraries", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"string\"}}}")]
        public virtual IDictionary<string, string> Libraries
        {
            get => GetInstanceProperty<IDictionary<string, string>>();
            set => SetInstanceProperty(value);
        }
    }
}