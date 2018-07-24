using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>A version/weight pair for routing traffic to Lambda functions</summary>
    [JsiiInterface(typeof(IVersionWeight), "@aws-cdk/aws-lambda.VersionWeight")]
    public interface IVersionWeight
    {
        /// <summary>The version to route traffic to</summary>
        [JsiiProperty("version", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaVersion\"}")]
        LambdaVersion Version
        {
            get;
        }

        /// <summary>How much weight to assign to this version (0..1)</summary>
        [JsiiProperty("weight", "{\"primitive\":\"number\"}")]
        double Weight
        {
            get;
        }
    }
}