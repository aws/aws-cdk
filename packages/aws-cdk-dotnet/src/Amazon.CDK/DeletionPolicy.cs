using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// With the DeletionPolicy attribute you can preserve or (in some cases) backup a resource when its stack is deleted.
    /// You specify a DeletionPolicy attribute for each resource that you want to control. If a resource has no DeletionPolicy
    /// attribute, AWS CloudFormation deletes the resource by default. Note that this capability also applies to update operations
    /// that lead to resources being removed.
    /// </summary>
    [JsiiEnum(typeof(DeletionPolicy), "@aws-cdk/cdk.DeletionPolicy")]
    public enum DeletionPolicy
    {
        [JsiiEnumMember("Delete")]
        Delete,
        [JsiiEnumMember("Retain")]
        Retain,
        [JsiiEnumMember("Snapshot")]
        Snapshot
    }
}