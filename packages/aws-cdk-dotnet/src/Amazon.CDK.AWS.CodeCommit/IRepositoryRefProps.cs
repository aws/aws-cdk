using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    /// <summary>Properties for the {@link RepositoryRef.import} method.</summary>
    [JsiiInterface(typeof(IRepositoryRefProps), "@aws-cdk/aws-codecommit.RepositoryRefProps")]
    public interface IRepositoryRefProps
    {
        /// <summary>
        /// The name of an existing CodeCommit Repository that we are referencing.
        /// Must be in the same account and region as the root Stack.
        /// </summary>
        [JsiiProperty("repositoryName", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryName\"}")]
        RepositoryName RepositoryName
        {
            get;
            set;
        }
    }
}