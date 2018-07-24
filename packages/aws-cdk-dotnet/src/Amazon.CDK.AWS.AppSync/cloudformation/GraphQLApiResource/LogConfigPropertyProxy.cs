using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync.cloudformation.GraphQLApiResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-logconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(ILogConfigProperty), "@aws-cdk/aws-appsync.cloudformation.GraphQLApiResource.LogConfigProperty")]
    internal class LogConfigPropertyProxy : DeputyBase, ILogConfigProperty
    {
        private LogConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``GraphQLApiResource.LogConfigProperty.CloudWatchLogsRoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-logconfig.html#cfn-appsync-graphqlapi-logconfig-cloudwatchlogsrolearn </remarks>
        [JsiiProperty("cloudWatchLogsRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object CloudWatchLogsRoleArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``GraphQLApiResource.LogConfigProperty.FieldLogLevel``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-logconfig.html#cfn-appsync-graphqlapi-logconfig-fieldloglevel </remarks>
        [JsiiProperty("fieldLogLevel", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object FieldLogLevel
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}