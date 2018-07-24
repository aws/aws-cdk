using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    /// <summary>Properties of a reference to a CodeBuild Project.</summary>
    /// <remarks>see: BuildProjectRef.export</remarks>
    [JsiiInterface(typeof(IBuildProjectRefProps), "@aws-cdk/aws-codebuild.BuildProjectRefProps")]
    public interface IBuildProjectRefProps
    {
        /// <summary>
        /// The human-readable name of the CodeBuild Project we're referencing.
        /// The Project must be in the same account and region as the root Stack.
        /// </summary>
        [JsiiProperty("projectName", "{\"fqn\":\"@aws-cdk/aws-codebuild.ProjectName\"}")]
        ProjectName ProjectName
        {
            get;
            set;
        }
    }
}