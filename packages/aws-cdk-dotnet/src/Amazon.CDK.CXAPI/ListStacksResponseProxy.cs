using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    [JsiiInterfaceProxy(typeof(IListStacksResponse), "@aws-cdk/cx-api.ListStacksResponse")]
    internal class ListStacksResponseProxy : DeputyBase, IListStacksResponse
    {
        private ListStacksResponseProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("stacks", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.StackInfo\"}}}")]
        public virtual IStackInfo[] Stacks
        {
            get => GetInstanceProperty<IStackInfo[]>();
            set => SetInstanceProperty(value);
        }
    }
}