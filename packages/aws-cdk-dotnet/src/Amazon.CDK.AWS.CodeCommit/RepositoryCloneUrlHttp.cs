using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    [JsiiClass(typeof(RepositoryCloneUrlHttp), "@aws-cdk/aws-codecommit.RepositoryCloneUrlHttp", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class RepositoryCloneUrlHttp : Token
    {
        public RepositoryCloneUrlHttp(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected RepositoryCloneUrlHttp(ByRefValue reference): base(reference)
        {
        }

        protected RepositoryCloneUrlHttp(DeputyProps props): base(props)
        {
        }
    }
}