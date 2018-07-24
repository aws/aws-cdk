using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.AutoScalingPlans.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscalingplans-scalingplan.html </remarks>
    [JsiiClass(typeof(ScalingPlanResource_), "@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResourceProps\"}}]")]
    public class ScalingPlanResource_ : Resource
    {
        public ScalingPlanResource_(Construct parent, string name, IScalingPlanResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ScalingPlanResource_(ByRefValue reference): base(reference)
        {
        }

        protected ScalingPlanResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ScalingPlanResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}