using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync.cloudformation.DataSourceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-elasticsearchconfig.html </remarks>
    [JsiiInterface(typeof(IElasticsearchConfigProperty), "@aws-cdk/aws-appsync.cloudformation.DataSourceResource.ElasticsearchConfigProperty")]
    public interface IElasticsearchConfigProperty
    {
        /// <summary>``DataSourceResource.ElasticsearchConfigProperty.AwsRegion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-elasticsearchconfig.html#cfn-appsync-datasource-elasticsearchconfig-awsregion </remarks>
        [JsiiProperty("awsRegion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object AwsRegion
        {
            get;
            set;
        }

        /// <summary>``DataSourceResource.ElasticsearchConfigProperty.Endpoint``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-elasticsearchconfig.html#cfn-appsync-datasource-elasticsearchconfig-endpoint </remarks>
        [JsiiProperty("endpoint", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Endpoint
        {
            get;
            set;
        }
    }
}