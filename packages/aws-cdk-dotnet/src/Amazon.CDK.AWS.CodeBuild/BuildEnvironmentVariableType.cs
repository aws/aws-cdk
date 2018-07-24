using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    [JsiiEnum(typeof(BuildEnvironmentVariableType), "@aws-cdk/aws-codebuild.BuildEnvironmentVariableType")]
    public enum BuildEnvironmentVariableType
    {
        [JsiiEnumMember("PlainText")]
        PlainText,
        [JsiiEnumMember("ParameterStore")]
        ParameterStore
    }
}