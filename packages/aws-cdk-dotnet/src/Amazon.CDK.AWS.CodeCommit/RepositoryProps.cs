using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    public class RepositoryProps : DeputyBase, IRepositoryProps
    {
        /// <summary>Name of the repository. This property is required for all repositories.</summary>
        [JsiiProperty("repositoryName", "{\"primitive\":\"string\"}", true)]
        public string RepositoryName
        {
            get;
            set;
        }

        /// <summary>
        /// A description of the repository. Use the description to identify the
        /// purpose of the repository.
        /// </summary>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Description
        {
            get;
            set;
        }
    }
}