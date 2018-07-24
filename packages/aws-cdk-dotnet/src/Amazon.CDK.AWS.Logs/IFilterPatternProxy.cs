using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Interface for objects that can render themselves to log patterns.</summary>
    [JsiiInterfaceProxy(typeof(IIFilterPattern), "@aws-cdk/aws-logs.IFilterPattern")]
    internal class IFilterPatternProxy : DeputyBase, IIFilterPattern
    {
        private IFilterPatternProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("logPatternString", "{\"primitive\":\"string\"}")]
        public virtual string LogPatternString
        {
            get => GetInstanceProperty<string>();
        }
    }
}