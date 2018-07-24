using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Inspector.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html </remarks>
    [JsiiInterface(typeof(IAssessmentTemplateResourceProps), "@aws-cdk/aws-inspector.cloudformation.AssessmentTemplateResourceProps")]
    public interface IAssessmentTemplateResourceProps
    {
        /// <summary>``AWS::Inspector::AssessmentTemplate.AssessmentTargetArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-assessmenttargetarn </remarks>
        [JsiiProperty("assessmentTargetArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object AssessmentTargetArn
        {
            get;
            set;
        }

        /// <summary>``AWS::Inspector::AssessmentTemplate.DurationInSeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-durationinseconds </remarks>
        [JsiiProperty("durationInSeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DurationInSeconds
        {
            get;
            set;
        }

        /// <summary>``AWS::Inspector::AssessmentTemplate.RulesPackageArns``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-rulespackagearns </remarks>
        [JsiiProperty("rulesPackageArns", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}")]
        object RulesPackageArns
        {
            get;
            set;
        }

        /// <summary>``AWS::Inspector::AssessmentTemplate.AssessmentTemplateName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-assessmenttemplatename </remarks>
        [JsiiProperty("assessmentTemplateName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AssessmentTemplateName
        {
            get;
            set;
        }

        /// <summary>``AWS::Inspector::AssessmentTemplate.UserAttributesForFindings``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html#cfn-inspector-assessmenttemplate-userattributesforfindings </remarks>
        [JsiiProperty("userAttributesForFindings", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}")]
        object UserAttributesForFindings
        {
            get;
            set;
        }
    }
}