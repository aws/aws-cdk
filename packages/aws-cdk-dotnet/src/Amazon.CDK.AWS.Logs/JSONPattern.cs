using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Base class for patterns that only match JSON log events.</summary>
    [JsiiClass(typeof(JSONPattern), "@aws-cdk/aws-logs.JSONPattern", "[{\"name\":\"jsonPatternString\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class JSONPattern : DeputyBase, IIFilterPattern
    {
        protected JSONPattern(string jsonPatternString): base(new DeputyProps(new object[]{jsonPatternString}))
        {
        }

        protected JSONPattern(ByRefValue reference): base(reference)
        {
        }

        protected JSONPattern(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("jsonPatternString", "{\"primitive\":\"string\"}")]
        public virtual string JsonPatternString
        {
            get => GetInstanceProperty<string>();
        }

        [JsiiProperty("logPatternString", "{\"primitive\":\"string\"}")]
        public virtual string LogPatternString
        {
            get => GetInstanceProperty<string>();
        }
    }
}