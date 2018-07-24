using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>The deployment environment for a stack.</summary>
    [JsiiInterfaceProxy(typeof(IEnvironment), "@aws-cdk/cdk.Environment")]
    internal class EnvironmentProxy : DeputyBase, IEnvironment
    {
        private EnvironmentProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The AWS accopunt ID for this environment.
        /// If not specified, the context parameter `default-account` is used.
        /// </summary>
        [JsiiProperty("account", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Account
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The AWS region for this environment.
        /// If not specified, the context parameter `default-region` is used.
        /// </summary>
        [JsiiProperty("region", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Region
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}