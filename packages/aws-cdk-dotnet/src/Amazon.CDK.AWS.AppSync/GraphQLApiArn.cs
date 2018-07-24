using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync
{
    [JsiiClass(typeof(GraphQLApiArn), "@aws-cdk/aws-appsync.GraphQLApiArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class GraphQLApiArn : Arn
    {
        public GraphQLApiArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected GraphQLApiArn(ByRefValue reference): base(reference)
        {
        }

        protected GraphQLApiArn(DeputyProps props): base(props)
        {
        }
    }
}