using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// A construct, which is part of a stack and can be referenced using it's logical ID
    /// using the CloudFormation intrinsic function { Ref: ID }.
    /// </summary>
    [JsiiClass(typeof(Referenceable), "@aws-cdk/cdk.Referenceable", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class Referenceable : StackElement
    {
        protected Referenceable(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected Referenceable(ByRefValue reference): base(reference)
        {
        }

        protected Referenceable(DeputyProps props): base(props)
        {
        }

        /// <summary>Returns a token to a CloudFormation { Ref } that references this entity based on it's logical ID.</summary>
        [JsiiProperty("ref", "{\"fqn\":\"@aws-cdk/cdk.Token\"}")]
        public virtual Token Ref
        {
            get => GetInstanceProperty<Token>();
        }
    }
}