using Amazon.CDK;
using Amazon.CDK.AWS.SES.cloudformation.TemplateResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-template.html </remarks>
    [JsiiInterfaceProxy(typeof(ITemplateResourceProps), "@aws-cdk/aws-ses.cloudformation.TemplateResourceProps")]
    internal class TemplateResourcePropsProxy : DeputyBase, ITemplateResourceProps
    {
        private TemplateResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::SES::Template.Template``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-template.html#cfn-ses-template-template </remarks>
        [JsiiProperty("template", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ses.cloudformation.TemplateResource.TemplateProperty\"}]},\"optional\":true}")]
        public virtual object Template
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}