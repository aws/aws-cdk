using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    public class ListStacksResponse : DeputyBase, IListStacksResponse
    {
        [JsiiProperty("stacks", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.StackInfo\"}}}", true)]
        public IStackInfo[] Stacks
        {
            get;
            set;
        }
    }
}