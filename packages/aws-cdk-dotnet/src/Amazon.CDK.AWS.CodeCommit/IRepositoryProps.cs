using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    [JsiiInterface(typeof(IRepositoryProps), "@aws-cdk/aws-codecommit.RepositoryProps")]
    public interface IRepositoryProps
    {
        /// <summary>Name of the repository. This property is required for all repositories.</summary>
        [JsiiProperty("repositoryName", "{\"primitive\":\"string\"}")]
        string RepositoryName
        {
            get;
            set;
        }

        /// <summary>
        /// A description of the repository. Use the description to identify the
        /// purpose of the repository.
        /// </summary>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}")]
        string Description
        {
            get;
            set;
        }
    }
}