using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.CXAPI
{
    /// <summary>Models an AWS execution environment, for use within the CDK toolkit.</summary>
    [JsiiInterface(typeof(IEnvironment), "@aws-cdk/cx-api.Environment")]
    public interface IEnvironment
    {
        /// <summary>The arbitrary name of this environment (user-set, or at least user-meaningful) </summary>
        [JsiiProperty("name", "{\"primitive\":\"string\"}")]
        string Name
        {
            get;
            set;
        }

        /// <summary>The 12-digit AWS account ID for the account this environment deploys into </summary>
        [JsiiProperty("account", "{\"primitive\":\"string\"}")]
        string Account
        {
            get;
            set;
        }

        /// <summary>The AWS region name where this environment deploys into </summary>
        [JsiiProperty("region", "{\"primitive\":\"string\"}")]
        string Region
        {
            get;
            set;
        }
    }
}