using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiInterfaceProxy(typeof(IStackProps), "@aws-cdk/cdk.StackProps")]
    internal class StackPropsProxy : DeputyBase, IStackProps
    {
        private StackPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The AWS environment (account/region) where this stack will be deployed.
        /// 
        /// If not supplied, the `default-account` and `default-region` context parameters will be
        /// used. If they are undefined, it will not be possible to deploy the stack.
        /// </summary>
        [JsiiProperty("env", "{\"fqn\":\"@aws-cdk/cdk.Environment\",\"optional\":true}")]
        public virtual IEnvironment Env
        {
            get => GetInstanceProperty<IEnvironment>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Strategy for logical ID generation
        /// 
        /// Optional. If not supplied, the HashedNamingScheme will be used.
        /// </summary>
        [JsiiProperty("namingScheme", "{\"fqn\":\"@aws-cdk/cdk.IAddressingScheme\",\"optional\":true}")]
        public virtual IIAddressingScheme NamingScheme
        {
            get => GetInstanceProperty<IIAddressingScheme>();
            set => SetInstanceProperty(value);
        }
    }
}