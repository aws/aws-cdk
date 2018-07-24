using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <remarks>link: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-parameter-override-functions.html </remarks>
    [JsiiClass(typeof(ArtifactAttribute), "@aws-cdk/aws-codepipeline.ArtifactAttribute", "[{\"name\":\"artifact\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Artifact\"}},{\"name\":\"attributeName\",\"type\":{\"primitive\":\"string\"}}]")]
    public class ArtifactAttribute : Token
    {
        public ArtifactAttribute(Artifact artifact, string attributeName): base(new DeputyProps(new object[]{artifact, attributeName}))
        {
        }

        protected ArtifactAttribute(ByRefValue reference): base(reference)
        {
        }

        protected ArtifactAttribute(DeputyProps props): base(props)
        {
        }
    }
}