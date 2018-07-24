using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>Represents a construct that can be "depended on" via `addDependency`.</summary>
    [JsiiInterfaceProxy(typeof(IIDependable), "@aws-cdk/cdk.IDependable")]
    internal class IDependableProxy : DeputyBase, IIDependable
    {
        private IDependableProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// Returns the set of all stack elements (resources, parameters, conditions)
        /// that should be added when a resource "depends on" this construct.
        /// </summary>
        [JsiiProperty("dependencyElements", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.IDependable\"}}}")]
        public virtual IIDependable[] DependencyElements
        {
            get => GetInstanceProperty<IIDependable[]>();
        }
    }
}