using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.CXAPI
{
    /// <summary>A complete synthesized stack</summary>
    [JsiiInterfaceProxy(typeof(ISynthesizedStack), "@aws-cdk/cx-api.SynthesizedStack")]
    internal class SynthesizedStackProxy : DeputyBase, ISynthesizedStack
    {
        private SynthesizedStackProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("missing", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.MissingContext\"}},\"optional\":true}")]
        public virtual IDictionary<string, IMissingContext> Missing
        {
            get => GetInstanceProperty<IDictionary<string, IMissingContext>>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("metadata", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.MetadataEntry\"}}}}}")]
        public virtual IDictionary<string, IMetadataEntry[]> Metadata
        {
            get => GetInstanceProperty<IDictionary<string, IMetadataEntry[]>>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("template", "{\"primitive\":\"any\"}")]
        public virtual object Template
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("environment", "{\"fqn\":\"@aws-cdk/cx-api.Environment\",\"optional\":true}")]
        public virtual IEnvironment Environment
        {
            get => GetInstanceProperty<IEnvironment>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        public virtual string Name
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}