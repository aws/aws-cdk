using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.CXAPI
{
    /// <summary>A complete synthesized stack</summary>
    [JsiiInterface(typeof(ISynthesizedStack), "@aws-cdk/cx-api.SynthesizedStack")]
    public interface ISynthesizedStack : IStackInfo
    {
        [JsiiProperty("missing", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.MissingContext\"}},\"optional\":true}")]
        IDictionary<string, IMissingContext> Missing
        {
            get;
            set;
        }

        [JsiiProperty("metadata", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.MetadataEntry\"}}}}}")]
        IDictionary<string, IMetadataEntry[]> Metadata
        {
            get;
            set;
        }

        [JsiiProperty("template", "{\"primitive\":\"any\"}")]
        object Template
        {
            get;
            set;
        }
    }
}