using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeBuild
{
    [JsiiInterfaceProxy(typeof(IBuildEnvironmentVariable), "@aws-cdk/aws-codebuild.BuildEnvironmentVariable")]
    internal class BuildEnvironmentVariableProxy : DeputyBase, IBuildEnvironmentVariable
    {
        private BuildEnvironmentVariableProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The type of environment variable.</summary>
        /// <remarks>default: PlainText</remarks>
        [JsiiProperty("type", "{\"fqn\":\"@aws-cdk/aws-codebuild.BuildEnvironmentVariableType\",\"optional\":true}")]
        public virtual BuildEnvironmentVariableType Type
        {
            get => GetInstanceProperty<BuildEnvironmentVariableType>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The value of the environment variable (or the name of the parameter in
        /// the SSM parameter store.)
        /// </summary>
        [JsiiProperty("value", "{\"primitive\":\"any\"}")]
        public virtual object Value
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}