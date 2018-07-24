using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>A version/weight pair for routing traffic to Lambda functions</summary>
    [JsiiInterfaceProxy(typeof(IVersionWeight), "@aws-cdk/aws-lambda.VersionWeight")]
    internal class VersionWeightProxy : DeputyBase, IVersionWeight
    {
        private VersionWeightProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The version to route traffic to</summary>
        [JsiiProperty("version", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaVersion\"}")]
        public virtual LambdaVersion Version
        {
            get => GetInstanceProperty<LambdaVersion>();
        }

        /// <summary>How much weight to assign to this version (0..1)</summary>
        [JsiiProperty("weight", "{\"primitive\":\"number\"}")]
        public virtual double Weight
        {
            get => GetInstanceProperty<double>();
        }
    }
}