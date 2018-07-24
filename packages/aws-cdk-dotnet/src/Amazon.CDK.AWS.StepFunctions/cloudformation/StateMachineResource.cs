using Amazon.CDK;
using Amazon.CDK.AWS.StepFunctions;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.StepFunctions.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html </remarks>
    [JsiiClass(typeof(StateMachineResource), "@aws-cdk/aws-stepfunctions.cloudformation.StateMachineResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-stepfunctions.cloudformation.StateMachineResourceProps\"}}]")]
    public class StateMachineResource : Resource
    {
        public StateMachineResource(Construct parent, string name, IStateMachineResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected StateMachineResource(ByRefValue reference): base(reference)
        {
        }

        protected StateMachineResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(StateMachineResource));
        /// <remarks>cloudformation_attribute: Name</remarks>
        [JsiiProperty("stateMachineName", "{\"fqn\":\"@aws-cdk/aws-stepfunctions.StateMachineName\"}")]
        public virtual StateMachineName StateMachineName
        {
            get => GetInstanceProperty<StateMachineName>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}