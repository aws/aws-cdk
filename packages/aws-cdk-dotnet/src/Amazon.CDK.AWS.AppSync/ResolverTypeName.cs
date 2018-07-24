using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync
{
    [JsiiClass(typeof(ResolverTypeName), "@aws-cdk/aws-appsync.ResolverTypeName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ResolverTypeName : Token
    {
        public ResolverTypeName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ResolverTypeName(ByRefValue reference): base(reference)
        {
        }

        protected ResolverTypeName(DeputyProps props): base(props)
        {
        }
    }
}