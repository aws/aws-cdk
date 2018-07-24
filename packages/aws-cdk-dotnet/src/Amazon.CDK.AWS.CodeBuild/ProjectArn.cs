using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    [JsiiClass(typeof(ProjectArn), "@aws-cdk/aws-codebuild.ProjectArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ProjectArn : Arn
    {
        public ProjectArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ProjectArn(ByRefValue reference): base(reference)
        {
        }

        protected ProjectArn(DeputyProps props): base(props)
        {
        }
    }
}