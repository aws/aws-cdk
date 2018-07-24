using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiInterface(typeof(ISecretProps), "@aws-cdk/cdk.SecretProps")]
    public interface ISecretProps
    {
        /// <summary>The name of the SSM parameter where the secret value is stored.</summary>
        [JsiiProperty("ssmParameter", "{\"primitive\":\"string\"}")]
        string SsmParameter
        {
            get;
            set;
        }

        /// <summary>A string of up to 4000 characters that describes the parameter.</summary>
        /// <remarks>default: No description</remarks>
        [JsiiProperty("description", "{\"primitive\":\"string\",\"optional\":true}")]
        string Description
        {
            get;
            set;
        }

        /// <summary>A regular expression that represents the patterns to allow for String types.</summary>
        [JsiiProperty("allowedPattern", "{\"primitive\":\"string\",\"optional\":true}")]
        string AllowedPattern
        {
            get;
            set;
        }

        /// <summary>An array containing the list of values allowed for the parameter.</summary>
        [JsiiProperty("allowedValues", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}},\"optional\":true}")]
        string[] AllowedValues
        {
            get;
            set;
        }

        /// <summary>
        /// A string that explains a constraint when the constraint is violated.
        /// For example, without a constraint description, a parameter that has an allowed
        /// pattern of [A-Za-z0-9]+ displays the following error message when the user specifies
        /// an invalid value:
        /// </summary>
        [JsiiProperty("constraintDescription", "{\"primitive\":\"string\",\"optional\":true}")]
        string ConstraintDescription
        {
            get;
            set;
        }

        /// <summary>An integer value that determines the largest number of characters you want to allow for String types.</summary>
        [JsiiProperty("maxLength", "{\"primitive\":\"number\",\"optional\":true}")]
        double? MaxLength
        {
            get;
            set;
        }

        /// <summary>An integer value that determines the smallest number of characters you want to allow for String types.</summary>
        [JsiiProperty("minLength", "{\"primitive\":\"number\",\"optional\":true}")]
        double? MinLength
        {
            get;
            set;
        }
    }
}