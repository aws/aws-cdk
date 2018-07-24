using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html </remarks>
    [JsiiInterface(typeof(IResolverResourceProps), "@aws-cdk/aws-appsync.cloudformation.ResolverResourceProps")]
    public interface IResolverResourceProps
    {
        /// <summary>``AWS::AppSync::Resolver.ApiId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-apiid </remarks>
        [JsiiProperty("apiId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ApiId
        {
            get;
            set;
        }

        /// <summary>``AWS::AppSync::Resolver.DataSourceName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-datasourcename </remarks>
        [JsiiProperty("dataSourceName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DataSourceName
        {
            get;
            set;
        }

        /// <summary>``AWS::AppSync::Resolver.FieldName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-fieldname </remarks>
        [JsiiProperty("fieldName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object FieldName
        {
            get;
            set;
        }

        /// <summary>``AWS::AppSync::Resolver.TypeName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-typename </remarks>
        [JsiiProperty("typeName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object TypeName
        {
            get;
            set;
        }

        /// <summary>``AWS::AppSync::Resolver.RequestMappingTemplate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-requestmappingtemplate </remarks>
        [JsiiProperty("requestMappingTemplate", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RequestMappingTemplate
        {
            get;
            set;
        }

        /// <summary>``AWS::AppSync::Resolver.RequestMappingTemplateS3Location``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-requestmappingtemplates3location </remarks>
        [JsiiProperty("requestMappingTemplateS3Location", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RequestMappingTemplateS3Location
        {
            get;
            set;
        }

        /// <summary>``AWS::AppSync::Resolver.ResponseMappingTemplate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-responsemappingtemplate </remarks>
        [JsiiProperty("responseMappingTemplate", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ResponseMappingTemplate
        {
            get;
            set;
        }

        /// <summary>``AWS::AppSync::Resolver.ResponseMappingTemplateS3Location``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html#cfn-appsync-resolver-responsemappingtemplates3location </remarks>
        [JsiiProperty("responseMappingTemplateS3Location", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ResponseMappingTemplateS3Location
        {
            get;
            set;
        }
    }
}