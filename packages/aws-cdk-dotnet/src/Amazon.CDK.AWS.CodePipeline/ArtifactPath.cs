using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>
    /// A specific file within an output artifact.
    /// 
    /// The most common use case for this is specifying the template file
    /// for a CloudFormation action.
    /// </summary>
    [JsiiClass(typeof(ArtifactPath), "@aws-cdk/aws-codepipeline.ArtifactPath", "[{\"name\":\"artifact\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Artifact\"}},{\"name\":\"fileName\",\"type\":{\"primitive\":\"string\"}}]")]
    public class ArtifactPath : DeputyBase
    {
        public ArtifactPath(Artifact artifact, string fileName): base(new DeputyProps(new object[]{artifact, fileName}))
        {
        }

        protected ArtifactPath(ByRefValue reference): base(reference)
        {
        }

        protected ArtifactPath(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("artifact", "{\"fqn\":\"@aws-cdk/aws-codepipeline.Artifact\"}")]
        public virtual Artifact Artifact
        {
            get => GetInstanceProperty<Artifact>();
        }

        [JsiiProperty("fileName", "{\"primitive\":\"string\"}")]
        public virtual string FileName
        {
            get => GetInstanceProperty<string>();
        }

        [JsiiProperty("location", "{\"primitive\":\"string\"}")]
        public virtual string Location
        {
            get => GetInstanceProperty<string>();
        }
    }
}