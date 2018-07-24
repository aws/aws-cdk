using Amazon.CDK;
using Amazon.CDK.AWS.WAF.cloudformation.SqlInjectionMatchSetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.WAF.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sqlinjectionmatchset.html </remarks>
    [JsiiInterfaceProxy(typeof(ISqlInjectionMatchSetResourceProps), "@aws-cdk/aws-waf.cloudformation.SqlInjectionMatchSetResourceProps")]
    internal class SqlInjectionMatchSetResourcePropsProxy : DeputyBase, ISqlInjectionMatchSetResourceProps
    {
        private SqlInjectionMatchSetResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::WAF::SqlInjectionMatchSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sqlinjectionmatchset.html#cfn-waf-sqlinjectionmatchset-name </remarks>
        [JsiiProperty("sqlInjectionMatchSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object SqlInjectionMatchSetName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::WAF::SqlInjectionMatchSet.SqlInjectionMatchTuples``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sqlinjectionmatchset.html#cfn-waf-sqlinjectionmatchset-sqlinjectionmatchtuples </remarks>
        [JsiiProperty("sqlInjectionMatchTuples", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-waf.cloudformation.SqlInjectionMatchSetResource.SqlInjectionMatchTupleProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object SqlInjectionMatchTuples
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}