using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiClass(typeof(AccountRootPrincipal), "@aws-cdk/cdk.AccountRootPrincipal", "[]")]
    public class AccountRootPrincipal : AccountPrincipal
    {
        public AccountRootPrincipal(): base(new DeputyProps(new object[]{}))
        {
        }

        protected AccountRootPrincipal(ByRefValue reference): base(reference)
        {
        }

        protected AccountRootPrincipal(DeputyProps props): base(props)
        {
        }
    }
}