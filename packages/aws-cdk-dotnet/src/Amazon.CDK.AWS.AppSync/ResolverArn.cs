using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync
{
    [JsiiClass(typeof(ResolverArn), "@aws-cdk/aws-appsync.ResolverArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ResolverArn : Arn
    {
        public ResolverArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ResolverArn(ByRefValue reference): base(reference)
        {
        }

        protected ResolverArn(DeputyProps props): base(props)
        {
        }
    }
}