using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html </remarks>
    public class SchemaAttributeProperty : DeputyBase, ISchemaAttributeProperty
    {
        /// <summary>``UserPoolResource.SchemaAttributeProperty.AttributeDataType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-attributedatatype </remarks>
        [JsiiProperty("attributeDataType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object AttributeDataType
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.SchemaAttributeProperty.DeveloperOnlyAttribute``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-developeronlyattribute </remarks>
        [JsiiProperty("developerOnlyAttribute", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DeveloperOnlyAttribute
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.SchemaAttributeProperty.Mutable``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-mutable </remarks>
        [JsiiProperty("mutable", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Mutable
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.SchemaAttributeProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Name
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.SchemaAttributeProperty.NumberAttributeConstraints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-numberattributeconstraints </remarks>
        [JsiiProperty("numberAttributeConstraints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolResource.NumberAttributeConstraintsProperty\"}]},\"optional\":true}", true)]
        public object NumberAttributeConstraints
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.SchemaAttributeProperty.Required``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-required </remarks>
        [JsiiProperty("required", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Required
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.SchemaAttributeProperty.StringAttributeConstraints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-stringattributeconstraints </remarks>
        [JsiiProperty("stringAttributeConstraints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolResource.StringAttributeConstraintsProperty\"}]},\"optional\":true}", true)]
        public object StringAttributeConstraints
        {
            get;
            set;
        }
    }
}