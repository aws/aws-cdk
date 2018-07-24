using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Events.cloudformation.RuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-inputtransformer.html </remarks>
    [JsiiInterface(typeof(IInputTransformerProperty), "@aws-cdk/aws-events.cloudformation.RuleResource.InputTransformerProperty")]
    public interface IInputTransformerProperty
    {
        /// <summary>``RuleResource.InputTransformerProperty.InputPathsMap``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-inputtransformer.html#cfn-events-rule-inputtransformer-inputpathsmap </remarks>
        [JsiiProperty("inputPathsMap", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object InputPathsMap
        {
            get;
            set;
        }

        /// <summary>``RuleResource.InputTransformerProperty.InputTemplate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-inputtransformer.html#cfn-events-rule-inputtransformer-inputtemplate </remarks>
        [JsiiProperty("inputTemplate", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object InputTemplate
        {
            get;
            set;
        }
    }
}