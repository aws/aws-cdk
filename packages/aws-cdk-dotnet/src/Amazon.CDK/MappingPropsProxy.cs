using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK
{
    [JsiiInterfaceProxy(typeof(IMappingProps), "@aws-cdk/cdk.MappingProps")]
    internal class MappingPropsProxy : DeputyBase, IMappingProps
    {
        private MappingPropsProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("mapping", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}},\"optional\":true}")]
        public virtual IDictionary<string, IDictionary<string, object>> Mapping
        {
            get => GetInstanceProperty<IDictionary<string, IDictionary<string, object>>>();
            set => SetInstanceProperty(value);
        }
    }
}