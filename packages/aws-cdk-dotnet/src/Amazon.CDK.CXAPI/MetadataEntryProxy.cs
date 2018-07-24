using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    /// <summary>An metadata entry in the construct.</summary>
    [JsiiInterfaceProxy(typeof(IMetadataEntry), "@aws-cdk/cx-api.MetadataEntry")]
    internal class MetadataEntryProxy : DeputyBase, IMetadataEntry
    {
        private MetadataEntryProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The type of the metadata entry.</summary>
        [JsiiProperty("type", "{\"primitive\":\"string\"}")]
        public virtual string Type
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The data.</summary>
        [JsiiProperty("data", "{\"primitive\":\"any\",\"optional\":true}")]
        public virtual object Data
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>A stack trace for when the entry was created.</summary>
        [JsiiProperty("trace", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}")]
        public virtual string[] Trace
        {
            get => GetInstanceProperty<string[]>();
            set => SetInstanceProperty(value);
        }
    }
}