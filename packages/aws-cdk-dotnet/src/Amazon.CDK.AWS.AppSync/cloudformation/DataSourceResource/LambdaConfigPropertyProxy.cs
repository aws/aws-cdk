using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync.cloudformation.DataSourceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-lambdaconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(ILambdaConfigProperty), "@aws-cdk/aws-appsync.cloudformation.DataSourceResource.LambdaConfigProperty")]
    internal class LambdaConfigPropertyProxy : DeputyBase, ILambdaConfigProperty
    {
        private LambdaConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DataSourceResource.LambdaConfigProperty.LambdaFunctionArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-lambdaconfig.html#cfn-appsync-datasource-lambdaconfig-lambdafunctionarn </remarks>
        [JsiiProperty("lambdaFunctionArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object LambdaFunctionArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}