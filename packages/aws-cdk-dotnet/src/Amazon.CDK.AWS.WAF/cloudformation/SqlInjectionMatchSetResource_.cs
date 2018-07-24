using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.WAF.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-waf-sqlinjectionmatchset.html </remarks>
    [JsiiClass(typeof(SqlInjectionMatchSetResource_), "@aws-cdk/aws-waf.cloudformation.SqlInjectionMatchSetResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-waf.cloudformation.SqlInjectionMatchSetResourceProps\"}}]")]
    public class SqlInjectionMatchSetResource_ : Resource
    {
        public SqlInjectionMatchSetResource_(Construct parent, string name, ISqlInjectionMatchSetResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected SqlInjectionMatchSetResource_(ByRefValue reference): base(reference)
        {
        }

        protected SqlInjectionMatchSetResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(SqlInjectionMatchSetResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}