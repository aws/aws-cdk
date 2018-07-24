using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Space delimited text pattern</summary>
    [JsiiClass(typeof(SpaceDelimitedTextPattern), "@aws-cdk/aws-logs.SpaceDelimitedTextPattern", "[{\"name\":\"columns\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}},{\"name\":\"restrictions\",\"type\":{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-logs.ColumnRestriction\"}}}}}}]")]
    public class SpaceDelimitedTextPattern : DeputyBase, IIFilterPattern
    {
        public SpaceDelimitedTextPattern(string[] columns, IDictionary<string, IColumnRestriction[]> restrictions): base(new DeputyProps(new object[]{columns, restrictions}))
        {
        }

        protected SpaceDelimitedTextPattern(ByRefValue reference): base(reference)
        {
        }

        protected SpaceDelimitedTextPattern(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("logPatternString", "{\"primitive\":\"string\"}")]
        public virtual string LogPatternString
        {
            get => GetInstanceProperty<string>();
        }

        /// <summary>
        /// Construct a new instance of a space delimited text pattern
        /// 
        /// Since this class must be public, we can't rely on the user only creating it through
        /// the `LogPattern.spaceDelimited()` factory function. We must therefore validate the
        /// argument in the constructor. Since we're returning a copy on every mutation, and we
        /// don't want to re-validate the same things on every construction, we provide a limited
        /// set of mutator functions and only validate the new data every time.
        /// </summary>
        [JsiiMethod("construct", "{\"fqn\":\"@aws-cdk/aws-logs.SpaceDelimitedTextPattern\"}", "[{\"name\":\"columns\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}}]")]
        public static SpaceDelimitedTextPattern Construct(string[] columns)
        {
            return InvokeStaticMethod<SpaceDelimitedTextPattern>(typeof(SpaceDelimitedTextPattern), new object[]{columns});
        }

        /// <summary>Restrict where the pattern applies</summary>
        [JsiiMethod("whereString", "{\"fqn\":\"@aws-cdk/aws-logs.SpaceDelimitedTextPattern\"}", "[{\"name\":\"columnName\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"comparison\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"value\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual SpaceDelimitedTextPattern WhereString(string columnName, string comparison, string value)
        {
            return InvokeInstanceMethod<SpaceDelimitedTextPattern>(new object[]{columnName, comparison, value});
        }

        /// <summary>Restrict where the pattern applies</summary>
        [JsiiMethod("whereNumber", "{\"fqn\":\"@aws-cdk/aws-logs.SpaceDelimitedTextPattern\"}", "[{\"name\":\"columnName\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"comparison\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"value\",\"type\":{\"primitive\":\"number\"}}]")]
        public virtual SpaceDelimitedTextPattern WhereNumber(string columnName, string comparison, double value)
        {
            return InvokeInstanceMethod<SpaceDelimitedTextPattern>(new object[]{columnName, comparison, value});
        }
    }
}