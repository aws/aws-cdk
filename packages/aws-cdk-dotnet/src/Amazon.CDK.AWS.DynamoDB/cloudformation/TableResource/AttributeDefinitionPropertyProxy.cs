using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation.TableResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-attributedef.html </remarks>
    [JsiiInterfaceProxy(typeof(IAttributeDefinitionProperty), "@aws-cdk/aws-dynamodb.cloudformation.TableResource.AttributeDefinitionProperty")]
    internal class AttributeDefinitionPropertyProxy : DeputyBase, IAttributeDefinitionProperty
    {
        private AttributeDefinitionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``TableResource.AttributeDefinitionProperty.AttributeName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-attributedef.html#cfn-dynamodb-attributedef-attributename </remarks>
        [JsiiProperty("attributeName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object AttributeName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``TableResource.AttributeDefinitionProperty.AttributeType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-attributedef.html#cfn-dynamodb-attributedef-attributename-attributetype </remarks>
        [JsiiProperty("attributeType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object AttributeType
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}