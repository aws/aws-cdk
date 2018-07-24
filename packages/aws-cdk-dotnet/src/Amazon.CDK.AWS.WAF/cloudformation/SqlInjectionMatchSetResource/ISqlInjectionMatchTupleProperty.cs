using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAF.cloudformation.SqlInjectionMatchSetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sqlinjectionmatchset-sqlinjectionmatchtuples.html </remarks>
    [JsiiInterface(typeof(ISqlInjectionMatchTupleProperty), "@aws-cdk/aws-waf.cloudformation.SqlInjectionMatchSetResource.SqlInjectionMatchTupleProperty")]
    public interface ISqlInjectionMatchTupleProperty
    {
        /// <summary>``SqlInjectionMatchSetResource.SqlInjectionMatchTupleProperty.FieldToMatch``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sqlinjectionmatchset-sqlinjectionmatchtuples.html#cfn-waf-sqlinjectionmatchset-sqlinjectionmatchtuples-fieldtomatch </remarks>
        [JsiiProperty("fieldToMatch", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-waf.cloudformation.SqlInjectionMatchSetResource.FieldToMatchProperty\"}]}}")]
        object FieldToMatch
        {
            get;
            set;
        }

        /// <summary>``SqlInjectionMatchSetResource.SqlInjectionMatchTupleProperty.TextTransformation``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waf-sqlinjectionmatchset-sqlinjectionmatchtuples.html#cfn-waf-sqlinjectionmatchset-sqlinjectionmatchtuples-texttransformation </remarks>
        [JsiiProperty("textTransformation", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object TextTransformation
        {
            get;
            set;
        }
    }
}