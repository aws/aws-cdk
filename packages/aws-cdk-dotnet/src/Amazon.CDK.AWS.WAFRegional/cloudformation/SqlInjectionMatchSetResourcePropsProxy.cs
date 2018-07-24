using Amazon.CDK;
using Amazon.CDK.AWS.WAFRegional.cloudformation.SqlInjectionMatchSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAFRegional.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html </remarks>
    [JsiiInterfaceProxy(typeof(ISqlInjectionMatchSetResourceProps), "@aws-cdk/aws-wafregional.cloudformation.SqlInjectionMatchSetResourceProps")]
    internal class SqlInjectionMatchSetResourcePropsProxy : DeputyBase, ISqlInjectionMatchSetResourceProps
    {
        private SqlInjectionMatchSetResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::WAFRegional::SqlInjectionMatchSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html#cfn-wafregional-sqlinjectionmatchset-name </remarks>
        [JsiiProperty("sqlInjectionMatchSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object SqlInjectionMatchSetName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::WAFRegional::SqlInjectionMatchSet.SqlInjectionMatchTuples``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafregional-sqlinjectionmatchset.html#cfn-wafregional-sqlinjectionmatchset-sqlinjectionmatchtuples </remarks>
        [JsiiProperty("sqlInjectionMatchTuples", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-wafregional.cloudformation.SqlInjectionMatchSetResource.SqlInjectionMatchTupleProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object SqlInjectionMatchTuples
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}