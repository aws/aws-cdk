using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    /// <summary>Properties for the {@link RepositoryRef.import} method.</summary>
    [JsiiInterfaceProxy(typeof(IRepositoryRefProps), "@aws-cdk/aws-codecommit.RepositoryRefProps")]
    internal class RepositoryRefPropsProxy : DeputyBase, IRepositoryRefProps
    {
        private RepositoryRefPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The name of an existing CodeCommit Repository that we are referencing.
        /// Must be in the same account and region as the root Stack.
        /// </summary>
        [JsiiProperty("repositoryName", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryName\"}")]
        public virtual RepositoryName RepositoryName
        {
            get => GetInstanceProperty<RepositoryName>();
            set => SetInstanceProperty(value);
        }
    }
}