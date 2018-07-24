using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    [JsiiClass(typeof(RepositoryCloneUrlSsh), "@aws-cdk/aws-codecommit.RepositoryCloneUrlSsh", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class RepositoryCloneUrlSsh : Token
    {
        public RepositoryCloneUrlSsh(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected RepositoryCloneUrlSsh(ByRefValue reference): base(reference)
        {
        }

        protected RepositoryCloneUrlSsh(DeputyProps props): base(props)
        {
        }
    }
}