using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    /// <summary>Identifies a single stack</summary>
    [JsiiInterface(typeof(IStackId), "@aws-cdk/cx-api.StackId")]
    public interface IStackId
    {
        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        string Name
        {
            get;
            set;
        }
    }
}