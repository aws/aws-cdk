using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>The engine for the database cluster</summary>
    [JsiiEnum(typeof(DatabaseClusterEngine), "@aws-cdk/aws-rds.DatabaseClusterEngine")]
    public enum DatabaseClusterEngine
    {
        [JsiiEnumMember("Aurora")]
        Aurora,
        [JsiiEnumMember("Neptune")]
        Neptune
    }
}