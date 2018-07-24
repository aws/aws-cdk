using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    /// <summary>Properties for the {@link RepositoryRef.import} method.</summary>
    public class RepositoryRefProps : DeputyBase, IRepositoryRefProps
    {
        /// <summary>
        /// The name of an existing CodeCommit Repository that we are referencing.
        /// Must be in the same account and region as the root Stack.
        /// </summary>
        [JsiiProperty("repositoryName", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryName\"}", true)]
        public RepositoryName RepositoryName
        {
            get;
            set;
        }
    }
}