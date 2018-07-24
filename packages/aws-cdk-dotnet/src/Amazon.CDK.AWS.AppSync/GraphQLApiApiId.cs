using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync
{
    [JsiiClass(typeof(GraphQLApiApiId), "@aws-cdk/aws-appsync.GraphQLApiApiId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class GraphQLApiApiId : Token
    {
        public GraphQLApiApiId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected GraphQLApiApiId(ByRefValue reference): base(reference)
        {
        }

        protected GraphQLApiApiId(DeputyProps props): base(props)
        {
        }
    }
}