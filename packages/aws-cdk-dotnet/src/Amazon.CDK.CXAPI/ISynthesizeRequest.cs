using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    [JsiiInterface(typeof(ISynthesizeRequest), "@aws-cdk/cx-api.SynthesizeRequest")]
    public interface ISynthesizeRequest
    {
        [JsiiProperty("type", "{\"primitive\":\"string\"}")]
        string Type
        {
            get;
            set;
        }

        [JsiiProperty("stacks", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}")]
        string[] Stacks
        {
            get;
            set;
        }

        [JsiiProperty("context", "{\"primitive\":\"any\",\"optional\":true}")]
        object Context
        {
            get;
            set;
        }
    }
}