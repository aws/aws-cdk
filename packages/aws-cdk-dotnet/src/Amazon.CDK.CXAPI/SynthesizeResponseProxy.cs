using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    [JsiiInterfaceProxy(typeof(ISynthesizeResponse), "@aws-cdk/cx-api.SynthesizeResponse")]
    internal class SynthesizeResponseProxy : DeputyBase, ISynthesizeResponse
    {
        private SynthesizeResponseProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("stacks", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.SynthesizedStack\"}}}")]
        public virtual ISynthesizedStack[] Stacks
        {
            get => GetInstanceProperty<ISynthesizedStack[]>();
            set => SetInstanceProperty(value);
        }
    }
}