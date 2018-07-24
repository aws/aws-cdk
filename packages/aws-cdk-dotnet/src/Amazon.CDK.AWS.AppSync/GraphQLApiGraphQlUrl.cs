using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync
{
    [JsiiClass(typeof(GraphQLApiGraphQlUrl), "@aws-cdk/aws-appsync.GraphQLApiGraphQlUrl", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class GraphQLApiGraphQlUrl : Token
    {
        public GraphQLApiGraphQlUrl(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected GraphQLApiGraphQlUrl(ByRefValue reference): base(reference)
        {
        }

        protected GraphQLApiGraphQlUrl(DeputyProps props): base(props)
        {
        }
    }
}