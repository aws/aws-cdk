using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>A collection of static methods to generate appropriate ILogPatterns</summary>
    [JsiiClass(typeof(FilterPattern), "@aws-cdk/aws-logs.FilterPattern", "[]")]
    public class FilterPattern : DeputyBase
    {
        public FilterPattern(): base(new DeputyProps(new object[]{}))
        {
        }

        protected FilterPattern(ByRefValue reference): base(reference)
        {
        }

        protected FilterPattern(DeputyProps props): base(props)
        {
        }

        /// <summary>
        /// Use the given string as log pattern.
        /// 
        /// See https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html
        /// for information on writing log patterns.
        /// </summary>
        /// <param name = "logPatternString">The pattern string to use.</param>
        [JsiiMethod("literal", "{\"fqn\":\"@aws-cdk/aws-logs.IFilterPattern\"}", "[{\"name\":\"logPatternString\",\"type\":{\"primitive\":\"string\"}}]")]
        public static IIFilterPattern Literal(string logPatternString)
        {
            return InvokeStaticMethod<IIFilterPattern>(typeof(FilterPattern), new object[]{logPatternString});
        }

        /// <summary>A log pattern that matches all events.</summary>
        [JsiiMethod("allEvents", "{\"fqn\":\"@aws-cdk/aws-logs.IFilterPattern\"}", "[]")]
        public static IIFilterPattern AllEvents()
        {
            return InvokeStaticMethod<IIFilterPattern>(typeof(FilterPattern), new object[]{});
        }

        /// <summary>A log pattern that matches if all the strings given appear in the event.</summary>
        /// <param name = "terms">The words to search for. All terms must match.</param>
        [JsiiMethod("allTerms", "{\"fqn\":\"@aws-cdk/aws-logs.IFilterPattern\"}", "[{\"name\":\"terms\",\"type\":{\"primitive\":\"string\"}}]")]
        public static IIFilterPattern AllTerms(string terms)
        {
            return InvokeStaticMethod<IIFilterPattern>(typeof(FilterPattern), new object[]{terms});
        }

        /// <summary>A log pattern that matches if any of the strings given appear in the event.</summary>
        /// <param name = "terms">The words to search for. Any terms must match.</param>
        [JsiiMethod("anyTerm", "{\"fqn\":\"@aws-cdk/aws-logs.IFilterPattern\"}", "[{\"name\":\"terms\",\"type\":{\"primitive\":\"string\"}}]")]
        public static IIFilterPattern AnyTerm(string terms)
        {
            return InvokeStaticMethod<IIFilterPattern>(typeof(FilterPattern), new object[]{terms});
        }

        /// <summary>
        /// A log pattern that matches if any of the given term groups matches the event.
        /// 
        /// A term group matches an event if all the terms in it appear in the event string.
        /// </summary>
        /// <param name = "termGroups">A list of term groups to search for. Any one of the clauses must match.</param>
        [JsiiMethod("anyTermGroup", "{\"fqn\":\"@aws-cdk/aws-logs.IFilterPattern\"}", "[{\"name\":\"termGroups\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}}]")]
        public static IIFilterPattern AnyTermGroup(string[] termGroups)
        {
            return InvokeStaticMethod<IIFilterPattern>(typeof(FilterPattern), new object[]{termGroups});
        }

        /// <summary>
        /// A JSON log pattern that compares string values.
        /// 
        /// This pattern only matches if the event is a JSON event, and the indicated field inside
        /// compares with the string value.
        /// 
        /// Use '$' to indicate the root of the JSON structure. The comparison operator can only
        /// compare equality or inequality. The '*' wildcard may appear in the value may at the
        /// start or at the end.
        /// 
        /// For more information, see:
        /// 
        /// https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html
        /// </summary>
        /// <param name = "jsonField">Field inside JSON. Example: "$.myField"</param>
        /// <param name = "comparison">Comparison to carry out. Either = or !=.</param>
        /// <param name = "value">The string value to compare to. May use '*' as wildcard at start or end of string.</param>
        [JsiiMethod("stringValue", "{\"fqn\":\"@aws-cdk/aws-logs.JSONPattern\"}", "[{\"name\":\"jsonField\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"comparison\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"value\",\"type\":{\"primitive\":\"string\"}}]")]
        public static JSONPattern StringValue(string jsonField, string comparison, string value)
        {
            return InvokeStaticMethod<JSONPattern>(typeof(FilterPattern), new object[]{jsonField, comparison, value});
        }

        /// <summary>
        /// A JSON log pattern that compares numerical values.
        /// 
        /// This pattern only matches if the event is a JSON event, and the indicated field inside
        /// compares with the value in the indicated way.
        /// 
        /// Use '$' to indicate the root of the JSON structure. The comparison operator can only
        /// compare equality or inequality. The '*' wildcard may appear in the value may at the
        /// start or at the end.
        /// 
        /// For more information, see:
        /// 
        /// https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html
        /// </summary>
        /// <param name = "jsonField">Field inside JSON. Example: "$.myField"</param>
        /// <param name = "comparison">Comparison to carry out. One of =, !=, &lt;, &lt;=, &gt;, &gt;=.</param>
        /// <param name = "value">The numerical value to compare to</param>
        [JsiiMethod("numberValue", "{\"fqn\":\"@aws-cdk/aws-logs.JSONPattern\"}", "[{\"name\":\"jsonField\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"comparison\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"value\",\"type\":{\"primitive\":\"number\"}}]")]
        public static JSONPattern NumberValue(string jsonField, string comparison, double value)
        {
            return InvokeStaticMethod<JSONPattern>(typeof(FilterPattern), new object[]{jsonField, comparison, value});
        }

        /// <summary>A JSON log pattern that matches if the field exists and has the special value 'null'.</summary>
        /// <param name = "jsonField">Field inside JSON. Example: "$.myField"</param>
        [JsiiMethod("isNull", "{\"fqn\":\"@aws-cdk/aws-logs.JSONPattern\"}", "[{\"name\":\"jsonField\",\"type\":{\"primitive\":\"string\"}}]")]
        public static JSONPattern IsNull(string jsonField)
        {
            return InvokeStaticMethod<JSONPattern>(typeof(FilterPattern), new object[]{jsonField});
        }

        /// <summary>A JSON log pattern that matches if the field does not exist.</summary>
        /// <param name = "jsonField">Field inside JSON. Example: "$.myField"</param>
        [JsiiMethod("notExists", "{\"fqn\":\"@aws-cdk/aws-logs.JSONPattern\"}", "[{\"name\":\"jsonField\",\"type\":{\"primitive\":\"string\"}}]")]
        public static JSONPattern NotExists(string jsonField)
        {
            return InvokeStaticMethod<JSONPattern>(typeof(FilterPattern), new object[]{jsonField});
        }

        /// <summary>
        /// A JSON log patter that matches if the field exists.
        /// 
        /// This is a readable convenience wrapper over 'field = *'
        /// </summary>
        /// <param name = "jsonField">Field inside JSON. Example: "$.myField"</param>
        [JsiiMethod("exists", "{\"fqn\":\"@aws-cdk/aws-logs.JSONPattern\"}", "[{\"name\":\"jsonField\",\"type\":{\"primitive\":\"string\"}}]")]
        public static JSONPattern Exists(string jsonField)
        {
            return InvokeStaticMethod<JSONPattern>(typeof(FilterPattern), new object[]{jsonField});
        }

        /// <summary>A JSON log pattern that matches if the field exists and equals the boolean value.</summary>
        /// <param name = "jsonField">Field inside JSON. Example: "$.myField"</param>
        /// <param name = "value">The value to match</param>
        [JsiiMethod("booleanValue", "{\"fqn\":\"@aws-cdk/aws-logs.JSONPattern\"}", "[{\"name\":\"jsonField\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"value\",\"type\":{\"primitive\":\"boolean\"}}]")]
        public static JSONPattern BooleanValue(string jsonField, bool value)
        {
            return InvokeStaticMethod<JSONPattern>(typeof(FilterPattern), new object[]{jsonField, value});
        }

        /// <summary>A JSON log pattern that matches if all given JSON log patterns match</summary>
        [JsiiMethod("all", "{\"fqn\":\"@aws-cdk/aws-logs.JSONPattern\"}", "[{\"name\":\"patterns\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.JSONPattern\"}}]")]
        public static JSONPattern All(JSONPattern patterns)
        {
            return InvokeStaticMethod<JSONPattern>(typeof(FilterPattern), new object[]{patterns});
        }

        /// <summary>A JSON log pattern that matches if any of the given JSON log patterns match</summary>
        [JsiiMethod("any", "{\"fqn\":\"@aws-cdk/aws-logs.JSONPattern\"}", "[{\"name\":\"patterns\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.JSONPattern\"}}]")]
        public static JSONPattern Any(JSONPattern patterns)
        {
            return InvokeStaticMethod<JSONPattern>(typeof(FilterPattern), new object[]{patterns});
        }

        /// <summary>
        /// A space delimited log pattern matcher.
        /// 
        /// The log event is divided into space-delimited columns (optionally
        /// enclosed by "" or [] to capture spaces into column values), and names
        /// are given to each column.
        /// 
        /// '...' may be specified once to match any number of columns.
        /// 
        /// Afterwards, conditions may be added to individual columns.
        /// </summary>
        /// <param name = "columns">The columns in the space-delimited log stream.</param>
        [JsiiMethod("spaceDelimited", "{\"fqn\":\"@aws-cdk/aws-logs.SpaceDelimitedTextPattern\"}", "[{\"name\":\"columns\",\"type\":{\"primitive\":\"string\"}}]")]
        public static SpaceDelimitedTextPattern SpaceDelimited(string columns)
        {
            return InvokeStaticMethod<SpaceDelimitedTextPattern>(typeof(FilterPattern), new object[]{columns});
        }
    }
}