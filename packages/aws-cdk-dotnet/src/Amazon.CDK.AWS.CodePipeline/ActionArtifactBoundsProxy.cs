using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodePipeline
{
    /// <summary>
    /// Specifies the constraints on the number of input and output
    /// artifacts an action can have.
    /// 
    /// The constraints for each action type are documented on the
    /// {@link https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html Pipeline Structure Reference} page.
    /// </summary>
    [JsiiInterfaceProxy(typeof(IActionArtifactBounds), "@aws-cdk/aws-codepipeline.ActionArtifactBounds")]
    internal class ActionArtifactBoundsProxy : DeputyBase, IActionArtifactBounds
    {
        private ActionArtifactBoundsProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("minInputs", "{\"primitive\":\"number\"}")]
        public virtual double MinInputs
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("maxInputs", "{\"primitive\":\"number\"}")]
        public virtual double MaxInputs
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("minOutputs", "{\"primitive\":\"number\"}")]
        public virtual double MinOutputs
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("maxOutputs", "{\"primitive\":\"number\"}")]
        public virtual double MaxOutputs
        {
            get => GetInstanceProperty<double>();
            set => SetInstanceProperty(value);
        }
    }
}