using Amazon.CDK;
using Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html </remarks>
    [JsiiInterface(typeof(ITableResourceProps), "@aws-cdk/aws-dynamodb.cloudformation.TableResourceProps")]
    public interface ITableResourceProps
    {
        /// <summary>``AWS::DynamoDB::Table.KeySchema``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-keyschema </remarks>
        [JsiiProperty("keySchema", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.KeySchemaProperty\"}]}}}}]}}")]
        object KeySchema
        {
            get;
            set;
        }

        /// <summary>``AWS::DynamoDB::Table.ProvisionedThroughput``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-provisionedthroughput </remarks>
        [JsiiProperty("provisionedThroughput", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.ProvisionedThroughputProperty\"}]}}")]
        object ProvisionedThroughput
        {
            get;
            set;
        }

        /// <summary>``AWS::DynamoDB::Table.AttributeDefinitions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-attributedef </remarks>
        [JsiiProperty("attributeDefinitions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.AttributeDefinitionProperty\"}]}}}}]},\"optional\":true}")]
        object AttributeDefinitions
        {
            get;
            set;
        }

        /// <summary>``AWS::DynamoDB::Table.GlobalSecondaryIndexes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-gsi </remarks>
        [JsiiProperty("globalSecondaryIndexes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.GlobalSecondaryIndexProperty\"}]}}}}]},\"optional\":true}")]
        object GlobalSecondaryIndexes
        {
            get;
            set;
        }

        /// <summary>``AWS::DynamoDB::Table.LocalSecondaryIndexes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-lsi </remarks>
        [JsiiProperty("localSecondaryIndexes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.LocalSecondaryIndexProperty\"}]}}}}]},\"optional\":true}")]
        object LocalSecondaryIndexes
        {
            get;
            set;
        }

        /// <summary>``AWS::DynamoDB::Table.PointInTimeRecoverySpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-pointintimerecoveryspecification </remarks>
        [JsiiProperty("pointInTimeRecoverySpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.PointInTimeRecoverySpecificationProperty\"}]},\"optional\":true}")]
        object PointInTimeRecoverySpecification
        {
            get;
            set;
        }

        /// <summary>``AWS::DynamoDB::Table.SSESpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-ssespecification </remarks>
        [JsiiProperty("sseSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.SSESpecificationProperty\"}]},\"optional\":true}")]
        object SseSpecification
        {
            get;
            set;
        }

        /// <summary>``AWS::DynamoDB::Table.StreamSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-streamspecification </remarks>
        [JsiiProperty("streamSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.StreamSpecificationProperty\"}]},\"optional\":true}")]
        object StreamSpecification
        {
            get;
            set;
        }

        /// <summary>``AWS::DynamoDB::Table.TableName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-tablename </remarks>
        [JsiiProperty("tableName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TableName
        {
            get;
            set;
        }

        /// <summary>``AWS::DynamoDB::Table.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}")]
        object Tags
        {
            get;
            set;
        }

        /// <summary>``AWS::DynamoDB::Table.TimeToLiveSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#cfn-dynamodb-table-timetolivespecification </remarks>
        [JsiiProperty("timeToLiveSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.TimeToLiveSpecificationProperty\"}]},\"optional\":true}")]
        object TimeToLiveSpecification
        {
            get;
            set;
        }
    }
}