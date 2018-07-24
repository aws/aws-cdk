using Amazon.CDK;
using Amazon.CDK.AWS.CodePipeline.cloudformation.PipelineResource;
using Amazon.CDK.AWS.Events;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>
    /// A stage in a pipeline. Stages are added to a pipeline by constructing a Stage with
    /// the pipeline as the first argument to the constructor.
    /// </summary>
    /// <remarks>
    /// example: // add a stage to a pipeline
    /// new Stage(pipeline, 'MyStage');
    /// </remarks>
    [JsiiClass(typeof(Stage), "@aws-cdk/aws-codepipeline.Stage", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Pipeline\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public class Stage : Construct
    {
        public Stage(Pipeline parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected Stage(ByRefValue reference): base(reference)
        {
        }

        protected Stage(DeputyProps props): base(props)
        {
        }

        /// <summary>The Pipeline this stage is a member of</summary>
        [JsiiProperty("pipeline", "{\"fqn\":\"@aws-cdk/aws-codepipeline.Pipeline\"}")]
        public virtual Pipeline Pipeline
        {
            get => GetInstanceProperty<Pipeline>();
        }

        /// <summary>Get a duplicate of this stage's list of actions.</summary>
        [JsiiProperty("actions", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-codepipeline.Action\"}}}")]
        public virtual Action[] Actions
        {
            get => GetInstanceProperty<Action[]>();
        }

        /// <summary>
        /// This method can be implemented by derived constructs in order to perform
        /// validation logic. It is called on all constructs before synthesis.
        /// </summary>
        [JsiiMethod("validate", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}", "[]")]
        public override string[] Validate()
        {
            return InvokeInstanceMethod<string[]>(new object[]{});
        }

        [JsiiMethod("render", "{\"fqn\":\"@aws-cdk/aws-codepipeline.cloudformation.PipelineResource.StageDeclarationProperty\"}", "[]")]
        public virtual IStageDeclarationProperty Render()
        {
            return InvokeInstanceMethod<IStageDeclarationProperty>(new object[]{});
        }

        [JsiiMethod("onStateChange", "{\"fqn\":\"@aws-cdk/aws-events.EventRule\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"target\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.IEventRuleTargetProps\",\"optional\":true}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-events.EventRuleProps\",\"optional\":true}}]")]
        public virtual EventRule OnStateChange(string name, IIEventRuleTargetProps target, IEventRuleProps options)
        {
            return InvokeInstanceMethod<EventRule>(new object[]{name, target, options});
        }

        /// <summary>
        /// If an action is added as a child, add it to the list of actions.
        /// TODO: This is a hack that should be removed once the CDK has an
        ///        onChildAdded type hook.
        /// </summary>
        /// <remarks>override: </remarks>
        [JsiiMethod("addChild", null, "[{\"name\":\"child\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
        protected override void AddChild(Construct child, string name)
        {
            InvokeInstanceVoidMethod(new object[]{child, name});
        }
    }
}