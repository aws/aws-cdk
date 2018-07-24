using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html </remarks>
    [JsiiClass(typeof(ListenerRuleResource_), "@aws-cdk/aws-elasticloadbalancingv2.cloudformation.ListenerRuleResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-elasticloadbalancingv2.cloudformation.ListenerRuleResourceProps\"}}]")]
    public class ListenerRuleResource_ : Resource
    {
        public ListenerRuleResource_(Construct parent, string name, IListenerRuleResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ListenerRuleResource_(ByRefValue reference): base(reference)
        {
        }

        protected ListenerRuleResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ListenerRuleResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}