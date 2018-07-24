using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation.SqlInjectionMatchSetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple.html </remarks>
    [JsiiInterfaceProxy(typeof(ISqlInjectionMatchTupleProperty), "@aws-cdk/aws-wafregional.cloudformation.SqlInjectionMatchSetResource.SqlInjectionMatchTupleProperty")]
    internal class SqlInjectionMatchTuplePropertyProxy : DeputyBase, ISqlInjectionMatchTupleProperty
    {
        private SqlInjectionMatchTuplePropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``SqlInjectionMatchSetResource.SqlInjectionMatchTupleProperty.FieldToMatch``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple.html#cfn-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple-fieldtomatch </remarks>
        [JsiiProperty("fieldToMatch", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.SqlInjectionMatchSetResource.FieldToMatchProperty\"}]}}")]
        public virtual object FieldToMatch
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``SqlInjectionMatchSetResource.SqlInjectionMatchTupleProperty.TextTransformation``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple.html#cfn-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuple-texttransformation </remarks>
        [JsiiProperty("textTransformation", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object TextTransformation
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}