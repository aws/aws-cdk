using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync.cloudformation.DataSourceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-elasticsearchconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IElasticsearchConfigProperty), "@aws-cdk/aws-appsync.cloudformation.DataSourceResource.ElasticsearchConfigProperty")]
    internal class ElasticsearchConfigPropertyProxy : DeputyBase, IElasticsearchConfigProperty
    {
        private ElasticsearchConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DataSourceResource.ElasticsearchConfigProperty.AwsRegion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-elasticsearchconfig.html#cfn-appsync-datasource-elasticsearchconfig-awsregion </remarks>
        [JsiiProperty("awsRegion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object AwsRegion
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DataSourceResource.ElasticsearchConfigProperty.Endpoint``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-elasticsearchconfig.html#cfn-appsync-datasource-elasticsearchconfig-endpoint </remarks>
        [JsiiProperty("endpoint", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Endpoint
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}