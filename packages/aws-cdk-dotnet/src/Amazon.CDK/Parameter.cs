using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK
{
    /// <summary>
    /// Use the optional Parameters section to customize your templates.
    /// Parameters enable you to input custom values to your template each time you create or
    /// update a stack.
    /// </summary>
    [JsiiClass(typeof(Parameter), "@aws-cdk/cdk.Parameter", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/cdk.ParameterProps\"}}]")]
    public class Parameter : Referenceable
    {
        public Parameter(Construct parent, string name, IParameterProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Parameter(ByRefValue reference): base(reference)
        {
        }

        protected Parameter(DeputyProps props): base(props)
        {
        }

        /// <summary>A token that represents the actual value of this parameter.</summary>
        [JsiiProperty("value", "{\"fqn\":\"@aws-cdk/cdk.Token\"}")]
        public virtual Token Value
        {
            get => GetInstanceProperty<Token>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Returns the CloudFormation 'snippet' for this entity. The snippet will only be merged
        /// at the root level to ensure there are no identity conflicts.
        /// 
        /// For example, a Resource class will return something like:
        /// {
        ///      Resources: {
        ///          [this.logicalId]: {
        ///              Type: this.resourceType,
        ///              Properties: this.props,
        ///              Condition: this.condition
        ///          }
        ///      }
        /// }
        /// </summary>
        [JsiiMethod("toCloudFormation", "{\"primitive\":\"json\"}", "[]")]
        public override JObject ToCloudFormation()
        {
            return InvokeInstanceMethod<JObject>(new object[]{});
        }

        /// <summary>
        /// Allows using parameters as tokens without the need to dereference them.
        /// This implicitly implements Token, until we make it an interface.
        /// </summary>
        [JsiiMethod("resolve", "{\"primitive\":\"any\"}", "[]")]
        public virtual object Resolve()
        {
            return InvokeInstanceMethod<object>(new object[]{});
        }
    }
}