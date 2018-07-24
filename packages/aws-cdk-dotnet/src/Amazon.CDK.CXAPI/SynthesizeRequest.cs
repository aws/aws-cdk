using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    public class SynthesizeRequest : DeputyBase, ISynthesizeRequest
    {
        [JsiiProperty("type", "{\"primitive\":\"string\"}", true)]
        public string Type
        {
            get;
            set;
        }

        [JsiiProperty("stacks", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}", true)]
        public string[] Stacks
        {
            get;
            set;
        }

        [JsiiProperty("context", "{\"primitive\":\"any\",\"optional\":true}", true)]
        public object Context
        {
            get;
            set;
        }
    }
}