using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation.TemplateResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-template-template.html </remarks>
    [JsiiInterface(typeof(ITemplateProperty), "@aws-cdk/aws-ses.cloudformation.TemplateResource.TemplateProperty")]
    public interface ITemplateProperty
    {
        /// <summary>``TemplateResource.TemplateProperty.HtmlPart``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-template-template.html#cfn-ses-template-template-htmlpart </remarks>
        [JsiiProperty("htmlPart", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object HtmlPart
        {
            get;
            set;
        }

        /// <summary>``TemplateResource.TemplateProperty.SubjectPart``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-template-template.html#cfn-ses-template-template-subjectpart </remarks>
        [JsiiProperty("subjectPart", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SubjectPart
        {
            get;
            set;
        }

        /// <summary>``TemplateResource.TemplateProperty.TemplateName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-template-template.html#cfn-ses-template-template-templatename </remarks>
        [JsiiProperty("templateName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TemplateName
        {
            get;
            set;
        }

        /// <summary>``TemplateResource.TemplateProperty.TextPart``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-template-template.html#cfn-ses-template-template-textpart </remarks>
        [JsiiProperty("textPart", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TextPart
        {
            get;
            set;
        }
    }
}