using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.CXAPI
{
    /// <summary>Information about the application's runtime components.</summary>
    public class AppRuntime : DeputyBase, IAppRuntime
    {
        /// <summary>The list of libraries loaded in the application, associated with their versions.</summary>
        [JsiiProperty("libraries", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"string\"}}}", true)]
        public IDictionary<string, string> Libraries
        {
            get;
            set;
        }
    }
}