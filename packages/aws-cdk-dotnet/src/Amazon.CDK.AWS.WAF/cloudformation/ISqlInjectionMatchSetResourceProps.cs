using Amazon.CDK;
using Amazon.CDK.AWS.WAF.cloudformation.SqlInjectionMatchSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAF.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sqlinjectionmatchset.html </remarks>
    [JsiiInterface(typeof(ISqlInjectionMatchSetResourceProps), "@aws-cdk/aws-waf.cloudformation.SqlInjectionMatchSetResourceProps")]
    public interface ISqlInjectionMatchSetResourceProps
    {
        /// <summary>``AWS::WAF::SqlInjectionMatchSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sqlinjectionmatchset.html#cfn-waf-sqlinjectionmatchset-name </remarks>
        [JsiiProperty("sqlInjectionMatchSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object SqlInjectionMatchSetName
        {
            get;
            set;
        }

        /// <summary>``AWS::WAF::SqlInjectionMatchSet.SqlInjectionMatchTuples``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sqlinjectionmatchset.html#cfn-waf-sqlinjectionmatchset-sqlinjectionmatchtuples </remarks>
        [JsiiProperty("sqlInjectionMatchTuples", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-waf.cloudformation.SqlInjectionMatchSetResource.SqlInjectionMatchTupleProperty\"}]}}}}]},\"optional\":true}")]
        object SqlInjectionMatchTuples
        {
            get;
            set;
        }
    }
}