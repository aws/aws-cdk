using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    [JsiiInterfaceProxy(typeof(ISynthesizeRequest), "@aws-cdk/cx-api.SynthesizeRequest")]
    internal class SynthesizeRequestProxy : DeputyBase, ISynthesizeRequest
    {
        private SynthesizeRequestProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("type", "{\"primitive\":\"string\"}")]
        public virtual string Type
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("stacks", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}")]
        public virtual string[] Stacks
        {
            get => GetInstanceProperty<string[]>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("context", "{\"primitive\":\"any\",\"optional\":true}")]
        public virtual object Context
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}