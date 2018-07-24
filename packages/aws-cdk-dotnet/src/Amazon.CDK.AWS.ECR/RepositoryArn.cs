using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECR
{
    [JsiiClass(typeof(RepositoryArn), "@aws-cdk/aws-ecr.RepositoryArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class RepositoryArn : Arn
    {
        public RepositoryArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected RepositoryArn(ByRefValue reference): base(reference)
        {
        }

        protected RepositoryArn(DeputyProps props): base(props)
        {
        }
    }
}