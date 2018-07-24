using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiClass(typeof(AccountPrincipal), "@aws-cdk/cdk.AccountPrincipal", "[{\"name\":\"accountId\",\"type\":{\"primitive\":\"any\"}}]")]
    public class AccountPrincipal : ArnPrincipal
    {
        public AccountPrincipal(object accountId): base(new DeputyProps(new object[]{accountId}))
        {
        }

        protected AccountPrincipal(ByRefValue reference): base(reference)
        {
        }

        protected AccountPrincipal(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("accountId", "{\"primitive\":\"any\"}")]
        public virtual object AccountId
        {
            get => GetInstanceProperty<object>();
        }
    }
}