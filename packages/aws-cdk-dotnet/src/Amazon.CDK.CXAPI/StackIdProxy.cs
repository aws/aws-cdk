using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    /// <summary>Identifies a single stack</summary>
    [JsiiInterfaceProxy(typeof(IStackId), "@aws-cdk/cx-api.StackId")]
    internal class StackIdProxy : DeputyBase, IStackId
    {
        private StackIdProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        public virtual string Name
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}