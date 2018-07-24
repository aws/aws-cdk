using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK
{
    [JsiiInterface(typeof(IMappingProps), "@aws-cdk/cdk.MappingProps")]
    public interface IMappingProps
    {
        [JsiiProperty("mapping", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}},\"optional\":true}")]
        IDictionary<string, IDictionary<string, object>> Mapping
        {
            get;
            set;
        }
    }
}