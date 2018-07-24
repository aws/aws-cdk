using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// A policy prinicipal for canonicalUserIds - useful for S3 bucket policies that use
    /// Origin Access identities.
    /// 
    /// See https://docs.aws.amazon.com/general/latest/gr/acct-identifiers.html
    /// 
    /// and
    /// 
    /// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
    /// 
    /// for more details.
    /// </summary>
    [JsiiClass(typeof(CanonicalUserPrincipal), "@aws-cdk/cdk.CanonicalUserPrincipal", "[{\"name\":\"canonicalUserId\",\"type\":{\"primitive\":\"any\"}}]")]
    public class CanonicalUserPrincipal : PolicyPrincipal
    {
        public CanonicalUserPrincipal(object canonicalUserId): base(new DeputyProps(new object[]{canonicalUserId}))
        {
        }

        protected CanonicalUserPrincipal(ByRefValue reference): base(reference)
        {
        }

        protected CanonicalUserPrincipal(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("canonicalUserId", "{\"primitive\":\"any\"}")]
        public virtual object CanonicalUserId
        {
            get => GetInstanceProperty<object>();
        }

        /// <summary>Return the policy fragment that identifies this principal in a Policy.</summary>
        [JsiiMethod("policyFragment", "{\"fqn\":\"@aws-cdk/cdk.PrincipalPolicyFragment\"}", "[]")]
        public override PrincipalPolicyFragment PolicyFragment()
        {
            return InvokeInstanceMethod<PrincipalPolicyFragment>(new object[]{});
        }
    }
}