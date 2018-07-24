using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync
{
    [JsiiClass(typeof(ResolverFieldName), "@aws-cdk/aws-appsync.ResolverFieldName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ResolverFieldName : Token
    {
        public ResolverFieldName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ResolverFieldName(ByRefValue reference): base(reference)
        {
        }

        protected ResolverFieldName(DeputyProps props): base(props)
        {
        }
    }
}