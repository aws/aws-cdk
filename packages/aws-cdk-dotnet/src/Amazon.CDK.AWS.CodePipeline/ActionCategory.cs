using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    [JsiiEnum(typeof(ActionCategory), "@aws-cdk/aws-codepipeline.ActionCategory")]
    public enum ActionCategory
    {
        [JsiiEnumMember("Source")]
        Source,
        [JsiiEnumMember("Build")]
        Build,
        [JsiiEnumMember("Test")]
        Test,
        [JsiiEnumMember("Approval")]
        Approval,
        [JsiiEnumMember("Deploy")]
        Deploy,
        [JsiiEnumMember("Invoke")]
        Invoke
    }
}