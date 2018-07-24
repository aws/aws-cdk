using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Interface for objects that can render themselves to log patterns.</summary>
    public class IFilterPattern : DeputyBase, IIFilterPattern
    {
        [JsiiProperty("logPatternString", "{\"primitive\":\"string\"}", true)]
        public string LogPatternString
        {
            get;
        }
    }
}