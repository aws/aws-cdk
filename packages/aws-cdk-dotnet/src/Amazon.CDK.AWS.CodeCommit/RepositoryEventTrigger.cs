using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    /// <summary>Repository events that will cause the trigger to run actions in another service.</summary>
    [JsiiEnum(typeof(RepositoryEventTrigger), "@aws-cdk/aws-codecommit.RepositoryEventTrigger")]
    public enum RepositoryEventTrigger
    {
        [JsiiEnumMember("All")]
        All,
        [JsiiEnumMember("UpdateRef")]
        UpdateRef,
        [JsiiEnumMember("CreateRef")]
        CreateRef,
        [JsiiEnumMember("DeleteRef")]
        DeleteRef
    }
}