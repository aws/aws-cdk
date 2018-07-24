using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    /// <summary>Models an AWS execution environment, for use within the CDK toolkit.</summary>
    [JsiiInterfaceProxy(typeof(IEnvironment), "@aws-cdk/cx-api.Environment")]
    internal class EnvironmentProxy : DeputyBase, IEnvironment
    {
        private EnvironmentProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The arbitrary name of this environment (user-set, or at least user-meaningful) </summary>
        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        public virtual string Name
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The 12-digit AWS account ID for the account this environment deploys into </summary>
        [JsiiProperty("account", "{\"primitive\":\"string\"}")]
        public virtual string Account
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>The AWS region name where this environment deploys into </summary>
        [JsiiProperty("region", "{\"primitive\":\"string\"}")]
        public virtual string Region
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}