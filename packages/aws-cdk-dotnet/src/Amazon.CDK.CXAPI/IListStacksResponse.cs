using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    [JsiiInterface(typeof(IListStacksResponse), "@aws-cdk/cx-api.ListStacksResponse")]
    public interface IListStacksResponse
    {
        [JsiiProperty("stacks", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.StackInfo\"}}}")]
        IStackInfo[] Stacks
        {
            get;
            set;
        }
    }
}