using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>Represents a construct that can be "depended on" via `addDependency`.</summary>
    public class IDependable : DeputyBase, IIDependable
    {
        /// <summary>
        /// Returns the set of all stack elements (resources, parameters, conditions)
        /// that should be added when a resource "depends on" this construct.
        /// </summary>
        [JsiiProperty("dependencyElements", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.IDependable\"}}}", true)]
        public IIDependable[] DependencyElements
        {
            get;
        }
    }
}