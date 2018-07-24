using Amazon.CDK;
using Amazon.CDK.AWS.AppSync.cloudformation.DataSourceResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html </remarks>
    [JsiiInterfaceProxy(typeof(IDataSourceResourceProps), "@aws-cdk/aws-appsync.cloudformation.DataSourceResourceProps")]
    internal class DataSourceResourcePropsProxy : DeputyBase, IDataSourceResourceProps
    {
        private DataSourceResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::AppSync::DataSource.ApiId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-apiid </remarks>
        [JsiiProperty("apiId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ApiId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::AppSync::DataSource.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-name </remarks>
        [JsiiProperty("dataSourceName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object DataSourceName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::AppSync::DataSource.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Type
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::AppSync::DataSource.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Description
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::AppSync::DataSource.DynamoDBConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-dynamodbconfig </remarks>
        [JsiiProperty("dynamoDbConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-appsync.cloudformation.DataSourceResource.DynamoDBConfigProperty\"}]},\"optional\":true}")]
        public virtual object DynamoDbConfig
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::AppSync::DataSource.ElasticsearchConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-elasticsearchconfig </remarks>
        [JsiiProperty("elasticsearchConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-appsync.cloudformation.DataSourceResource.ElasticsearchConfigProperty\"}]},\"optional\":true}")]
        public virtual object ElasticsearchConfig
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::AppSync::DataSource.LambdaConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-lambdaconfig </remarks>
        [JsiiProperty("lambdaConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-appsync.cloudformation.DataSourceResource.LambdaConfigProperty\"}]},\"optional\":true}")]
        public virtual object LambdaConfig
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::AppSync::DataSource.ServiceRoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html#cfn-appsync-datasource-servicerolearn </remarks>
        [JsiiProperty("serviceRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ServiceRoleArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}