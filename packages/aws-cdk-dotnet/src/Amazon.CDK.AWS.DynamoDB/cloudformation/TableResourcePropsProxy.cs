using Amazon.CDK;
using Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html </remarks>
    [JsiiInterfaceProxy(typeof(ITableResourceProps), "@aws-cdk/aws-dynamodb.cloudformation.TableResourceProps")]
    internal class TableResourcePropsProxy : DeputyBase, ITableResourceProps
    {
        private TableResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::DynamoDB::Table.KeySchema``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-keyschema </remarks>
        [JsiiProperty("keySchema", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.KeySchemaProperty\"}]}}}}]}}")]
        public virtual object KeySchema
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::DynamoDB::Table.ProvisionedThroughput``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-provisionedthroughput </remarks>
        [JsiiProperty("provisionedThroughput", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.ProvisionedThroughputProperty\"}]}}")]
        public virtual object ProvisionedThroughput
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::DynamoDB::Table.AttributeDefinitions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-attributedef </remarks>
        [JsiiProperty("attributeDefinitions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.AttributeDefinitionProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object AttributeDefinitions
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::DynamoDB::Table.GlobalSecondaryIndexes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-gsi </remarks>
        [JsiiProperty("globalSecondaryIndexes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.GlobalSecondaryIndexProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object GlobalSecondaryIndexes
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::DynamoDB::Table.LocalSecondaryIndexes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-lsi </remarks>
        [JsiiProperty("localSecondaryIndexes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.LocalSecondaryIndexProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object LocalSecondaryIndexes
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::DynamoDB::Table.PointInTimeRecoverySpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-pointintimerecoveryspecification </remarks>
        [JsiiProperty("pointInTimeRecoverySpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.PointInTimeRecoverySpecificationProperty\"}]},\"optional\":true}")]
        public virtual object PointInTimeRecoverySpecification
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::DynamoDB::Table.SSESpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-ssespecification </remarks>
        [JsiiProperty("sseSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.SSESpecificationProperty\"}]},\"optional\":true}")]
        public virtual object SseSpecification
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::DynamoDB::Table.StreamSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-streamspecification </remarks>
        [JsiiProperty("streamSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.StreamSpecificationProperty\"}]},\"optional\":true}")]
        public virtual object StreamSpecification
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::DynamoDB::Table.TableName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-tablename </remarks>
        [JsiiProperty("tableName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object TableName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::DynamoDB::Table.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}")]
        public virtual object Tags
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::DynamoDB::Table.TimeToLiveSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-timetolivespecification </remarks>
        [JsiiProperty("timeToLiveSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.TimeToLiveSpecificationProperty\"}]},\"optional\":true}")]
        public virtual object TimeToLiveSpecification
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}