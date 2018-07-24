using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    [JsiiInterfaceProxy(typeof(IRepositoryProps), "@aws-cdk/aws-codecommit.RepositoryProps")]
    internal class RepositoryPropsProxy : DeputyBase, IRepositoryProps
    {
        private RepositoryPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Name of the repository. This property is required for all repositories.</summary>
        [JsiiProperty("repositoryName", "{\"primitive\":\"string\"}")]
        public virtual string RepositoryName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// A description of the repository. Use the description to identify the
        /// purpose of the repository.
        /// </summary>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Description
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}