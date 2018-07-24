using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK
{
    /// <summary>
    /// The Rules that define template constraints in an AWS Service Catalog portfolio describe when
    /// end users can use the template and which values they can specify for parameters that are declared
    /// in the AWS CloudFormation template used to create the product they are attempting to use. Rules
    /// are useful for preventing end users from inadvertently specifying an incorrect value.
    /// For example, you can add a rule to verify whether end users specified a valid subnet in a
    /// given VPC or used m1.small instance types for test environments. AWS CloudFormation uses
    /// rules to validate parameter values before it creates the resources for the product.
    /// 
    /// A rule can include a RuleCondition property and must include an Assertions property.
    /// For each rule, you can define only one rule condition; you can define one or more asserts within the Assertions property.
    /// You define a rule condition and assertions by using rule-specific intrinsic functions.
    /// </summary>
    /// <remarks>link: https://docs.aws.amazon.com/servicecatalog/latest/adminguide/reference-template_constraint_rules.html </remarks>
    [JsiiClass(typeof(Rule), "@aws-cdk/cdk.Rule", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/cdk.RuleProps\",\"optional\":true}}]")]
    public class Rule : Referenceable
    {
        public Rule(Construct parent, string name, IRuleProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Rule(ByRefValue reference): base(reference)
        {
        }

        protected Rule(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// If the rule condition evaluates to false, the rule doesn't take effect.
        /// If the function in the rule condition evaluates to true, expressions in each assert are evaluated and applied.
        /// </summary>
        [JsiiProperty("ruleCondition", "{\"fqn\":\"@aws-cdk/cdk.FnCondition\",\"optional\":true}")]
        public virtual FnCondition RuleCondition
        {
            get => GetInstanceProperty<FnCondition>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Assertions which define the rule.</summary>
        [JsiiProperty("assertions", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.RuleAssertion\"}},\"optional\":true}")]
        public virtual IRuleAssertion[] Assertions
        {
            get => GetInstanceProperty<IRuleAssertion[]>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Adds an assertion to the rule.</summary>
        /// <param name = "condition">The expression to evaluation.</param>
        /// <param name = "description">The description of the assertion.</param>
        [JsiiMethod("addAssertion", null, "[{\"name\":\"condition\",\"type\":{\"fqn\":\"@aws-cdk/cdk.FnCondition\"}},{\"name\":\"description\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual void AddAssertion(FnCondition condition, string description)
        {
            InvokeInstanceVoidMethod(new object[]{condition, description});
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
    }
}