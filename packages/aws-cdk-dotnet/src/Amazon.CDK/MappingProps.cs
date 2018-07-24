using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK
{
    public class MappingProps : DeputyBase, IMappingProps
    {
        [JsiiProperty("mapping", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}},\"optional\":true}", true)]
        public IDictionary<string, IDictionary<string, object>> Mapping
        {
            get;
            set;
        }
    }
}