using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-attributedef.html </remarks>
    [JsiiInterface(typeof(IAttributeDefinitionProperty), "@aws-cdk/aws-dynamodb.cloudformation.TableResource.AttributeDefinitionProperty")]
    public interface IAttributeDefinitionProperty
    {
        /// <summary>``TableResource.AttributeDefinitionProperty.AttributeName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-attributedef.html#cfn-dynamodb-attributedef-attributename </remarks>
        [JsiiProperty("attributeName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object AttributeName
        {
            get;
            set;
        }

        /// <summary>``TableResource.AttributeDefinitionProperty.AttributeType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-attributedef.html#cfn-dynamodb-attributedef-attributename-attributetype </remarks>
        [JsiiProperty("attributeType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object AttributeType
        {
            get;
            set;
        }
    }
}