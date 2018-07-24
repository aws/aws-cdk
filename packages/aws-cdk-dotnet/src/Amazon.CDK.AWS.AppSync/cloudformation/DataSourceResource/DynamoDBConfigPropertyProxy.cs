using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync.cloudformation.DataSourceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IDynamoDBConfigProperty), "@aws-cdk/aws-appsync.cloudformation.DataSourceResource.DynamoDBConfigProperty")]
    internal class DynamoDBConfigPropertyProxy : DeputyBase, IDynamoDBConfigProperty
    {
        private DynamoDBConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DataSourceResource.DynamoDBConfigProperty.AwsRegion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html#cfn-appsync-datasource-dynamodbconfig-awsregion </remarks>
        [JsiiProperty("awsRegion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object AwsRegion
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DataSourceResource.DynamoDBConfigProperty.TableName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html#cfn-appsync-datasource-dynamodbconfig-tablename </remarks>
        [JsiiProperty("tableName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object TableName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``DataSourceResource.DynamoDBConfigProperty.UseCallerCredentials``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-datasource-dynamodbconfig.html#cfn-appsync-datasource-dynamodbconfig-usecallercredentials </remarks>
        [JsiiProperty("useCallerCredentials", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object UseCallerCredentials
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}