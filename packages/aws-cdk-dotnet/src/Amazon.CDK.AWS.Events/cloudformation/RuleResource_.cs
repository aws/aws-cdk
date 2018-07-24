using Amazon.CDK;
using Amazon.CDK.AWS.Events;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Events.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-rule.html </remarks>
    [JsiiClass(typeof(RuleResource_), "@aws-cdk/aws-events.cloudformation.RuleResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.cloudformation.RuleResourceProps\",\"optional\":true}}]")]
    public class RuleResource_ : Resource
    {
        public RuleResource_(Construct parent, string name, IRuleResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected RuleResource_(ByRefValue reference): base(reference)
        {
        }

        protected RuleResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(RuleResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("ruleArn", "{\"fqn\":\"@aws-cdk/aws-events.RuleArn\"}")]
        public virtual RuleArn RuleArn
        {
            get => GetInstanceProperty<RuleArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}