using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    [JsiiClass(typeof(ProjectName), "@aws-cdk/aws-codebuild.ProjectName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ProjectName : Token
    {
        public ProjectName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ProjectName(ByRefValue reference): base(reference)
        {
        }

        protected ProjectName(DeputyProps props): base(props)
        {
        }
    }
}