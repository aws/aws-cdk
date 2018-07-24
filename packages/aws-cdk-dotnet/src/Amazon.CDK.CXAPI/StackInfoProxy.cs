using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    /// <summary>Identifies and contains metadata about a stack</summary>
    [JsiiInterfaceProxy(typeof(IStackInfo), "@aws-cdk/cx-api.StackInfo")]
    internal class StackInfoProxy : DeputyBase, IStackInfo
    {
        private StackInfoProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("environment", "{\"fqn\":\"@aws-cdk/cx-api.Environment\",\"optional\":true}")]
        public virtual IEnvironment Environment
        {
            get => GetInstanceProperty<IEnvironment>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        public virtual string Name
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}