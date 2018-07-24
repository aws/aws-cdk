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
    public class ActionArtifactBounds : DeputyBase, IActionArtifactBounds
    {
        [JsiiProperty("minInputs", "{\"primitive\":\"number\"}", true)]
        public double MinInputs
        {
            get;
            set;
        }

        [JsiiProperty("maxInputs", "{\"primitive\":\"number\"}", true)]
        public double MaxInputs
        {
            get;
            set;
        }

        [JsiiProperty("minOutputs", "{\"primitive\":\"number\"}", true)]
        public double MinOutputs
        {
            get;
            set;
        }

        [JsiiProperty("maxOutputs", "{\"primitive\":\"number\"}", true)]
        public double MaxOutputs
        {
            get;
            set;
        }
    }
}