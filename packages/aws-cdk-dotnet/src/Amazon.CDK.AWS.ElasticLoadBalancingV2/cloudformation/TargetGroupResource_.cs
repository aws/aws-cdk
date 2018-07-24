using Amazon.CDK;
using Amazon.CDK.AWS.ElasticLoadBalancingV2;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html </remarks>
    [JsiiClass(typeof(TargetGroupResource_), "@aws-cdk/aws-elasticloadbalancingv2.cloudformation.TargetGroupResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-elasticloadbalancingv2.cloudformation.TargetGroupResourceProps\"}}]")]
    public class TargetGroupResource_ : Resource
    {
        public TargetGroupResource_(Construct parent, string name, ITargetGroupResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected TargetGroupResource_(ByRefValue reference): base(reference)
        {
        }

        protected TargetGroupResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(TargetGroupResource_));
        /// <remarks>cloudformation_attribute: LoadBalancerArns</remarks>
        [JsiiProperty("targetGroupLoadBalancerArns", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancingv2.TargetGroupLoadBalancerArns\"}")]
        public virtual TargetGroupLoadBalancerArns TargetGroupLoadBalancerArns
        {
            get => GetInstanceProperty<TargetGroupLoadBalancerArns>();
        }

        /// <remarks>cloudformation_attribute: TargetGroupFullName</remarks>
        [JsiiProperty("targetGroupFullName", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancingv2.TargetGroupFullName\"}")]
        public virtual TargetGroupFullName TargetGroupFullName
        {
            get => GetInstanceProperty<TargetGroupFullName>();
        }

        /// <remarks>cloudformation_attribute: TargetGroupName</remarks>
        [JsiiProperty("targetGroupName", "{\"fqn\":\"@aws-cdk/aws-elasticloadbalancingv2.TargetGroupName\"}")]
        public virtual TargetGroupName TargetGroupName
        {
            get => GetInstanceProperty<TargetGroupName>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}