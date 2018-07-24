using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>
    /// Low level class for source actions.
    /// It is recommended that concrete types are used instead, such as {@link AmazonS3Source} or
    /// {@link codecommit.PipelineSource}.
    /// </summary>
    [JsiiClass(typeof(Source), "@aws-cdk/aws-codepipeline.Source", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Stage\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.SourceProps\"}}]")]
    public abstract class Source : Action
    {
        protected Source(Stage parent, string name, ISourceProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Source(ByRefValue reference): base(reference)
        {
        }

        protected Source(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("artifact", "{\"fqn\":\"@aws-cdk/aws-codepipeline.Artifact\"}")]
        public virtual Artifact Artifact
        {
            get => GetInstanceProperty<Artifact>();
        }
    }
}