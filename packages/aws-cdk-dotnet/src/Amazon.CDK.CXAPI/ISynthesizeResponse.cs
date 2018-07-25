using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    [JsiiInterface(typeof(ISynthesizeResponse), "@aws-cdk/cx-api.SynthesizeResponse")]
    public interface ISynthesizeResponse
    {
        [JsiiProperty("stacks", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.SynthesizedStack\"}}}")]
        ISynthesizedStack[] Stacks
        {
            get;
            set;
        }

        [JsiiProperty("runtime", "{\"fqn\":\"@aws-cdk/cx-api.AppRuntime\",\"optional\":true}")]
        IAppRuntime Runtime
        {
            get;
            set;
        }
    }
}