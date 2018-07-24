using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    /// <summary>An metadata entry in the construct.</summary>
    public class MetadataEntry : DeputyBase, IMetadataEntry
    {
        /// <summary>The type of the metadata entry.</summary>
        [JsiiProperty("type", "{\"primitive\":\"string\"}", true)]
        public string Type
        {
            get;
            set;
        }

        /// <summary>The data.</summary>
        [JsiiProperty("data", "{\"primitive\":\"any\",\"optional\":true}", true)]
        public object Data
        {
            get;
            set;
        }

        /// <summary>A stack trace for when the entry was created.</summary>
        [JsiiProperty("trace", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}", true)]
        public string[] Trace
        {
            get;
            set;
        }
    }
}