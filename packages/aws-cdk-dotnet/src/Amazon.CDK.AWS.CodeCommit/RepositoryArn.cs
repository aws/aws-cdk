using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    [JsiiClass(typeof(RepositoryArn), "@aws-cdk/aws-codecommit.RepositoryArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
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