using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// Defines a secret value resolved from the Systems Manager (SSM) Parameter
    /// Store during deployment. This is useful for referencing values that you do
    /// not wish to include in your code base, such as secrets, passwords and keys.
    /// 
    /// This construct will add a CloudFormation parameter to your template bound to
    /// an SSM parameter (of type "AWS::SSM::Parameter::Value&lt;String&gt;"). Deployment
    /// will fail if the value doesn't exist in the target environment.
    /// 
    /// Important: For values other than secrets, prefer to use the
    /// `SSMParameterProvider` which resolves SSM parameter in design-time, and
    /// ensures that stack deployments are deterministic.
    /// </summary>
    [JsiiClass(typeof(SecretParameter), "@aws-cdk/cdk.SecretParameter", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/cdk.SecretProps\"}}]")]
    public class SecretParameter : Construct
    {
        public SecretParameter(Construct parent, string name, ISecretProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected SecretParameter(ByRefValue reference): base(reference)
        {
        }

        protected SecretParameter(DeputyProps props): base(props)
        {
        }

        /// <summary>A token for the secret value.</summary>
        [JsiiProperty("value", "{\"fqn\":\"@aws-cdk/cdk.Token\"}")]
        public virtual Token Value
        {
            get => GetInstanceProperty<Token>();
            set => SetInstanceProperty(value);
        }

        [JsiiMethod("resolve", "{\"primitive\":\"any\"}", "[]")]
        public virtual object Resolve()
        {
            return InvokeInstanceMethod<object>(new object[]{});
        }
    }
}