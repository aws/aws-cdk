using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-gsi.html </remarks>
    [JsiiInterface(typeof(IGlobalSecondaryIndexProperty), "@aws-cdk/aws-dynamodb.cloudformation.TableResource.GlobalSecondaryIndexProperty")]
    public interface IGlobalSecondaryIndexProperty
    {
        /// <summary>``TableResource.GlobalSecondaryIndexProperty.IndexName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-gsi.html#cfn-dynamodb-gsi-indexname </remarks>
        [JsiiProperty("indexName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object IndexName
        {
            get;
            set;
        }

        /// <summary>``TableResource.GlobalSecondaryIndexProperty.KeySchema``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-gsi.html#cfn-dynamodb-gsi-keyschema </remarks>
        [JsiiProperty("keySchema", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.KeySchemaProperty\"}]}}}}]}}")]
        object KeySchema
        {
            get;
            set;
        }

        /// <summary>``TableResource.GlobalSecondaryIndexProperty.Projection``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-gsi.html#cfn-dynamodb-gsi-projection </remarks>
        [JsiiProperty("projection", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.ProjectionProperty\"}]}}")]
        object Projection
        {
            get;
            set;
        }

        /// <summary>``TableResource.GlobalSecondaryIndexProperty.ProvisionedThroughput``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-gsi.html#cfn-dynamodb-gsi-provisionedthroughput </remarks>
        [JsiiProperty("provisionedThroughput", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResource.ProvisionedThroughputProperty\"}]}}")]
        object ProvisionedThroughput
        {
            get;
            set;
        }
    }
}