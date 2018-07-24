using Amazon.CDK;
using Amazon.CDK.AWS.WAFRegional.cloudformation.SqlInjectionMatchSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html </remarks>
    public class SqlInjectionMatchSetResourceProps : DeputyBase, ISqlInjectionMatchSetResourceProps
    {
        /// <summary>``AWS::WAFRegional::SqlInjectionMatchSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html#cfn-wafregional-sqlinjectionmatchset-name </remarks>
        [JsiiProperty("sqlInjectionMatchSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object SqlInjectionMatchSetName
        {
            get;
            set;
        }

        /// <summary>``AWS::WAFRegional::SqlInjectionMatchSet.SqlInjectionMatchTuples``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html#cfn-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuples </remarks>
        [JsiiProperty("sqlInjectionMatchTuples", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.SqlInjectionMatchSetResource.SqlInjectionMatchTupleProperty\"}]}}}}]},\"optional\":true}", true)]
        public object SqlInjectionMatchTuples
        {
            get;
            set;
        }
    }
}