using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html </remarks>
    [JsiiInterface(typeof(ISchemaAttributeProperty), "@aws-cdk/aws-cognito.cloudformation.UserPoolResource.SchemaAttributeProperty")]
    public interface ISchemaAttributeProperty
    {
        /// <summary>``UserPoolResource.SchemaAttributeProperty.AttributeDataType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-attributedatatype </remarks>
        [JsiiProperty("attributeDataType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AttributeDataType
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.SchemaAttributeProperty.DeveloperOnlyAttribute``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-developeronlyattribute </remarks>
        [JsiiProperty("developerOnlyAttribute", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DeveloperOnlyAttribute
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.SchemaAttributeProperty.Mutable``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-mutable </remarks>
        [JsiiProperty("mutable", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Mutable
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.SchemaAttributeProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Name
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.SchemaAttributeProperty.NumberAttributeConstraints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-numberattributeconstraints </remarks>
        [JsiiProperty("numberAttributeConstraints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolResource.NumberAttributeConstraintsProperty\"}]},\"optional\":true}")]
        object NumberAttributeConstraints
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.SchemaAttributeProperty.Required``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-required </remarks>
        [JsiiProperty("required", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Required
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.SchemaAttributeProperty.StringAttributeConstraints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-stringattributeconstraints </remarks>
        [JsiiProperty("stringAttributeConstraints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolResource.StringAttributeConstraintsProperty\"}]},\"optional\":true}")]
        object StringAttributeConstraints
        {
            get;
            set;
        }
    }
}