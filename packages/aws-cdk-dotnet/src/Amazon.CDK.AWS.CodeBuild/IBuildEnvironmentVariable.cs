using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    [JsiiInterface(typeof(IBuildEnvironmentVariable), "@aws-cdk/aws-codebuild.BuildEnvironmentVariable")]
    public interface IBuildEnvironmentVariable
    {
        /// <summary>The type of environment variable.</summary>
        /// <remarks>default: PlainText</remarks>
        [JsiiProperty("type", "{\"fqn\":\"@aws-cdk/aws-codebuild.BuildEnvironmentVariableType\",\"optional\":true}")]
        BuildEnvironmentVariableType Type
        {
            get;
            set;
        }

        /// <summary>
        /// The value of the environment variable (or the name of the parameter in
        /// the SSM parameter store.)
        /// </summary>
        [JsiiProperty("value", "{\"primitive\":\"any\"}")]
        object Value
        {
            get;
            set;
        }
    }
}