using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    public class SynthesizeResponse : DeputyBase, ISynthesizeResponse
    {
        [JsiiProperty("stacks", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.SynthesizedStack\"}}}", true)]
        public ISynthesizedStack[] Stacks
        {
            get;
            set;
        }

        [JsiiProperty("runtime", "{\"fqn\":\"@aws-cdk/cx-api.AppRuntime\",\"optional\":true}", true)]
        public IAppRuntime Runtime
        {
            get;
            set;
        }
    }
}