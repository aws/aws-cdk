using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    [JsiiInterfaceProxy(typeof(IListStacksRequest), "@aws-cdk/cx-api.ListStacksRequest")]
    internal class ListStacksRequestProxy : DeputyBase, IListStacksRequest
    {
        private ListStacksRequestProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("type", "{\"primitive\":\"string\"}")]
        public virtual string Type
        {
            get => GetInstanceProperty<string>();
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