using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation.SqlInjectionMatchSetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-fieldtomatch.html </remarks>
    [JsiiInterfaceProxy(typeof(IFieldToMatchProperty), "@aws-cdk/aws-wafregional.cloudformation.SqlInjectionMatchSetResource.FieldToMatchProperty")]
    internal class FieldToMatchPropertyProxy : DeputyBase, Amazon.CDK.AWS.WAFRegional.cloudformation.SqlInjectionMatchSetResource.IFieldToMatchProperty
    {
        private FieldToMatchPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``SqlInjectionMatchSetResource.FieldToMatchProperty.Data``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-fieldtomatch.html#cfn-wafregional-sqlinjectionmatchset-fieldtomatch-data </remarks>
        [JsiiProperty("data", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Data
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``SqlInjectionMatchSetResource.FieldToMatchProperty.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-fieldtomatch.html#cfn-wafregional-sqlinjectionmatchset-fieldtomatch-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Type
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}