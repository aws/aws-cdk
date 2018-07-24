using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    /// <summary>Models an AWS execution environment, for use within the CDK toolkit.</summary>
    public class Environment : DeputyBase, IEnvironment
    {
        /// <summary>The arbitrary name of this environment (user-set, or at least user-meaningful) </summary>
        [JsiiProperty("name", "{\"primitive\":\"string\"}", true)]
        public string Name
        {
            get;
            set;
        }

        /// <summary>The 12-digit AWS account ID for the account this environment deploys into </summary>
        [JsiiProperty("account", "{\"primitive\":\"string\"}", true)]
        public string Account
        {
            get;
            set;
        }

        /// <summary>The AWS region name where this environment deploys into </summary>
        [JsiiProperty("region", "{\"primitive\":\"string\"}", true)]
        public string Region
        {
            get;
            set;
        }
    }
}