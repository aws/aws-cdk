using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    /// <summary>
    /// A single newly-deployed version of a Lambda function.
    /// 
    /// This object exists to--at deploy time--query the "then-current" version of
    /// the Lambda function that it refers to. This Version object can then be
    /// used in `Alias` to refer to a particular deployment of a Lambda.
    /// 
    /// This means that for every new update you deploy to your Lambda (using the
    /// CDK and Aliases), you must always create a new Version object. In
    /// particular, it must have a different name, so that a new resource is
    /// created.
    /// 
    /// If you want to ensure that you're associating the right version with
    /// the right deployment, specify the `codeSha256` property while
    /// creating the `Version.
    ///  *
    /// </summary>
    [JsiiClass(typeof(LambdaVersion), "@aws-cdk/aws-lambda.LambdaVersion", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-lambda.LambdaVersionProps\"}}]")]
    public class LambdaVersion : Construct
    {
        public LambdaVersion(Construct parent, string name, ILambdaVersionProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected LambdaVersion(ByRefValue reference): base(reference)
        {
        }

        protected LambdaVersion(DeputyProps props): base(props)
        {
        }

        /// <summary>The most recently deployed version of this function.</summary>
        [JsiiProperty("functionVersion", "{\"fqn\":\"@aws-cdk/aws-lambda.Version\"}")]
        public virtual Version FunctionVersion
        {
            get => GetInstanceProperty<Version>();
        }

        /// <summary>Lambda object this version is associated with</summary>
        [JsiiProperty("lambda", "{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRef\"}")]
        public virtual LambdaRef Lambda
        {
            get => GetInstanceProperty<LambdaRef>();
        }
    }
}