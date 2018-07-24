using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Interface for objects that can render themselves to log patterns.</summary>
    [JsiiInterface(typeof(IIFilterPattern), "@aws-cdk/aws-logs.IFilterPattern")]
    public interface IIFilterPattern
    {
        [JsiiProperty("logPatternString", "{\"primitive\":\"string\"}")]
        string LogPatternString
        {
            get;
        }
    }
}