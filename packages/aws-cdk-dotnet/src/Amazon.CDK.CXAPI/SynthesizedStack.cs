using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.CXAPI
{
    /// <summary>A complete synthesized stack</summary>
    public class SynthesizedStack : DeputyBase, ISynthesizedStack
    {
        [JsiiProperty("missing", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.MissingContext\"}},\"optional\":true}", true)]
        public IDictionary<string, IMissingContext> Missing
        {
            get;
            set;
        }

        [JsiiProperty("metadata", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.MetadataEntry\"}}}}}", true)]
        public IDictionary<string, IMetadataEntry[]> Metadata
        {
            get;
            set;
        }

        [JsiiProperty("template", "{\"primitive\":\"any\"}", true)]
        public object Template
        {
            get;
            set;
        }

        [JsiiProperty("environment", "{\"fqn\":\"@aws-cdk/cx-api.Environment\",\"optional\":true}", true)]
        public IEnvironment Environment
        {
            get;
            set;
        }

        [JsiiProperty("name", "{\"primitive\":\"string\"}", true)]
        public string Name
        {
            get;
            set;
        }
    }
}