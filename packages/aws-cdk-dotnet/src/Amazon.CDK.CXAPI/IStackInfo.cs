using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    /// <summary>Identifies and contains metadata about a stack</summary>
    [JsiiInterface(typeof(IStackInfo), "@aws-cdk/cx-api.StackInfo")]
    public interface IStackInfo : IStackId
    {
        [JsiiProperty("environment", "{\"fqn\":\"@aws-cdk/cx-api.Environment\",\"optional\":true}")]
        IEnvironment Environment
        {
            get;
            set;
        }
    }
}