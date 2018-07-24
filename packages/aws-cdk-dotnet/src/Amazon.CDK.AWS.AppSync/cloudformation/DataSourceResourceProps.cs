using Amazon.CDK;
using Amazon.CDK.AWS.AppSync.cloudformation.DataSourceResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html </remarks>
    public class DataSourceResourceProps : DeputyBase, IDataSourceResourceProps
    {
        /// <summary>``AWS::AppSync::DataSource.ApiId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-apiid </remarks>
        [JsiiProperty("apiId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ApiId
        {
            get;
            set;
        }

        /// <summary>``AWS::AppSync::DataSource.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-name </remarks>
        [JsiiProperty("dataSourceName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object DataSourceName
        {
            get;
            set;
        }

        /// <summary>``AWS::AppSync::DataSource.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Type
        {
            get;
            set;
        }

        /// <summary>``AWS::AppSync::DataSource.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Description
        {
            get;
            set;
        }

        /// <summary>``AWS::AppSync::DataSource.DynamoDBConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-dynamodbconfig </remarks>
        [JsiiProperty("dynamoDbConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-appsync.cloudformation.DataSourceResource.DynamoDBConfigProperty\"}]},\"optional\":true}", true)]
        public object DynamoDbConfig
        {
            get;
            set;
        }

        /// <summary>``AWS::AppSync::DataSource.ElasticsearchConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-elasticsearchconfig </remarks>
        [JsiiProperty("elasticsearchConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-appsync.cloudformation.DataSourceResource.ElasticsearchConfigProperty\"}]},\"optional\":true}", true)]
        public object ElasticsearchConfig
        {
            get;
            set;
        }

        /// <summary>``AWS::AppSync::DataSource.LambdaConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-lambdaconfig </remarks>
        [JsiiProperty("lambdaConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-appsync.cloudformation.DataSourceResource.LambdaConfigProperty\"}]},\"optional\":true}", true)]
        public object LambdaConfig
        {
            get;
            set;
        }

        /// <summary>``AWS::AppSync::DataSource.ServiceRoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-servicerolearn </remarks>
        [JsiiProperty("serviceRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ServiceRoleArn
        {
            get;
            set;
        }
    }
}