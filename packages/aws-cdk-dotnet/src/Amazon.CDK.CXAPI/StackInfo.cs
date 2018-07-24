using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    /// <summary>Identifies and contains metadata about a stack</summary>
    public class StackInfo : DeputyBase, IStackInfo
    {
        [JsiiProperty("environment", "{\"fqn\":\"@aws-cdk/cx-api.Environment\",\"optional\":true}", true)]
        public IEnvironment Environment
        {
            get;
            set;
        }

        [JsiiProperty("name", "{\"primitive\":\"string\"}", true)]
        public string Name
        {
            get;
            set;
        }
    }
}