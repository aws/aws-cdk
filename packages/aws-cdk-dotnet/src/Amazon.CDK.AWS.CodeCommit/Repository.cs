using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    /// <summary>Provides a CodeCommit Repository</summary>
    [JsiiClass(typeof(Repository), "@aws-cdk/aws-codecommit.Repository", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryProps\"}}]")]
    public class Repository : RepositoryRef
    {
        public Repository(Construct parent, string name, IRepositoryProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Repository(ByRefValue reference): base(reference)
        {
        }

        protected Repository(DeputyProps props): base(props)
        {
        }

        /// <summary>The ARN of this Repository. </summary>
        [JsiiProperty("repositoryArn", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryArn\"}")]
        public override RepositoryArn RepositoryArn
        {
            get => GetInstanceProperty<RepositoryArn>();
        }

        [JsiiProperty("repositoryCloneUrlHttp", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryCloneUrlHttp\"}")]
        public virtual RepositoryCloneUrlHttp RepositoryCloneUrlHttp
        {
            get => GetInstanceProperty<RepositoryCloneUrlHttp>();
        }

        [JsiiProperty("repositoryCloneUrlSsh", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryCloneUrlSsh\"}")]
        public virtual RepositoryCloneUrlSsh RepositoryCloneUrlSsh
        {
            get => GetInstanceProperty<RepositoryCloneUrlSsh>();
        }

        /// <summary>The human-visible name of this Repository. </summary>
        [JsiiProperty("repositoryName", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryName\"}")]
        public override RepositoryName RepositoryName
        {
            get => GetInstanceProperty<RepositoryName>();
        }

        /// <summary>Create a trigger to notify another service to run actions on repository events.</summary>
        /// <param name = "arn">Arn of the resource that repository events will notify</param>
        /// <param name = "options">Trigger options to run actions</param>
        [JsiiMethod("notify", "{\"fqn\":\"@aws-cdk/aws-codecommit.Repository\"}", "[{\"name\":\"arn\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryTriggerOptions\",\"optional\":true}}]")]
        public virtual Repository Notify(string arn, IRepositoryTriggerOptions options)
        {
            return InvokeInstanceMethod<Repository>(new object[]{arn, options});
        }
    }
}