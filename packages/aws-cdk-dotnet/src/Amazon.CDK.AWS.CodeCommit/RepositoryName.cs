using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    [JsiiClass(typeof(RepositoryName), "@aws-cdk/aws-codecommit.RepositoryName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class RepositoryName : Token
    {
        public RepositoryName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected RepositoryName(ByRefValue reference): base(reference)
        {
        }

        protected RepositoryName(DeputyProps props): base(props)
        {
        }
    }
}