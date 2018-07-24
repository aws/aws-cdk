using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    /// <summary>Source types for CodeBuild Project</summary>
    [JsiiEnum(typeof(SourceType), "@aws-cdk/aws-codebuild.SourceType")]
    public enum SourceType
    {
        [JsiiEnumMember("CodeCommit")]
        CodeCommit,
        [JsiiEnumMember("CodePipeline")]
        CodePipeline,
        [JsiiEnumMember("GitHub")]
        GitHub,
        [JsiiEnumMember("GitHubEnterPrise")]
        GitHubEnterPrise,
        [JsiiEnumMember("BitBucket")]
        BitBucket,
        [JsiiEnumMember("S3")]
        S3
    }
}