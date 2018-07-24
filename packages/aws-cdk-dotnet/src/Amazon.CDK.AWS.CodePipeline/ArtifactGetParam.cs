using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <remarks>link: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-parameter-override-functions.html </remarks>
    [JsiiClass(typeof(ArtifactGetParam), "@aws-cdk/aws-codepipeline.ArtifactGetParam", "[{\"name\":\"artifact\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Artifact\"}},{\"name\":\"jsonFile\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"keyName\",\"type\":{\"primitive\":\"string\"}}]")]
    public class ArtifactGetParam : Token
    {
        public ArtifactGetParam(Artifact artifact, string jsonFile, string keyName): base(new DeputyProps(new object[]{artifact, jsonFile, keyName}))
        {
        }

        protected ArtifactGetParam(ByRefValue reference): base(reference)
        {
        }

        protected ArtifactGetParam(DeputyProps props): base(props)
        {
        }
    }
}