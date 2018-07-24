using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// A token that represents a value that's expected to be a secret, like
    /// passwords and keys.
    /// 
    /// It is recommended to use the `SecretParameter` construct in order to import
    /// secret values from the SSM Parameter Store instead of storing them in your
    /// code.
    /// 
    /// However, you can also just pass in values, like any other token: `new Secret('bla')`
    /// </summary>
    [JsiiClass(typeof(Secret), "@aws-cdk/cdk.Secret", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class Secret : Token
    {
        public Secret(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected Secret(ByRefValue reference): base(reference)
        {
        }

        protected Secret(DeputyProps props): base(props)
        {
        }
    }
}