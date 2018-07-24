using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Events.cloudformation.RuleResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-inputtransformer.html </remarks>
    [JsiiInterfaceProxy(typeof(IInputTransformerProperty), "@aws-cdk/aws-events.cloudformation.RuleResource.InputTransformerProperty")]
    internal class InputTransformerPropertyProxy : DeputyBase, IInputTransformerProperty
    {
        private InputTransformerPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``RuleResource.InputTransformerProperty.InputPathsMap``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-inputtransformer.html#cfn-events-rule-inputtransformer-inputpathsmap </remarks>
        [JsiiProperty("inputPathsMap", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        public virtual object InputPathsMap
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``RuleResource.InputTransformerProperty.InputTemplate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-events-rule-inputtransformer.html#cfn-events-rule-inputtransformer-inputtemplate </remarks>
        [JsiiProperty("inputTemplate", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object InputTemplate
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}