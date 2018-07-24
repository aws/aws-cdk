using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>Properties for a new Lambda alias</summary>
    [JsiiInterface(typeof(IAliasProps), "@aws-cdk/aws-lambda.AliasProps")]
    public interface IAliasProps
    {
        /// <summary>Description for the alias</summary>
        /// <remarks>default: No description</remarks>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}")]
        string Description
        {
            get;
            set;
        }

        /// <summary>
        /// Function version this alias refers to
        /// 
        /// Use lambda.addVersion() to obtain a new lambda version to refer to.
        /// </summary>
        [JsiiProperty("version", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaVersion\"}")]
        LambdaVersion Version
        {
            get;
            set;
        }

        /// <summary>Name of this alias</summary>
        [JsiiProperty("aliasName", "{\"primitive\":\"string\"}")]
        string AliasName
        {
            get;
            set;
        }

        /// <summary>
        /// Additional versions with individual weights this alias points to
        /// 
        /// Individual additional version weights specified here should add up to
        /// (less than) one. All remaining weight is routed to the default
        /// version.
        /// 
        /// For example, the config is
        /// 
        ///       version: "1"
        ///       additionalVersions: [{ version: "2", weight: 0.05 }]
        /// 
        /// Then 5% of traffic will be routed to function version 2, while
        /// the remaining 95% of traffic will be routed to function version 1.
        /// </summary>
        /// <remarks>default: No additional versions</remarks>
        [JsiiProperty("additionalVersions", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-lambda.VersionWeight\"}},\"optional\":true}")]
        IVersionWeight[] AdditionalVersions
        {
            get;
            set;
        }
    }
}