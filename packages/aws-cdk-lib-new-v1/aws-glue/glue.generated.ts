/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::Glue::Classifier` resource creates an AWS Glue classifier that categorizes data sources and specifies schemas.
 *
 * For more information, see [Adding Classifiers to a Crawler](https://docs.aws.amazon.com/glue/latest/dg/add-classifier.html) and [Classifier Structure](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-crawler-classifiers.html#aws-glue-api-crawler-classifiers-Classifier) in the *AWS Glue Developer Guide* .
 *
 * @cloudformationResource AWS::Glue::Classifier
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-classifier.html
 */
export class CfnClassifier extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::Classifier";

  /**
   * Build a CfnClassifier from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnClassifier {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnClassifierPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnClassifier(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A classifier for comma-separated values (CSV).
   */
  public csvClassifier?: CfnClassifier.CsvClassifierProperty | cdk.IResolvable;

  /**
   * A classifier that uses `grok` .
   */
  public grokClassifier?: CfnClassifier.GrokClassifierProperty | cdk.IResolvable;

  /**
   * A classifier for JSON content.
   */
  public jsonClassifier?: cdk.IResolvable | CfnClassifier.JsonClassifierProperty;

  /**
   * A classifier for XML content.
   */
  public xmlClassifier?: cdk.IResolvable | CfnClassifier.XMLClassifierProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnClassifierProps = {}) {
    super(scope, id, {
      "type": CfnClassifier.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.csvClassifier = props.csvClassifier;
    this.grokClassifier = props.grokClassifier;
    this.jsonClassifier = props.jsonClassifier;
    this.xmlClassifier = props.xmlClassifier;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "csvClassifier": this.csvClassifier,
      "grokClassifier": this.grokClassifier,
      "jsonClassifier": this.jsonClassifier,
      "xmlClassifier": this.xmlClassifier
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnClassifier.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnClassifierPropsToCloudFormation(props);
  }
}

export namespace CfnClassifier {
  /**
   * A classifier for `XML` content.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-xmlclassifier.html
   */
  export interface XMLClassifierProperty {
    /**
     * An identifier of the data format that the classifier matches.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-xmlclassifier.html#cfn-glue-classifier-xmlclassifier-classification
     */
    readonly classification: string;

    /**
     * The name of the classifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-xmlclassifier.html#cfn-glue-classifier-xmlclassifier-name
     */
    readonly name?: string;

    /**
     * The XML tag designating the element that contains each record in an XML document being parsed.
     *
     * This can't identify a self-closing element (closed by `/>` ). An empty row element that contains only attributes can be parsed as long as it ends with a closing tag (for example, `<row item_a="A" item_b="B"></row>` is okay, but `<row item_a="A" item_b="B" />` is not).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-xmlclassifier.html#cfn-glue-classifier-xmlclassifier-rowtag
     */
    readonly rowTag: string;
  }

  /**
   * A classifier for `JSON` content.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-jsonclassifier.html
   */
  export interface JsonClassifierProperty {
    /**
     * A `JsonPath` string defining the JSON data for the classifier to classify.
     *
     * AWS Glue supports a subset of `JsonPath` , as described in [Writing JsonPath Custom Classifiers](https://docs.aws.amazon.com/glue/latest/dg/custom-classifier.html#custom-classifier-json) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-jsonclassifier.html#cfn-glue-classifier-jsonclassifier-jsonpath
     */
    readonly jsonPath: string;

    /**
     * The name of the classifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-jsonclassifier.html#cfn-glue-classifier-jsonclassifier-name
     */
    readonly name?: string;
  }

  /**
   * A classifier for custom `CSV` content.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-csvclassifier.html
   */
  export interface CsvClassifierProperty {
    /**
     * Enables the processing of files that contain only one column.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-csvclassifier.html#cfn-glue-classifier-csvclassifier-allowsinglecolumn
     */
    readonly allowSingleColumn?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-csvclassifier.html#cfn-glue-classifier-csvclassifier-containscustomdatatype
     */
    readonly containsCustomDatatype?: Array<string>;

    /**
     * Indicates whether the CSV file contains a header.
     *
     * A value of `UNKNOWN` specifies that the classifier will detect whether the CSV file contains headings.
     *
     * A value of `PRESENT` specifies that the CSV file contains headings.
     *
     * A value of `ABSENT` specifies that the CSV file does not contain headings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-csvclassifier.html#cfn-glue-classifier-csvclassifier-containsheader
     */
    readonly containsHeader?: string;

    /**
     * Enables the custom datatype to be configured.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-csvclassifier.html#cfn-glue-classifier-csvclassifier-customdatatypeconfigured
     */
    readonly customDatatypeConfigured?: boolean | cdk.IResolvable;

    /**
     * A custom symbol to denote what separates each column entry in the row.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-csvclassifier.html#cfn-glue-classifier-csvclassifier-delimiter
     */
    readonly delimiter?: string;

    /**
     * Specifies not to trim values before identifying the type of column values.
     *
     * The default value is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-csvclassifier.html#cfn-glue-classifier-csvclassifier-disablevaluetrimming
     */
    readonly disableValueTrimming?: boolean | cdk.IResolvable;

    /**
     * A list of strings representing column names.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-csvclassifier.html#cfn-glue-classifier-csvclassifier-header
     */
    readonly header?: Array<string>;

    /**
     * The name of the classifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-csvclassifier.html#cfn-glue-classifier-csvclassifier-name
     */
    readonly name?: string;

    /**
     * A custom symbol to denote what combines content into a single column value.
     *
     * It must be different from the column delimiter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-csvclassifier.html#cfn-glue-classifier-csvclassifier-quotesymbol
     */
    readonly quoteSymbol?: string;
  }

  /**
   * A classifier that uses `grok` patterns.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-grokclassifier.html
   */
  export interface GrokClassifierProperty {
    /**
     * An identifier of the data format that the classifier matches, such as Twitter, JSON, Omniture logs, and so on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-grokclassifier.html#cfn-glue-classifier-grokclassifier-classification
     */
    readonly classification: string;

    /**
     * Optional custom grok patterns defined by this classifier.
     *
     * For more information, see custom patterns in [Writing Custom Classifiers](https://docs.aws.amazon.com/glue/latest/dg/custom-classifier.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-grokclassifier.html#cfn-glue-classifier-grokclassifier-custompatterns
     */
    readonly customPatterns?: string;

    /**
     * The grok pattern applied to a data store by this classifier.
     *
     * For more information, see built-in patterns in [Writing Custom Classifiers](https://docs.aws.amazon.com/glue/latest/dg/custom-classifier.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-grokclassifier.html#cfn-glue-classifier-grokclassifier-grokpattern
     */
    readonly grokPattern: string;

    /**
     * The name of the classifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-classifier-grokclassifier.html#cfn-glue-classifier-grokclassifier-name
     */
    readonly name?: string;
  }
}

/**
 * Properties for defining a `CfnClassifier`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-classifier.html
 */
export interface CfnClassifierProps {
  /**
   * A classifier for comma-separated values (CSV).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-classifier.html#cfn-glue-classifier-csvclassifier
   */
  readonly csvClassifier?: CfnClassifier.CsvClassifierProperty | cdk.IResolvable;

  /**
   * A classifier that uses `grok` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-classifier.html#cfn-glue-classifier-grokclassifier
   */
  readonly grokClassifier?: CfnClassifier.GrokClassifierProperty | cdk.IResolvable;

  /**
   * A classifier for JSON content.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-classifier.html#cfn-glue-classifier-jsonclassifier
   */
  readonly jsonClassifier?: cdk.IResolvable | CfnClassifier.JsonClassifierProperty;

  /**
   * A classifier for XML content.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-classifier.html#cfn-glue-classifier-xmlclassifier
   */
  readonly xmlClassifier?: cdk.IResolvable | CfnClassifier.XMLClassifierProperty;
}

/**
 * Determine whether the given properties match those of a `XMLClassifierProperty`
 *
 * @param properties - the TypeScript properties of a `XMLClassifierProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClassifierXMLClassifierPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("classification", cdk.requiredValidator)(properties.classification));
  errors.collect(cdk.propertyValidator("classification", cdk.validateString)(properties.classification));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("rowTag", cdk.requiredValidator)(properties.rowTag));
  errors.collect(cdk.propertyValidator("rowTag", cdk.validateString)(properties.rowTag));
  return errors.wrap("supplied properties not correct for \"XMLClassifierProperty\"");
}

// @ts-ignore TS6133
function convertCfnClassifierXMLClassifierPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClassifierXMLClassifierPropertyValidator(properties).assertSuccess();
  return {
    "Classification": cdk.stringToCloudFormation(properties.classification),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RowTag": cdk.stringToCloudFormation(properties.rowTag)
  };
}

// @ts-ignore TS6133
function CfnClassifierXMLClassifierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnClassifier.XMLClassifierProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClassifier.XMLClassifierProperty>();
  ret.addPropertyResult("classification", "Classification", (properties.Classification != null ? cfn_parse.FromCloudFormation.getString(properties.Classification) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("rowTag", "RowTag", (properties.RowTag != null ? cfn_parse.FromCloudFormation.getString(properties.RowTag) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JsonClassifierProperty`
 *
 * @param properties - the TypeScript properties of a `JsonClassifierProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClassifierJsonClassifierPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("jsonPath", cdk.requiredValidator)(properties.jsonPath));
  errors.collect(cdk.propertyValidator("jsonPath", cdk.validateString)(properties.jsonPath));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"JsonClassifierProperty\"");
}

// @ts-ignore TS6133
function convertCfnClassifierJsonClassifierPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClassifierJsonClassifierPropertyValidator(properties).assertSuccess();
  return {
    "JsonPath": cdk.stringToCloudFormation(properties.jsonPath),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnClassifierJsonClassifierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnClassifier.JsonClassifierProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClassifier.JsonClassifierProperty>();
  ret.addPropertyResult("jsonPath", "JsonPath", (properties.JsonPath != null ? cfn_parse.FromCloudFormation.getString(properties.JsonPath) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CsvClassifierProperty`
 *
 * @param properties - the TypeScript properties of a `CsvClassifierProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClassifierCsvClassifierPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowSingleColumn", cdk.validateBoolean)(properties.allowSingleColumn));
  errors.collect(cdk.propertyValidator("containsCustomDatatype", cdk.listValidator(cdk.validateString))(properties.containsCustomDatatype));
  errors.collect(cdk.propertyValidator("containsHeader", cdk.validateString)(properties.containsHeader));
  errors.collect(cdk.propertyValidator("customDatatypeConfigured", cdk.validateBoolean)(properties.customDatatypeConfigured));
  errors.collect(cdk.propertyValidator("delimiter", cdk.validateString)(properties.delimiter));
  errors.collect(cdk.propertyValidator("disableValueTrimming", cdk.validateBoolean)(properties.disableValueTrimming));
  errors.collect(cdk.propertyValidator("header", cdk.listValidator(cdk.validateString))(properties.header));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("quoteSymbol", cdk.validateString)(properties.quoteSymbol));
  return errors.wrap("supplied properties not correct for \"CsvClassifierProperty\"");
}

// @ts-ignore TS6133
function convertCfnClassifierCsvClassifierPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClassifierCsvClassifierPropertyValidator(properties).assertSuccess();
  return {
    "AllowSingleColumn": cdk.booleanToCloudFormation(properties.allowSingleColumn),
    "ContainsCustomDatatype": cdk.listMapper(cdk.stringToCloudFormation)(properties.containsCustomDatatype),
    "ContainsHeader": cdk.stringToCloudFormation(properties.containsHeader),
    "CustomDatatypeConfigured": cdk.booleanToCloudFormation(properties.customDatatypeConfigured),
    "Delimiter": cdk.stringToCloudFormation(properties.delimiter),
    "DisableValueTrimming": cdk.booleanToCloudFormation(properties.disableValueTrimming),
    "Header": cdk.listMapper(cdk.stringToCloudFormation)(properties.header),
    "Name": cdk.stringToCloudFormation(properties.name),
    "QuoteSymbol": cdk.stringToCloudFormation(properties.quoteSymbol)
  };
}

// @ts-ignore TS6133
function CfnClassifierCsvClassifierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClassifier.CsvClassifierProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClassifier.CsvClassifierProperty>();
  ret.addPropertyResult("allowSingleColumn", "AllowSingleColumn", (properties.AllowSingleColumn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowSingleColumn) : undefined));
  ret.addPropertyResult("containsCustomDatatype", "ContainsCustomDatatype", (properties.ContainsCustomDatatype != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ContainsCustomDatatype) : undefined));
  ret.addPropertyResult("containsHeader", "ContainsHeader", (properties.ContainsHeader != null ? cfn_parse.FromCloudFormation.getString(properties.ContainsHeader) : undefined));
  ret.addPropertyResult("customDatatypeConfigured", "CustomDatatypeConfigured", (properties.CustomDatatypeConfigured != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CustomDatatypeConfigured) : undefined));
  ret.addPropertyResult("delimiter", "Delimiter", (properties.Delimiter != null ? cfn_parse.FromCloudFormation.getString(properties.Delimiter) : undefined));
  ret.addPropertyResult("disableValueTrimming", "DisableValueTrimming", (properties.DisableValueTrimming != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableValueTrimming) : undefined));
  ret.addPropertyResult("header", "Header", (properties.Header != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Header) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("quoteSymbol", "QuoteSymbol", (properties.QuoteSymbol != null ? cfn_parse.FromCloudFormation.getString(properties.QuoteSymbol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrokClassifierProperty`
 *
 * @param properties - the TypeScript properties of a `GrokClassifierProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClassifierGrokClassifierPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("classification", cdk.requiredValidator)(properties.classification));
  errors.collect(cdk.propertyValidator("classification", cdk.validateString)(properties.classification));
  errors.collect(cdk.propertyValidator("customPatterns", cdk.validateString)(properties.customPatterns));
  errors.collect(cdk.propertyValidator("grokPattern", cdk.requiredValidator)(properties.grokPattern));
  errors.collect(cdk.propertyValidator("grokPattern", cdk.validateString)(properties.grokPattern));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"GrokClassifierProperty\"");
}

// @ts-ignore TS6133
function convertCfnClassifierGrokClassifierPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClassifierGrokClassifierPropertyValidator(properties).assertSuccess();
  return {
    "Classification": cdk.stringToCloudFormation(properties.classification),
    "CustomPatterns": cdk.stringToCloudFormation(properties.customPatterns),
    "GrokPattern": cdk.stringToCloudFormation(properties.grokPattern),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnClassifierGrokClassifierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClassifier.GrokClassifierProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClassifier.GrokClassifierProperty>();
  ret.addPropertyResult("classification", "Classification", (properties.Classification != null ? cfn_parse.FromCloudFormation.getString(properties.Classification) : undefined));
  ret.addPropertyResult("customPatterns", "CustomPatterns", (properties.CustomPatterns != null ? cfn_parse.FromCloudFormation.getString(properties.CustomPatterns) : undefined));
  ret.addPropertyResult("grokPattern", "GrokPattern", (properties.GrokPattern != null ? cfn_parse.FromCloudFormation.getString(properties.GrokPattern) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnClassifierProps`
 *
 * @param properties - the TypeScript properties of a `CfnClassifierProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClassifierPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("csvClassifier", CfnClassifierCsvClassifierPropertyValidator)(properties.csvClassifier));
  errors.collect(cdk.propertyValidator("grokClassifier", CfnClassifierGrokClassifierPropertyValidator)(properties.grokClassifier));
  errors.collect(cdk.propertyValidator("jsonClassifier", CfnClassifierJsonClassifierPropertyValidator)(properties.jsonClassifier));
  errors.collect(cdk.propertyValidator("xmlClassifier", CfnClassifierXMLClassifierPropertyValidator)(properties.xmlClassifier));
  return errors.wrap("supplied properties not correct for \"CfnClassifierProps\"");
}

// @ts-ignore TS6133
function convertCfnClassifierPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClassifierPropsValidator(properties).assertSuccess();
  return {
    "CsvClassifier": convertCfnClassifierCsvClassifierPropertyToCloudFormation(properties.csvClassifier),
    "GrokClassifier": convertCfnClassifierGrokClassifierPropertyToCloudFormation(properties.grokClassifier),
    "JsonClassifier": convertCfnClassifierJsonClassifierPropertyToCloudFormation(properties.jsonClassifier),
    "XMLClassifier": convertCfnClassifierXMLClassifierPropertyToCloudFormation(properties.xmlClassifier)
  };
}

// @ts-ignore TS6133
function CfnClassifierPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClassifierProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClassifierProps>();
  ret.addPropertyResult("csvClassifier", "CsvClassifier", (properties.CsvClassifier != null ? CfnClassifierCsvClassifierPropertyFromCloudFormation(properties.CsvClassifier) : undefined));
  ret.addPropertyResult("grokClassifier", "GrokClassifier", (properties.GrokClassifier != null ? CfnClassifierGrokClassifierPropertyFromCloudFormation(properties.GrokClassifier) : undefined));
  ret.addPropertyResult("jsonClassifier", "JsonClassifier", (properties.JsonClassifier != null ? CfnClassifierJsonClassifierPropertyFromCloudFormation(properties.JsonClassifier) : undefined));
  ret.addPropertyResult("xmlClassifier", "XMLClassifier", (properties.XMLClassifier != null ? CfnClassifierXMLClassifierPropertyFromCloudFormation(properties.XMLClassifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Glue::Connection` resource specifies an AWS Glue connection to a data source.
 *
 * For more information, see [Adding a Connection to Your Data Store](https://docs.aws.amazon.com/glue/latest/dg/populate-add-connection.html) and [Connection Structure](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-catalog-connections.html#aws-glue-api-catalog-connections-Connection) in the *AWS Glue Developer Guide* .
 *
 * @cloudformationResource AWS::Glue::Connection
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-connection.html
 */
export class CfnConnection extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::Connection";

  /**
   * Build a CfnConnection from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnection {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConnectionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConnection(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ID of the data catalog to create the catalog object in.
   */
  public catalogId: string;

  /**
   * The connection that you want to create.
   */
  public connectionInput: CfnConnection.ConnectionInputProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConnectionProps) {
    super(scope, id, {
      "type": CfnConnection.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "catalogId", this);
    cdk.requireProperty(props, "connectionInput", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.catalogId = props.catalogId;
    this.connectionInput = props.connectionInput;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "catalogId": this.catalogId,
      "connectionInput": this.connectionInput
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnection.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConnectionPropsToCloudFormation(props);
  }
}

export namespace CfnConnection {
  /**
   * A structure that is used to specify a connection to create or update.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html
   */
  export interface ConnectionInputProperty {
    /**
     * These key-value pairs define parameters for the connection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html#cfn-glue-connection-connectioninput-connectionproperties
     */
    readonly connectionProperties?: any | cdk.IResolvable;

    /**
     * The type of the connection. Currently, these types are supported:.
     *
     * - `JDBC` - Designates a connection to a database through Java Database Connectivity (JDBC).
     *
     * `JDBC` Connections use the following ConnectionParameters.
     *
     * - Required: All of ( `HOST` , `PORT` , `JDBC_ENGINE` ) or `JDBC_CONNECTION_URL` .
     * - Required: All of ( `USERNAME` , `PASSWORD` ) or `SECRET_ID` .
     * - Optional: `JDBC_ENFORCE_SSL` , `CUSTOM_JDBC_CERT` , `CUSTOM_JDBC_CERT_STRING` , `SKIP_CUSTOM_JDBC_CERT_VALIDATION` . These parameters are used to configure SSL with JDBC.
     * - `KAFKA` - Designates a connection to an Apache Kafka streaming platform.
     *
     * `KAFKA` Connections use the following ConnectionParameters.
     *
     * - Required: `KAFKA_BOOTSTRAP_SERVERS` .
     * - Optional: `KAFKA_SSL_ENABLED` , `KAFKA_CUSTOM_CERT` , `KAFKA_SKIP_CUSTOM_CERT_VALIDATION` . These parameters are used to configure SSL with `KAFKA` .
     * - Optional: `KAFKA_CLIENT_KEYSTORE` , `KAFKA_CLIENT_KEYSTORE_PASSWORD` , `KAFKA_CLIENT_KEY_PASSWORD` , `ENCRYPTED_KAFKA_CLIENT_KEYSTORE_PASSWORD` , `ENCRYPTED_KAFKA_CLIENT_KEY_PASSWORD` . These parameters are used to configure TLS client configuration with SSL in `KAFKA` .
     * - Optional: `KAFKA_SASL_MECHANISM` . Can be specified as `SCRAM-SHA-512` , `GSSAPI` , or `AWS_MSK_IAM` .
     * - Optional: `KAFKA_SASL_SCRAM_USERNAME` , `KAFKA_SASL_SCRAM_PASSWORD` , `ENCRYPTED_KAFKA_SASL_SCRAM_PASSWORD` . These parameters are used to configure SASL/SCRAM-SHA-512 authentication with `KAFKA` .
     * - Optional: `KAFKA_SASL_GSSAPI_KEYTAB` , `KAFKA_SASL_GSSAPI_KRB5_CONF` , `KAFKA_SASL_GSSAPI_SERVICE` , `KAFKA_SASL_GSSAPI_PRINCIPAL` . These parameters are used to configure SASL/GSSAPI authentication with `KAFKA` .
     * - `MONGODB` - Designates a connection to a MongoDB document database.
     *
     * `MONGODB` Connections use the following ConnectionParameters.
     *
     * - Required: `CONNECTION_URL` .
     * - Required: All of ( `USERNAME` , `PASSWORD` ) or `SECRET_ID` .
     * - `NETWORK` - Designates a network connection to a data source within an Amazon Virtual Private Cloud environment (Amazon VPC).
     *
     * `NETWORK` Connections do not require ConnectionParameters. Instead, provide a PhysicalConnectionRequirements.
     * - `MARKETPLACE` - Uses configuration settings contained in a connector purchased from AWS Marketplace to read from and write to data stores that are not natively supported by AWS Glue .
     *
     * `MARKETPLACE` Connections use the following ConnectionParameters.
     *
     * - Required: `CONNECTOR_TYPE` , `CONNECTOR_URL` , `CONNECTOR_CLASS_NAME` , `CONNECTION_URL` .
     * - Required for `JDBC` `CONNECTOR_TYPE` connections: All of ( `USERNAME` , `PASSWORD` ) or `SECRET_ID` .
     * - `CUSTOM` - Uses configuration settings contained in a custom connector to read from and write to data stores that are not natively supported by AWS Glue .
     *
     * `SFTP` is not supported.
     *
     * For more information about how optional ConnectionProperties are used to configure features in AWS Glue , consult [AWS Glue connection properties](https://docs.aws.amazon.com/glue/latest/dg/connection-defining.html) .
     *
     * For more information about how optional ConnectionProperties are used to configure features in AWS Glue Studio, consult [Using connectors and connections](https://docs.aws.amazon.com/glue/latest/ug/connectors-chapter.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html#cfn-glue-connection-connectioninput-connectiontype
     */
    readonly connectionType: string;

    /**
     * The description of the connection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html#cfn-glue-connection-connectioninput-description
     */
    readonly description?: string;

    /**
     * A list of criteria that can be used in selecting this connection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html#cfn-glue-connection-connectioninput-matchcriteria
     */
    readonly matchCriteria?: Array<string>;

    /**
     * The name of the connection.
     *
     * Connection will not function as expected without a name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html#cfn-glue-connection-connectioninput-name
     */
    readonly name?: string;

    /**
     * A map of physical connection requirements, such as virtual private cloud (VPC) and `SecurityGroup` , that are needed to successfully make this connection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-connectioninput.html#cfn-glue-connection-connectioninput-physicalconnectionrequirements
     */
    readonly physicalConnectionRequirements?: cdk.IResolvable | CfnConnection.PhysicalConnectionRequirementsProperty;
  }

  /**
   * Specifies the physical requirements for a connection.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-physicalconnectionrequirements.html
   */
  export interface PhysicalConnectionRequirementsProperty {
    /**
     * The connection's Availability Zone.
     *
     * This field is redundant because the specified subnet implies the Availability Zone to be used. Currently the field must be populated, but it will be deprecated in the future.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-physicalconnectionrequirements.html#cfn-glue-connection-physicalconnectionrequirements-availabilityzone
     */
    readonly availabilityZone?: string;

    /**
     * The security group ID list used by the connection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-physicalconnectionrequirements.html#cfn-glue-connection-physicalconnectionrequirements-securitygroupidlist
     */
    readonly securityGroupIdList?: Array<string>;

    /**
     * The subnet ID used by the connection.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-connection-physicalconnectionrequirements.html#cfn-glue-connection-physicalconnectionrequirements-subnetid
     */
    readonly subnetId?: string;
  }
}

/**
 * Properties for defining a `CfnConnection`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-connection.html
 */
export interface CfnConnectionProps {
  /**
   * The ID of the data catalog to create the catalog object in.
   *
   * Currently, this should be the AWS account ID.
   *
   * > To specify the account ID, you can use the `Ref` intrinsic function with the `AWS::AccountId` pseudo parameter. For example: `!Ref AWS::AccountId` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-connection.html#cfn-glue-connection-catalogid
   */
  readonly catalogId: string;

  /**
   * The connection that you want to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-connection.html#cfn-glue-connection-connectioninput
   */
  readonly connectionInput: CfnConnection.ConnectionInputProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `PhysicalConnectionRequirementsProperty`
 *
 * @param properties - the TypeScript properties of a `PhysicalConnectionRequirementsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectionPhysicalConnectionRequirementsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("securityGroupIdList", cdk.listValidator(cdk.validateString))(properties.securityGroupIdList));
  errors.collect(cdk.propertyValidator("subnetId", cdk.validateString)(properties.subnetId));
  return errors.wrap("supplied properties not correct for \"PhysicalConnectionRequirementsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectionPhysicalConnectionRequirementsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectionPhysicalConnectionRequirementsPropertyValidator(properties).assertSuccess();
  return {
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "SecurityGroupIdList": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIdList),
    "SubnetId": cdk.stringToCloudFormation(properties.subnetId)
  };
}

// @ts-ignore TS6133
function CfnConnectionPhysicalConnectionRequirementsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnection.PhysicalConnectionRequirementsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnection.PhysicalConnectionRequirementsProperty>();
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("securityGroupIdList", "SecurityGroupIdList", (properties.SecurityGroupIdList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIdList) : undefined));
  ret.addPropertyResult("subnetId", "SubnetId", (properties.SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectionInputProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectionInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectionConnectionInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionProperties", cdk.validateObject)(properties.connectionProperties));
  errors.collect(cdk.propertyValidator("connectionType", cdk.requiredValidator)(properties.connectionType));
  errors.collect(cdk.propertyValidator("connectionType", cdk.validateString)(properties.connectionType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("matchCriteria", cdk.listValidator(cdk.validateString))(properties.matchCriteria));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("physicalConnectionRequirements", CfnConnectionPhysicalConnectionRequirementsPropertyValidator)(properties.physicalConnectionRequirements));
  return errors.wrap("supplied properties not correct for \"ConnectionInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectionConnectionInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectionConnectionInputPropertyValidator(properties).assertSuccess();
  return {
    "ConnectionProperties": cdk.objectToCloudFormation(properties.connectionProperties),
    "ConnectionType": cdk.stringToCloudFormation(properties.connectionType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "MatchCriteria": cdk.listMapper(cdk.stringToCloudFormation)(properties.matchCriteria),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PhysicalConnectionRequirements": convertCfnConnectionPhysicalConnectionRequirementsPropertyToCloudFormation(properties.physicalConnectionRequirements)
  };
}

// @ts-ignore TS6133
function CfnConnectionConnectionInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnection.ConnectionInputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnection.ConnectionInputProperty>();
  ret.addPropertyResult("connectionProperties", "ConnectionProperties", (properties.ConnectionProperties != null ? cfn_parse.FromCloudFormation.getAny(properties.ConnectionProperties) : undefined));
  ret.addPropertyResult("connectionType", "ConnectionType", (properties.ConnectionType != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("matchCriteria", "MatchCriteria", (properties.MatchCriteria != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.MatchCriteria) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("physicalConnectionRequirements", "PhysicalConnectionRequirements", (properties.PhysicalConnectionRequirements != null ? CfnConnectionPhysicalConnectionRequirementsPropertyFromCloudFormation(properties.PhysicalConnectionRequirements) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConnectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("connectionInput", cdk.requiredValidator)(properties.connectionInput));
  errors.collect(cdk.propertyValidator("connectionInput", CfnConnectionConnectionInputPropertyValidator)(properties.connectionInput));
  return errors.wrap("supplied properties not correct for \"CfnConnectionProps\"");
}

// @ts-ignore TS6133
function convertCfnConnectionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectionPropsValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "ConnectionInput": convertCfnConnectionConnectionInputPropertyToCloudFormation(properties.connectionInput)
  };
}

// @ts-ignore TS6133
function CfnConnectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectionProps>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("connectionInput", "ConnectionInput", (properties.ConnectionInput != null ? CfnConnectionConnectionInputPropertyFromCloudFormation(properties.ConnectionInput) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Glue::Crawler` resource specifies an AWS Glue crawler.
 *
 * For more information, see [Cataloging Tables with a Crawler](https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html) and [Crawler Structure](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-crawler-crawling.html#aws-glue-api-crawler-crawling-Crawler) in the *AWS Glue Developer Guide* .
 *
 * @cloudformationResource AWS::Glue::Crawler
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html
 */
export class CfnCrawler extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::Crawler";

  /**
   * Build a CfnCrawler from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCrawler {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCrawlerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCrawler(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A list of UTF-8 strings that specify the names of custom classifiers that are associated with the crawler.
   */
  public classifiers?: Array<string>;

  /**
   * Crawler configuration information.
   */
  public configuration?: string;

  /**
   * The name of the `SecurityConfiguration` structure to be used by this crawler.
   */
  public crawlerSecurityConfiguration?: string;

  /**
   * The name of the database in which the crawler's output is stored.
   */
  public databaseName?: string;

  /**
   * A description of the crawler.
   */
  public description?: string;

  /**
   * The name of the crawler.
   */
  public name?: string;

  /**
   * A policy that specifies whether to crawl the entire dataset again, or to crawl only folders that were added since the last crawler run.
   */
  public recrawlPolicy?: cdk.IResolvable | CfnCrawler.RecrawlPolicyProperty;

  /**
   * The Amazon Resource Name (ARN) of an IAM role that's used to access customer resources, such as Amazon Simple Storage Service (Amazon S3) data.
   */
  public role: string;

  /**
   * For scheduled crawlers, the schedule when the crawler runs.
   */
  public schedule?: cdk.IResolvable | CfnCrawler.ScheduleProperty;

  /**
   * The policy that specifies update and delete behaviors for the crawler.
   */
  public schemaChangePolicy?: cdk.IResolvable | CfnCrawler.SchemaChangePolicyProperty;

  /**
   * The prefix added to the names of tables that are created.
   */
  public tablePrefix?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to use with this crawler.
   */
  public tagsRaw?: any;

  /**
   * A collection of targets to crawl.
   */
  public targets: cdk.IResolvable | CfnCrawler.TargetsProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCrawlerProps) {
    super(scope, id, {
      "type": CfnCrawler.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "role", this);
    cdk.requireProperty(props, "targets", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.classifiers = props.classifiers;
    this.configuration = props.configuration;
    this.crawlerSecurityConfiguration = props.crawlerSecurityConfiguration;
    this.databaseName = props.databaseName;
    this.description = props.description;
    this.name = props.name;
    this.recrawlPolicy = props.recrawlPolicy;
    this.role = props.role;
    this.schedule = props.schedule;
    this.schemaChangePolicy = props.schemaChangePolicy;
    this.tablePrefix = props.tablePrefix;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Glue::Crawler", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targets = props.targets;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "classifiers": this.classifiers,
      "configuration": this.configuration,
      "crawlerSecurityConfiguration": this.crawlerSecurityConfiguration,
      "databaseName": this.databaseName,
      "description": this.description,
      "name": this.name,
      "recrawlPolicy": this.recrawlPolicy,
      "role": this.role,
      "schedule": this.schedule,
      "schemaChangePolicy": this.schemaChangePolicy,
      "tablePrefix": this.tablePrefix,
      "tags": this.tags.renderTags(),
      "targets": this.targets
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCrawler.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCrawlerPropsToCloudFormation(props);
  }
}

export namespace CfnCrawler {
  /**
   * The policy that specifies update and delete behaviors for the crawler.
   *
   * The policy tells the crawler what to do in the event that it detects a change in a table that already exists in the customer's database at the time of the crawl. The `SchemaChangePolicy` does not affect whether or how new tables and partitions are added. New tables and partitions are always created regardless of the `SchemaChangePolicy` on a crawler.
   *
   * The SchemaChangePolicy consists of two components, `UpdateBehavior` and `DeleteBehavior` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schemachangepolicy.html
   */
  export interface SchemaChangePolicyProperty {
    /**
     * The deletion behavior when the crawler finds a deleted object.
     *
     * A value of `LOG` specifies that if a table or partition is found to no longer exist, do not delete it, only log that it was found to no longer exist.
     *
     * A value of `DELETE_FROM_DATABASE` specifies that if a table or partition is found to have been removed, delete it from the database.
     *
     * A value of `DEPRECATE_IN_DATABASE` specifies that if a table has been found to no longer exist, to add a property to the table that says "DEPRECATED" and includes a timestamp with the time of deprecation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schemachangepolicy.html#cfn-glue-crawler-schemachangepolicy-deletebehavior
     */
    readonly deleteBehavior?: string;

    /**
     * The update behavior when the crawler finds a changed schema.
     *
     * A value of `LOG` specifies that if a table or a partition already exists, and a change is detected, do not update it, only log that a change was detected. Add new tables and new partitions (including on existing tables).
     *
     * A value of `UPDATE_IN_DATABASE` specifies that if a table or partition already exists, and a change is detected, update it. Add new tables and partitions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schemachangepolicy.html#cfn-glue-crawler-schemachangepolicy-updatebehavior
     */
    readonly updateBehavior?: string;
  }

  /**
   * When crawling an Amazon S3 data source after the first crawl is complete, specifies whether to crawl the entire dataset again or to crawl only folders that were added since the last crawler run.
   *
   * For more information, see [Incremental Crawls in AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/incremental-crawls.html) in the developer guide.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-recrawlpolicy.html
   */
  export interface RecrawlPolicyProperty {
    /**
     * Specifies whether to crawl the entire dataset again or to crawl only folders that were added since the last crawler run.
     *
     * A value of `CRAWL_EVERYTHING` specifies crawling the entire dataset again.
     *
     * A value of `CRAWL_NEW_FOLDERS_ONLY` specifies crawling only folders that were added since the last crawler run.
     *
     * A value of `CRAWL_EVENT_MODE` specifies crawling only the changes identified by Amazon S3 events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-recrawlpolicy.html#cfn-glue-crawler-recrawlpolicy-recrawlbehavior
     */
    readonly recrawlBehavior?: string;
  }

  /**
   * Specifies data stores to crawl.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-targets.html
   */
  export interface TargetsProperty {
    /**
     * Specifies AWS Glue Data Catalog targets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-targets.html#cfn-glue-crawler-targets-catalogtargets
     */
    readonly catalogTargets?: Array<CfnCrawler.CatalogTargetProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies an array of Delta data store targets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-targets.html#cfn-glue-crawler-targets-deltatargets
     */
    readonly deltaTargets?: Array<CfnCrawler.DeltaTargetProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies Amazon DynamoDB targets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-targets.html#cfn-glue-crawler-targets-dynamodbtargets
     */
    readonly dynamoDbTargets?: Array<CfnCrawler.DynamoDBTargetProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-targets.html#cfn-glue-crawler-targets-icebergtargets
     */
    readonly icebergTargets?: Array<CfnCrawler.IcebergTargetProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies JDBC targets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-targets.html#cfn-glue-crawler-targets-jdbctargets
     */
    readonly jdbcTargets?: Array<cdk.IResolvable | CfnCrawler.JdbcTargetProperty> | cdk.IResolvable;

    /**
     * A list of Mongo DB targets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-targets.html#cfn-glue-crawler-targets-mongodbtargets
     */
    readonly mongoDbTargets?: Array<cdk.IResolvable | CfnCrawler.MongoDBTargetProperty> | cdk.IResolvable;

    /**
     * Specifies Amazon Simple Storage Service (Amazon S3) targets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-targets.html#cfn-glue-crawler-targets-s3targets
     */
    readonly s3Targets?: Array<cdk.IResolvable | CfnCrawler.S3TargetProperty> | cdk.IResolvable;
  }

  /**
   * Specifies a data store in Amazon Simple Storage Service (Amazon S3).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-s3target.html
   */
  export interface S3TargetProperty {
    /**
     * The name of a connection which allows a job or crawler to access data in Amazon S3 within an Amazon Virtual Private Cloud environment (Amazon VPC).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-s3target.html#cfn-glue-crawler-s3target-connectionname
     */
    readonly connectionName?: string;

    /**
     * A valid Amazon dead-letter SQS ARN.
     *
     * For example, `arn:aws:sqs:region:account:deadLetterQueue` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-s3target.html#cfn-glue-crawler-s3target-dlqeventqueuearn
     */
    readonly dlqEventQueueArn?: string;

    /**
     * A valid Amazon SQS ARN.
     *
     * For example, `arn:aws:sqs:region:account:sqs` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-s3target.html#cfn-glue-crawler-s3target-eventqueuearn
     */
    readonly eventQueueArn?: string;

    /**
     * A list of glob patterns used to exclude from the crawl.
     *
     * For more information, see [Catalog Tables with a Crawler](https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-s3target.html#cfn-glue-crawler-s3target-exclusions
     */
    readonly exclusions?: Array<string>;

    /**
     * The path to the Amazon S3 target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-s3target.html#cfn-glue-crawler-s3target-path
     */
    readonly path?: string;

    /**
     * Sets the number of files in each leaf folder to be crawled when crawling sample files in a dataset.
     *
     * If not set, all the files are crawled. A valid value is an integer between 1 and 249.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-s3target.html#cfn-glue-crawler-s3target-samplesize
     */
    readonly sampleSize?: number;
  }

  /**
   * Specifies an AWS Glue Data Catalog target.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-catalogtarget.html
   */
  export interface CatalogTargetProperty {
    /**
     * The name of the connection for an Amazon S3-backed Data Catalog table to be a target of the crawl when using a `Catalog` connection type paired with a `NETWORK` Connection type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-catalogtarget.html#cfn-glue-crawler-catalogtarget-connectionname
     */
    readonly connectionName?: string;

    /**
     * The name of the database to be synchronized.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-catalogtarget.html#cfn-glue-crawler-catalogtarget-databasename
     */
    readonly databaseName?: string;

    /**
     * A valid Amazon dead-letter SQS ARN.
     *
     * For example, `arn:aws:sqs:region:account:deadLetterQueue` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-catalogtarget.html#cfn-glue-crawler-catalogtarget-dlqeventqueuearn
     */
    readonly dlqEventQueueArn?: string;

    /**
     * A valid Amazon SQS ARN.
     *
     * For example, `arn:aws:sqs:region:account:sqs` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-catalogtarget.html#cfn-glue-crawler-catalogtarget-eventqueuearn
     */
    readonly eventQueueArn?: string;

    /**
     * A list of the tables to be synchronized.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-catalogtarget.html#cfn-glue-crawler-catalogtarget-tables
     */
    readonly tables?: Array<string>;
  }

  /**
   * Specifies a Delta data store to crawl one or more Delta tables.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-deltatarget.html
   */
  export interface DeltaTargetProperty {
    /**
     * The name of the connection to use to connect to the Delta table target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-deltatarget.html#cfn-glue-crawler-deltatarget-connectionname
     */
    readonly connectionName?: string;

    /**
     * Specifies whether the crawler will create native tables, to allow integration with query engines that support querying of the Delta transaction log directly.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-deltatarget.html#cfn-glue-crawler-deltatarget-createnativedeltatable
     */
    readonly createNativeDeltaTable?: boolean | cdk.IResolvable;

    /**
     * A list of the Amazon S3 paths to the Delta tables.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-deltatarget.html#cfn-glue-crawler-deltatarget-deltatables
     */
    readonly deltaTables?: Array<string>;

    /**
     * Specifies whether to write the manifest files to the Delta table path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-deltatarget.html#cfn-glue-crawler-deltatarget-writemanifest
     */
    readonly writeManifest?: boolean | cdk.IResolvable;
  }

  /**
   * Specifies an Amazon DocumentDB or MongoDB data store to crawl.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-mongodbtarget.html
   */
  export interface MongoDBTargetProperty {
    /**
     * The name of the connection to use to connect to the Amazon DocumentDB or MongoDB target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-mongodbtarget.html#cfn-glue-crawler-mongodbtarget-connectionname
     */
    readonly connectionName?: string;

    /**
     * The path of the Amazon DocumentDB or MongoDB target (database/collection).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-mongodbtarget.html#cfn-glue-crawler-mongodbtarget-path
     */
    readonly path?: string;
  }

  /**
   * Specifies a JDBC data store to crawl.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-jdbctarget.html
   */
  export interface JdbcTargetProperty {
    /**
     * The name of the connection to use to connect to the JDBC target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-jdbctarget.html#cfn-glue-crawler-jdbctarget-connectionname
     */
    readonly connectionName?: string;

    /**
     * A list of glob patterns used to exclude from the crawl.
     *
     * For more information, see [Catalog Tables with a Crawler](https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-jdbctarget.html#cfn-glue-crawler-jdbctarget-exclusions
     */
    readonly exclusions?: Array<string>;

    /**
     * The path of the JDBC target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-jdbctarget.html#cfn-glue-crawler-jdbctarget-path
     */
    readonly path?: string;
  }

  /**
   * Specifies an Amazon DynamoDB table to crawl.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-dynamodbtarget.html
   */
  export interface DynamoDBTargetProperty {
    /**
     * The name of the DynamoDB table to crawl.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-dynamodbtarget.html#cfn-glue-crawler-dynamodbtarget-path
     */
    readonly path?: string;
  }

  /**
   * Specifies an Apache Iceberg data source where Iceberg tables are stored in Amazon S3.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-icebergtarget.html
   */
  export interface IcebergTargetProperty {
    /**
     * The name of the connection to use to connect to the Iceberg target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-icebergtarget.html#cfn-glue-crawler-icebergtarget-connectionname
     */
    readonly connectionName?: string;

    /**
     * A list of glob patterns used to exclude from the crawl.
     *
     * For more information, see [Catalog Tables with a Crawler](https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-icebergtarget.html#cfn-glue-crawler-icebergtarget-exclusions
     */
    readonly exclusions?: Array<string>;

    /**
     * The maximum depth of Amazon S3 paths that the crawler can traverse to discover the Iceberg metadata folder in your Amazon S3 path.
     *
     * Used to limit the crawler run time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-icebergtarget.html#cfn-glue-crawler-icebergtarget-maximumtraversaldepth
     */
    readonly maximumTraversalDepth?: number;

    /**
     * One or more Amazon S3 paths that contains Iceberg metadata folders as `s3://bucket/prefix` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-icebergtarget.html#cfn-glue-crawler-icebergtarget-paths
     */
    readonly paths?: Array<string>;
  }

  /**
   * A scheduling object using a `cron` statement to schedule an event.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schedule.html
   */
  export interface ScheduleProperty {
    /**
     * A `cron` expression used to specify the schedule.
     *
     * For more information, see [Time-Based Schedules for Jobs and Crawlers](https://docs.aws.amazon.com/glue/latest/dg/monitor-data-warehouse-schedule.html) . For example, to run something every day at 12:15 UTC, specify `cron(15 12 * * ? *)` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schedule.html#cfn-glue-crawler-schedule-scheduleexpression
     */
    readonly scheduleExpression?: string;
  }
}

/**
 * Properties for defining a `CfnCrawler`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html
 */
export interface CfnCrawlerProps {
  /**
   * A list of UTF-8 strings that specify the names of custom classifiers that are associated with the crawler.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-classifiers
   */
  readonly classifiers?: Array<string>;

  /**
   * Crawler configuration information.
   *
   * This versioned JSON string allows users to specify aspects of a crawler's behavior. For more information, see [Configuring a Crawler](https://docs.aws.amazon.com/glue/latest/dg/crawler-configuration.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-configuration
   */
  readonly configuration?: string;

  /**
   * The name of the `SecurityConfiguration` structure to be used by this crawler.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-crawlersecurityconfiguration
   */
  readonly crawlerSecurityConfiguration?: string;

  /**
   * The name of the database in which the crawler's output is stored.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-databasename
   */
  readonly databaseName?: string;

  /**
   * A description of the crawler.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-description
   */
  readonly description?: string;

  /**
   * The name of the crawler.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-name
   */
  readonly name?: string;

  /**
   * A policy that specifies whether to crawl the entire dataset again, or to crawl only folders that were added since the last crawler run.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-recrawlpolicy
   */
  readonly recrawlPolicy?: cdk.IResolvable | CfnCrawler.RecrawlPolicyProperty;

  /**
   * The Amazon Resource Name (ARN) of an IAM role that's used to access customer resources, such as Amazon Simple Storage Service (Amazon S3) data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-role
   */
  readonly role: string;

  /**
   * For scheduled crawlers, the schedule when the crawler runs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-schedule
   */
  readonly schedule?: cdk.IResolvable | CfnCrawler.ScheduleProperty;

  /**
   * The policy that specifies update and delete behaviors for the crawler.
   *
   * The policy tells the crawler what to do in the event that it detects a change in a table that already exists in the customer's database at the time of the crawl. The `SchemaChangePolicy` does not affect whether or how new tables and partitions are added. New tables and partitions are always created regardless of the `SchemaChangePolicy` on a crawler.
   *
   * The SchemaChangePolicy consists of two components, `UpdateBehavior` and `DeleteBehavior` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-schemachangepolicy
   */
  readonly schemaChangePolicy?: cdk.IResolvable | CfnCrawler.SchemaChangePolicyProperty;

  /**
   * The prefix added to the names of tables that are created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-tableprefix
   */
  readonly tablePrefix?: string;

  /**
   * The tags to use with this crawler.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-tags
   */
  readonly tags?: any;

  /**
   * A collection of targets to crawl.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-crawler.html#cfn-glue-crawler-targets
   */
  readonly targets: cdk.IResolvable | CfnCrawler.TargetsProperty;
}

/**
 * Determine whether the given properties match those of a `SchemaChangePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaChangePolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCrawlerSchemaChangePolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deleteBehavior", cdk.validateString)(properties.deleteBehavior));
  errors.collect(cdk.propertyValidator("updateBehavior", cdk.validateString)(properties.updateBehavior));
  return errors.wrap("supplied properties not correct for \"SchemaChangePolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnCrawlerSchemaChangePolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCrawlerSchemaChangePolicyPropertyValidator(properties).assertSuccess();
  return {
    "DeleteBehavior": cdk.stringToCloudFormation(properties.deleteBehavior),
    "UpdateBehavior": cdk.stringToCloudFormation(properties.updateBehavior)
  };
}

// @ts-ignore TS6133
function CfnCrawlerSchemaChangePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCrawler.SchemaChangePolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCrawler.SchemaChangePolicyProperty>();
  ret.addPropertyResult("deleteBehavior", "DeleteBehavior", (properties.DeleteBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.DeleteBehavior) : undefined));
  ret.addPropertyResult("updateBehavior", "UpdateBehavior", (properties.UpdateBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.UpdateBehavior) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RecrawlPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `RecrawlPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCrawlerRecrawlPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("recrawlBehavior", cdk.validateString)(properties.recrawlBehavior));
  return errors.wrap("supplied properties not correct for \"RecrawlPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnCrawlerRecrawlPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCrawlerRecrawlPolicyPropertyValidator(properties).assertSuccess();
  return {
    "RecrawlBehavior": cdk.stringToCloudFormation(properties.recrawlBehavior)
  };
}

// @ts-ignore TS6133
function CfnCrawlerRecrawlPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCrawler.RecrawlPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCrawler.RecrawlPolicyProperty>();
  ret.addPropertyResult("recrawlBehavior", "RecrawlBehavior", (properties.RecrawlBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.RecrawlBehavior) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3TargetProperty`
 *
 * @param properties - the TypeScript properties of a `S3TargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCrawlerS3TargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionName", cdk.validateString)(properties.connectionName));
  errors.collect(cdk.propertyValidator("dlqEventQueueArn", cdk.validateString)(properties.dlqEventQueueArn));
  errors.collect(cdk.propertyValidator("eventQueueArn", cdk.validateString)(properties.eventQueueArn));
  errors.collect(cdk.propertyValidator("exclusions", cdk.listValidator(cdk.validateString))(properties.exclusions));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("sampleSize", cdk.validateNumber)(properties.sampleSize));
  return errors.wrap("supplied properties not correct for \"S3TargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnCrawlerS3TargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCrawlerS3TargetPropertyValidator(properties).assertSuccess();
  return {
    "ConnectionName": cdk.stringToCloudFormation(properties.connectionName),
    "DlqEventQueueArn": cdk.stringToCloudFormation(properties.dlqEventQueueArn),
    "EventQueueArn": cdk.stringToCloudFormation(properties.eventQueueArn),
    "Exclusions": cdk.listMapper(cdk.stringToCloudFormation)(properties.exclusions),
    "Path": cdk.stringToCloudFormation(properties.path),
    "SampleSize": cdk.numberToCloudFormation(properties.sampleSize)
  };
}

// @ts-ignore TS6133
function CfnCrawlerS3TargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCrawler.S3TargetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCrawler.S3TargetProperty>();
  ret.addPropertyResult("connectionName", "ConnectionName", (properties.ConnectionName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionName) : undefined));
  ret.addPropertyResult("dlqEventQueueArn", "DlqEventQueueArn", (properties.DlqEventQueueArn != null ? cfn_parse.FromCloudFormation.getString(properties.DlqEventQueueArn) : undefined));
  ret.addPropertyResult("eventQueueArn", "EventQueueArn", (properties.EventQueueArn != null ? cfn_parse.FromCloudFormation.getString(properties.EventQueueArn) : undefined));
  ret.addPropertyResult("exclusions", "Exclusions", (properties.Exclusions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Exclusions) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("sampleSize", "SampleSize", (properties.SampleSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.SampleSize) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CatalogTargetProperty`
 *
 * @param properties - the TypeScript properties of a `CatalogTargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCrawlerCatalogTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionName", cdk.validateString)(properties.connectionName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("dlqEventQueueArn", cdk.validateString)(properties.dlqEventQueueArn));
  errors.collect(cdk.propertyValidator("eventQueueArn", cdk.validateString)(properties.eventQueueArn));
  errors.collect(cdk.propertyValidator("tables", cdk.listValidator(cdk.validateString))(properties.tables));
  return errors.wrap("supplied properties not correct for \"CatalogTargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnCrawlerCatalogTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCrawlerCatalogTargetPropertyValidator(properties).assertSuccess();
  return {
    "ConnectionName": cdk.stringToCloudFormation(properties.connectionName),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "DlqEventQueueArn": cdk.stringToCloudFormation(properties.dlqEventQueueArn),
    "EventQueueArn": cdk.stringToCloudFormation(properties.eventQueueArn),
    "Tables": cdk.listMapper(cdk.stringToCloudFormation)(properties.tables)
  };
}

// @ts-ignore TS6133
function CfnCrawlerCatalogTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCrawler.CatalogTargetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCrawler.CatalogTargetProperty>();
  ret.addPropertyResult("connectionName", "ConnectionName", (properties.ConnectionName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionName) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("dlqEventQueueArn", "DlqEventQueueArn", (properties.DlqEventQueueArn != null ? cfn_parse.FromCloudFormation.getString(properties.DlqEventQueueArn) : undefined));
  ret.addPropertyResult("eventQueueArn", "EventQueueArn", (properties.EventQueueArn != null ? cfn_parse.FromCloudFormation.getString(properties.EventQueueArn) : undefined));
  ret.addPropertyResult("tables", "Tables", (properties.Tables != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Tables) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeltaTargetProperty`
 *
 * @param properties - the TypeScript properties of a `DeltaTargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCrawlerDeltaTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionName", cdk.validateString)(properties.connectionName));
  errors.collect(cdk.propertyValidator("createNativeDeltaTable", cdk.validateBoolean)(properties.createNativeDeltaTable));
  errors.collect(cdk.propertyValidator("deltaTables", cdk.listValidator(cdk.validateString))(properties.deltaTables));
  errors.collect(cdk.propertyValidator("writeManifest", cdk.validateBoolean)(properties.writeManifest));
  return errors.wrap("supplied properties not correct for \"DeltaTargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnCrawlerDeltaTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCrawlerDeltaTargetPropertyValidator(properties).assertSuccess();
  return {
    "ConnectionName": cdk.stringToCloudFormation(properties.connectionName),
    "CreateNativeDeltaTable": cdk.booleanToCloudFormation(properties.createNativeDeltaTable),
    "DeltaTables": cdk.listMapper(cdk.stringToCloudFormation)(properties.deltaTables),
    "WriteManifest": cdk.booleanToCloudFormation(properties.writeManifest)
  };
}

// @ts-ignore TS6133
function CfnCrawlerDeltaTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCrawler.DeltaTargetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCrawler.DeltaTargetProperty>();
  ret.addPropertyResult("connectionName", "ConnectionName", (properties.ConnectionName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionName) : undefined));
  ret.addPropertyResult("createNativeDeltaTable", "CreateNativeDeltaTable", (properties.CreateNativeDeltaTable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CreateNativeDeltaTable) : undefined));
  ret.addPropertyResult("deltaTables", "DeltaTables", (properties.DeltaTables != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DeltaTables) : undefined));
  ret.addPropertyResult("writeManifest", "WriteManifest", (properties.WriteManifest != null ? cfn_parse.FromCloudFormation.getBoolean(properties.WriteManifest) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MongoDBTargetProperty`
 *
 * @param properties - the TypeScript properties of a `MongoDBTargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCrawlerMongoDBTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionName", cdk.validateString)(properties.connectionName));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  return errors.wrap("supplied properties not correct for \"MongoDBTargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnCrawlerMongoDBTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCrawlerMongoDBTargetPropertyValidator(properties).assertSuccess();
  return {
    "ConnectionName": cdk.stringToCloudFormation(properties.connectionName),
    "Path": cdk.stringToCloudFormation(properties.path)
  };
}

// @ts-ignore TS6133
function CfnCrawlerMongoDBTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCrawler.MongoDBTargetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCrawler.MongoDBTargetProperty>();
  ret.addPropertyResult("connectionName", "ConnectionName", (properties.ConnectionName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionName) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JdbcTargetProperty`
 *
 * @param properties - the TypeScript properties of a `JdbcTargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCrawlerJdbcTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionName", cdk.validateString)(properties.connectionName));
  errors.collect(cdk.propertyValidator("exclusions", cdk.listValidator(cdk.validateString))(properties.exclusions));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  return errors.wrap("supplied properties not correct for \"JdbcTargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnCrawlerJdbcTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCrawlerJdbcTargetPropertyValidator(properties).assertSuccess();
  return {
    "ConnectionName": cdk.stringToCloudFormation(properties.connectionName),
    "Exclusions": cdk.listMapper(cdk.stringToCloudFormation)(properties.exclusions),
    "Path": cdk.stringToCloudFormation(properties.path)
  };
}

// @ts-ignore TS6133
function CfnCrawlerJdbcTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCrawler.JdbcTargetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCrawler.JdbcTargetProperty>();
  ret.addPropertyResult("connectionName", "ConnectionName", (properties.ConnectionName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionName) : undefined));
  ret.addPropertyResult("exclusions", "Exclusions", (properties.Exclusions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Exclusions) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynamoDBTargetProperty`
 *
 * @param properties - the TypeScript properties of a `DynamoDBTargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCrawlerDynamoDBTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  return errors.wrap("supplied properties not correct for \"DynamoDBTargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnCrawlerDynamoDBTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCrawlerDynamoDBTargetPropertyValidator(properties).assertSuccess();
  return {
    "Path": cdk.stringToCloudFormation(properties.path)
  };
}

// @ts-ignore TS6133
function CfnCrawlerDynamoDBTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCrawler.DynamoDBTargetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCrawler.DynamoDBTargetProperty>();
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IcebergTargetProperty`
 *
 * @param properties - the TypeScript properties of a `IcebergTargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCrawlerIcebergTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionName", cdk.validateString)(properties.connectionName));
  errors.collect(cdk.propertyValidator("exclusions", cdk.listValidator(cdk.validateString))(properties.exclusions));
  errors.collect(cdk.propertyValidator("maximumTraversalDepth", cdk.validateNumber)(properties.maximumTraversalDepth));
  errors.collect(cdk.propertyValidator("paths", cdk.listValidator(cdk.validateString))(properties.paths));
  return errors.wrap("supplied properties not correct for \"IcebergTargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnCrawlerIcebergTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCrawlerIcebergTargetPropertyValidator(properties).assertSuccess();
  return {
    "ConnectionName": cdk.stringToCloudFormation(properties.connectionName),
    "Exclusions": cdk.listMapper(cdk.stringToCloudFormation)(properties.exclusions),
    "MaximumTraversalDepth": cdk.numberToCloudFormation(properties.maximumTraversalDepth),
    "Paths": cdk.listMapper(cdk.stringToCloudFormation)(properties.paths)
  };
}

// @ts-ignore TS6133
function CfnCrawlerIcebergTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCrawler.IcebergTargetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCrawler.IcebergTargetProperty>();
  ret.addPropertyResult("connectionName", "ConnectionName", (properties.ConnectionName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionName) : undefined));
  ret.addPropertyResult("exclusions", "Exclusions", (properties.Exclusions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Exclusions) : undefined));
  ret.addPropertyResult("maximumTraversalDepth", "MaximumTraversalDepth", (properties.MaximumTraversalDepth != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumTraversalDepth) : undefined));
  ret.addPropertyResult("paths", "Paths", (properties.Paths != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Paths) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetsProperty`
 *
 * @param properties - the TypeScript properties of a `TargetsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCrawlerTargetsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogTargets", cdk.listValidator(CfnCrawlerCatalogTargetPropertyValidator))(properties.catalogTargets));
  errors.collect(cdk.propertyValidator("deltaTargets", cdk.listValidator(CfnCrawlerDeltaTargetPropertyValidator))(properties.deltaTargets));
  errors.collect(cdk.propertyValidator("dynamoDbTargets", cdk.listValidator(CfnCrawlerDynamoDBTargetPropertyValidator))(properties.dynamoDbTargets));
  errors.collect(cdk.propertyValidator("icebergTargets", cdk.listValidator(CfnCrawlerIcebergTargetPropertyValidator))(properties.icebergTargets));
  errors.collect(cdk.propertyValidator("jdbcTargets", cdk.listValidator(CfnCrawlerJdbcTargetPropertyValidator))(properties.jdbcTargets));
  errors.collect(cdk.propertyValidator("mongoDbTargets", cdk.listValidator(CfnCrawlerMongoDBTargetPropertyValidator))(properties.mongoDbTargets));
  errors.collect(cdk.propertyValidator("s3Targets", cdk.listValidator(CfnCrawlerS3TargetPropertyValidator))(properties.s3Targets));
  return errors.wrap("supplied properties not correct for \"TargetsProperty\"");
}

// @ts-ignore TS6133
function convertCfnCrawlerTargetsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCrawlerTargetsPropertyValidator(properties).assertSuccess();
  return {
    "CatalogTargets": cdk.listMapper(convertCfnCrawlerCatalogTargetPropertyToCloudFormation)(properties.catalogTargets),
    "DeltaTargets": cdk.listMapper(convertCfnCrawlerDeltaTargetPropertyToCloudFormation)(properties.deltaTargets),
    "DynamoDBTargets": cdk.listMapper(convertCfnCrawlerDynamoDBTargetPropertyToCloudFormation)(properties.dynamoDbTargets),
    "IcebergTargets": cdk.listMapper(convertCfnCrawlerIcebergTargetPropertyToCloudFormation)(properties.icebergTargets),
    "JdbcTargets": cdk.listMapper(convertCfnCrawlerJdbcTargetPropertyToCloudFormation)(properties.jdbcTargets),
    "MongoDBTargets": cdk.listMapper(convertCfnCrawlerMongoDBTargetPropertyToCloudFormation)(properties.mongoDbTargets),
    "S3Targets": cdk.listMapper(convertCfnCrawlerS3TargetPropertyToCloudFormation)(properties.s3Targets)
  };
}

// @ts-ignore TS6133
function CfnCrawlerTargetsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCrawler.TargetsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCrawler.TargetsProperty>();
  ret.addPropertyResult("catalogTargets", "CatalogTargets", (properties.CatalogTargets != null ? cfn_parse.FromCloudFormation.getArray(CfnCrawlerCatalogTargetPropertyFromCloudFormation)(properties.CatalogTargets) : undefined));
  ret.addPropertyResult("deltaTargets", "DeltaTargets", (properties.DeltaTargets != null ? cfn_parse.FromCloudFormation.getArray(CfnCrawlerDeltaTargetPropertyFromCloudFormation)(properties.DeltaTargets) : undefined));
  ret.addPropertyResult("dynamoDbTargets", "DynamoDBTargets", (properties.DynamoDBTargets != null ? cfn_parse.FromCloudFormation.getArray(CfnCrawlerDynamoDBTargetPropertyFromCloudFormation)(properties.DynamoDBTargets) : undefined));
  ret.addPropertyResult("icebergTargets", "IcebergTargets", (properties.IcebergTargets != null ? cfn_parse.FromCloudFormation.getArray(CfnCrawlerIcebergTargetPropertyFromCloudFormation)(properties.IcebergTargets) : undefined));
  ret.addPropertyResult("jdbcTargets", "JdbcTargets", (properties.JdbcTargets != null ? cfn_parse.FromCloudFormation.getArray(CfnCrawlerJdbcTargetPropertyFromCloudFormation)(properties.JdbcTargets) : undefined));
  ret.addPropertyResult("mongoDbTargets", "MongoDBTargets", (properties.MongoDBTargets != null ? cfn_parse.FromCloudFormation.getArray(CfnCrawlerMongoDBTargetPropertyFromCloudFormation)(properties.MongoDBTargets) : undefined));
  ret.addPropertyResult("s3Targets", "S3Targets", (properties.S3Targets != null ? cfn_parse.FromCloudFormation.getArray(CfnCrawlerS3TargetPropertyFromCloudFormation)(properties.S3Targets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScheduleProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCrawlerSchedulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.validateString)(properties.scheduleExpression));
  return errors.wrap("supplied properties not correct for \"ScheduleProperty\"");
}

// @ts-ignore TS6133
function convertCfnCrawlerSchedulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCrawlerSchedulePropertyValidator(properties).assertSuccess();
  return {
    "ScheduleExpression": cdk.stringToCloudFormation(properties.scheduleExpression)
  };
}

// @ts-ignore TS6133
function CfnCrawlerSchedulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCrawler.ScheduleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCrawler.ScheduleProperty>();
  ret.addPropertyResult("scheduleExpression", "ScheduleExpression", (properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCrawlerProps`
 *
 * @param properties - the TypeScript properties of a `CfnCrawlerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCrawlerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("classifiers", cdk.listValidator(cdk.validateString))(properties.classifiers));
  errors.collect(cdk.propertyValidator("configuration", cdk.validateString)(properties.configuration));
  errors.collect(cdk.propertyValidator("crawlerSecurityConfiguration", cdk.validateString)(properties.crawlerSecurityConfiguration));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("recrawlPolicy", CfnCrawlerRecrawlPolicyPropertyValidator)(properties.recrawlPolicy));
  errors.collect(cdk.propertyValidator("role", cdk.requiredValidator)(properties.role));
  errors.collect(cdk.propertyValidator("role", cdk.validateString)(properties.role));
  errors.collect(cdk.propertyValidator("schedule", CfnCrawlerSchedulePropertyValidator)(properties.schedule));
  errors.collect(cdk.propertyValidator("schemaChangePolicy", CfnCrawlerSchemaChangePolicyPropertyValidator)(properties.schemaChangePolicy));
  errors.collect(cdk.propertyValidator("tablePrefix", cdk.validateString)(properties.tablePrefix));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator("targets", cdk.requiredValidator)(properties.targets));
  errors.collect(cdk.propertyValidator("targets", CfnCrawlerTargetsPropertyValidator)(properties.targets));
  return errors.wrap("supplied properties not correct for \"CfnCrawlerProps\"");
}

// @ts-ignore TS6133
function convertCfnCrawlerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCrawlerPropsValidator(properties).assertSuccess();
  return {
    "Classifiers": cdk.listMapper(cdk.stringToCloudFormation)(properties.classifiers),
    "Configuration": cdk.stringToCloudFormation(properties.configuration),
    "CrawlerSecurityConfiguration": cdk.stringToCloudFormation(properties.crawlerSecurityConfiguration),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RecrawlPolicy": convertCfnCrawlerRecrawlPolicyPropertyToCloudFormation(properties.recrawlPolicy),
    "Role": cdk.stringToCloudFormation(properties.role),
    "Schedule": convertCfnCrawlerSchedulePropertyToCloudFormation(properties.schedule),
    "SchemaChangePolicy": convertCfnCrawlerSchemaChangePolicyPropertyToCloudFormation(properties.schemaChangePolicy),
    "TablePrefix": cdk.stringToCloudFormation(properties.tablePrefix),
    "Tags": cdk.objectToCloudFormation(properties.tags),
    "Targets": convertCfnCrawlerTargetsPropertyToCloudFormation(properties.targets)
  };
}

// @ts-ignore TS6133
function CfnCrawlerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCrawlerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCrawlerProps>();
  ret.addPropertyResult("classifiers", "Classifiers", (properties.Classifiers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Classifiers) : undefined));
  ret.addPropertyResult("configuration", "Configuration", (properties.Configuration != null ? cfn_parse.FromCloudFormation.getString(properties.Configuration) : undefined));
  ret.addPropertyResult("crawlerSecurityConfiguration", "CrawlerSecurityConfiguration", (properties.CrawlerSecurityConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.CrawlerSecurityConfiguration) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("recrawlPolicy", "RecrawlPolicy", (properties.RecrawlPolicy != null ? CfnCrawlerRecrawlPolicyPropertyFromCloudFormation(properties.RecrawlPolicy) : undefined));
  ret.addPropertyResult("role", "Role", (properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined));
  ret.addPropertyResult("schedule", "Schedule", (properties.Schedule != null ? CfnCrawlerSchedulePropertyFromCloudFormation(properties.Schedule) : undefined));
  ret.addPropertyResult("schemaChangePolicy", "SchemaChangePolicy", (properties.SchemaChangePolicy != null ? CfnCrawlerSchemaChangePolicyPropertyFromCloudFormation(properties.SchemaChangePolicy) : undefined));
  ret.addPropertyResult("tablePrefix", "TablePrefix", (properties.TablePrefix != null ? cfn_parse.FromCloudFormation.getString(properties.TablePrefix) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addPropertyResult("targets", "Targets", (properties.Targets != null ? CfnCrawlerTargetsPropertyFromCloudFormation(properties.Targets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Sets the security configuration for a specified catalog.
 *
 * After the configuration has been set, the specified encryption is applied to every catalog write thereafter.
 *
 * @cloudformationResource AWS::Glue::DataCatalogEncryptionSettings
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-datacatalogencryptionsettings.html
 */
export class CfnDataCatalogEncryptionSettings extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::DataCatalogEncryptionSettings";

  /**
   * Build a CfnDataCatalogEncryptionSettings from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataCatalogEncryptionSettings {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDataCatalogEncryptionSettingsPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDataCatalogEncryptionSettings(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ID of the Data Catalog in which the settings are created.
   */
  public catalogId: string;

  /**
   * Contains configuration information for maintaining Data Catalog security.
   */
  public dataCatalogEncryptionSettings: CfnDataCatalogEncryptionSettings.DataCatalogEncryptionSettingsProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDataCatalogEncryptionSettingsProps) {
    super(scope, id, {
      "type": CfnDataCatalogEncryptionSettings.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "catalogId", this);
    cdk.requireProperty(props, "dataCatalogEncryptionSettings", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.catalogId = props.catalogId;
    this.dataCatalogEncryptionSettings = props.dataCatalogEncryptionSettings;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "catalogId": this.catalogId,
      "dataCatalogEncryptionSettings": this.dataCatalogEncryptionSettings
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataCatalogEncryptionSettings.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDataCatalogEncryptionSettingsPropsToCloudFormation(props);
  }
}

export namespace CfnDataCatalogEncryptionSettings {
  /**
   * Contains configuration information for maintaining Data Catalog security.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-datacatalogencryptionsettings-datacatalogencryptionsettings.html
   */
  export interface DataCatalogEncryptionSettingsProperty {
    /**
     * When connection password protection is enabled, the Data Catalog uses a customer-provided key to encrypt the password as part of `CreateConnection` or `UpdateConnection` and store it in the `ENCRYPTED_PASSWORD` field in the connection properties.
     *
     * You can enable catalog encryption or only password encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-datacatalogencryptionsettings-datacatalogencryptionsettings.html#cfn-glue-datacatalogencryptionsettings-datacatalogencryptionsettings-connectionpasswordencryption
     */
    readonly connectionPasswordEncryption?: CfnDataCatalogEncryptionSettings.ConnectionPasswordEncryptionProperty | cdk.IResolvable;

    /**
     * Specifies the encryption-at-rest configuration for the Data Catalog.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-datacatalogencryptionsettings-datacatalogencryptionsettings.html#cfn-glue-datacatalogencryptionsettings-datacatalogencryptionsettings-encryptionatrest
     */
    readonly encryptionAtRest?: CfnDataCatalogEncryptionSettings.EncryptionAtRestProperty | cdk.IResolvable;
  }

  /**
   * The data structure used by the Data Catalog to encrypt the password as part of `CreateConnection` or `UpdateConnection` and store it in the `ENCRYPTED_PASSWORD` field in the connection properties.
   *
   * You can enable catalog encryption or only password encryption.
   *
   * When a `CreationConnection` request arrives containing a password, the Data Catalog first encrypts the password using your AWS KMS key. It then encrypts the whole connection object again if catalog encryption is also enabled.
   *
   * This encryption requires that you set AWS KMS key permissions to enable or restrict access on the password key according to your security requirements. For example, you might want only administrators to have decrypt permission on the password key.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-datacatalogencryptionsettings-connectionpasswordencryption.html
   */
  export interface ConnectionPasswordEncryptionProperty {
    /**
     * An AWS KMS key that is used to encrypt the connection password.
     *
     * If connection password protection is enabled, the caller of `CreateConnection` and `UpdateConnection` needs at least `kms:Encrypt` permission on the specified AWS KMS key, to encrypt passwords before storing them in the Data Catalog. You can set the decrypt permission to enable or restrict access on the password key according to your security requirements.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-datacatalogencryptionsettings-connectionpasswordencryption.html#cfn-glue-datacatalogencryptionsettings-connectionpasswordencryption-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * When the `ReturnConnectionPasswordEncrypted` flag is set to "true", passwords remain encrypted in the responses of `GetConnection` and `GetConnections` .
     *
     * This encryption takes effect independently from catalog encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-datacatalogencryptionsettings-connectionpasswordencryption.html#cfn-glue-datacatalogencryptionsettings-connectionpasswordencryption-returnconnectionpasswordencrypted
     */
    readonly returnConnectionPasswordEncrypted?: boolean | cdk.IResolvable;
  }

  /**
   * Specifies the encryption-at-rest configuration for the Data Catalog.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-datacatalogencryptionsettings-encryptionatrest.html
   */
  export interface EncryptionAtRestProperty {
    /**
     * The encryption-at-rest mode for encrypting Data Catalog data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-datacatalogencryptionsettings-encryptionatrest.html#cfn-glue-datacatalogencryptionsettings-encryptionatrest-catalogencryptionmode
     */
    readonly catalogEncryptionMode?: string;

    /**
     * The ID of the AWS KMS key to use for encryption at rest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-datacatalogencryptionsettings-encryptionatrest.html#cfn-glue-datacatalogencryptionsettings-encryptionatrest-sseawskmskeyid
     */
    readonly sseAwsKmsKeyId?: string;
  }
}

/**
 * Properties for defining a `CfnDataCatalogEncryptionSettings`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-datacatalogencryptionsettings.html
 */
export interface CfnDataCatalogEncryptionSettingsProps {
  /**
   * The ID of the Data Catalog in which the settings are created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-datacatalogencryptionsettings.html#cfn-glue-datacatalogencryptionsettings-catalogid
   */
  readonly catalogId: string;

  /**
   * Contains configuration information for maintaining Data Catalog security.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-datacatalogencryptionsettings.html#cfn-glue-datacatalogencryptionsettings-datacatalogencryptionsettings
   */
  readonly dataCatalogEncryptionSettings: CfnDataCatalogEncryptionSettings.DataCatalogEncryptionSettingsProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ConnectionPasswordEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectionPasswordEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataCatalogEncryptionSettingsConnectionPasswordEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("returnConnectionPasswordEncrypted", cdk.validateBoolean)(properties.returnConnectionPasswordEncrypted));
  return errors.wrap("supplied properties not correct for \"ConnectionPasswordEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataCatalogEncryptionSettingsConnectionPasswordEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataCatalogEncryptionSettingsConnectionPasswordEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "ReturnConnectionPasswordEncrypted": cdk.booleanToCloudFormation(properties.returnConnectionPasswordEncrypted)
  };
}

// @ts-ignore TS6133
function CfnDataCatalogEncryptionSettingsConnectionPasswordEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataCatalogEncryptionSettings.ConnectionPasswordEncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataCatalogEncryptionSettings.ConnectionPasswordEncryptionProperty>();
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("returnConnectionPasswordEncrypted", "ReturnConnectionPasswordEncrypted", (properties.ReturnConnectionPasswordEncrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReturnConnectionPasswordEncrypted) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionAtRestProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionAtRestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataCatalogEncryptionSettingsEncryptionAtRestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogEncryptionMode", cdk.validateString)(properties.catalogEncryptionMode));
  errors.collect(cdk.propertyValidator("sseAwsKmsKeyId", cdk.validateString)(properties.sseAwsKmsKeyId));
  return errors.wrap("supplied properties not correct for \"EncryptionAtRestProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataCatalogEncryptionSettingsEncryptionAtRestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataCatalogEncryptionSettingsEncryptionAtRestPropertyValidator(properties).assertSuccess();
  return {
    "CatalogEncryptionMode": cdk.stringToCloudFormation(properties.catalogEncryptionMode),
    "SseAwsKmsKeyId": cdk.stringToCloudFormation(properties.sseAwsKmsKeyId)
  };
}

// @ts-ignore TS6133
function CfnDataCatalogEncryptionSettingsEncryptionAtRestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataCatalogEncryptionSettings.EncryptionAtRestProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataCatalogEncryptionSettings.EncryptionAtRestProperty>();
  ret.addPropertyResult("catalogEncryptionMode", "CatalogEncryptionMode", (properties.CatalogEncryptionMode != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogEncryptionMode) : undefined));
  ret.addPropertyResult("sseAwsKmsKeyId", "SseAwsKmsKeyId", (properties.SseAwsKmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.SseAwsKmsKeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataCatalogEncryptionSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `DataCatalogEncryptionSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataCatalogEncryptionSettingsDataCatalogEncryptionSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionPasswordEncryption", CfnDataCatalogEncryptionSettingsConnectionPasswordEncryptionPropertyValidator)(properties.connectionPasswordEncryption));
  errors.collect(cdk.propertyValidator("encryptionAtRest", CfnDataCatalogEncryptionSettingsEncryptionAtRestPropertyValidator)(properties.encryptionAtRest));
  return errors.wrap("supplied properties not correct for \"DataCatalogEncryptionSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataCatalogEncryptionSettingsDataCatalogEncryptionSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataCatalogEncryptionSettingsDataCatalogEncryptionSettingsPropertyValidator(properties).assertSuccess();
  return {
    "ConnectionPasswordEncryption": convertCfnDataCatalogEncryptionSettingsConnectionPasswordEncryptionPropertyToCloudFormation(properties.connectionPasswordEncryption),
    "EncryptionAtRest": convertCfnDataCatalogEncryptionSettingsEncryptionAtRestPropertyToCloudFormation(properties.encryptionAtRest)
  };
}

// @ts-ignore TS6133
function CfnDataCatalogEncryptionSettingsDataCatalogEncryptionSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataCatalogEncryptionSettings.DataCatalogEncryptionSettingsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataCatalogEncryptionSettings.DataCatalogEncryptionSettingsProperty>();
  ret.addPropertyResult("connectionPasswordEncryption", "ConnectionPasswordEncryption", (properties.ConnectionPasswordEncryption != null ? CfnDataCatalogEncryptionSettingsConnectionPasswordEncryptionPropertyFromCloudFormation(properties.ConnectionPasswordEncryption) : undefined));
  ret.addPropertyResult("encryptionAtRest", "EncryptionAtRest", (properties.EncryptionAtRest != null ? CfnDataCatalogEncryptionSettingsEncryptionAtRestPropertyFromCloudFormation(properties.EncryptionAtRest) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDataCatalogEncryptionSettingsProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataCatalogEncryptionSettingsProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataCatalogEncryptionSettingsPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("dataCatalogEncryptionSettings", cdk.requiredValidator)(properties.dataCatalogEncryptionSettings));
  errors.collect(cdk.propertyValidator("dataCatalogEncryptionSettings", CfnDataCatalogEncryptionSettingsDataCatalogEncryptionSettingsPropertyValidator)(properties.dataCatalogEncryptionSettings));
  return errors.wrap("supplied properties not correct for \"CfnDataCatalogEncryptionSettingsProps\"");
}

// @ts-ignore TS6133
function convertCfnDataCatalogEncryptionSettingsPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataCatalogEncryptionSettingsPropsValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "DataCatalogEncryptionSettings": convertCfnDataCatalogEncryptionSettingsDataCatalogEncryptionSettingsPropertyToCloudFormation(properties.dataCatalogEncryptionSettings)
  };
}

// @ts-ignore TS6133
function CfnDataCatalogEncryptionSettingsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataCatalogEncryptionSettingsProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataCatalogEncryptionSettingsProps>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("dataCatalogEncryptionSettings", "DataCatalogEncryptionSettings", (properties.DataCatalogEncryptionSettings != null ? CfnDataCatalogEncryptionSettingsDataCatalogEncryptionSettingsPropertyFromCloudFormation(properties.DataCatalogEncryptionSettings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Glue::DataQualityRuleset` resource specifies a data quality ruleset with DQDL rules applied to a specified AWS Glue table.
 *
 * For more information, see AWS Glue Data Quality in the AWS Glue Developer Guide.
 *
 * @cloudformationResource AWS::Glue::DataQualityRuleset
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-dataqualityruleset.html
 */
export class CfnDataQualityRuleset extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::DataQualityRuleset";

  /**
   * Build a CfnDataQualityRuleset from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataQualityRuleset {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDataQualityRulesetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDataQualityRuleset(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Used for idempotency and is recommended to be set to a random ID (such as a UUID) to avoid creating or starting multiple instances of the same resource.
   */
  public clientToken?: string;

  /**
   * A description of the data quality ruleset.
   */
  public description?: string;

  /**
   * The name of the data quality ruleset.
   */
  public name?: string;

  /**
   * A Data Quality Definition Language (DQDL) ruleset.
   */
  public ruleset?: string;

  /**
   * A list of tags applied to the data quality ruleset.
   */
  public tags?: any;

  /**
   * An object representing an AWS Glue table.
   */
  public targetTable?: CfnDataQualityRuleset.DataQualityTargetTableProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDataQualityRulesetProps = {}) {
    super(scope, id, {
      "type": CfnDataQualityRuleset.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.clientToken = props.clientToken;
    this.description = props.description;
    this.name = props.name;
    this.ruleset = props.ruleset;
    this.tags = props.tags;
    this.targetTable = props.targetTable;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clientToken": this.clientToken,
      "description": this.description,
      "name": this.name,
      "ruleset": this.ruleset,
      "tags": this.tags,
      "targetTable": this.targetTable
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataQualityRuleset.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDataQualityRulesetPropsToCloudFormation(props);
  }
}

export namespace CfnDataQualityRuleset {
  /**
   * An object representing an AWS Glue table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-dataqualityruleset-dataqualitytargettable.html
   */
  export interface DataQualityTargetTableProperty {
    /**
     * The name of the database where the AWS Glue table exists.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-dataqualityruleset-dataqualitytargettable.html#cfn-glue-dataqualityruleset-dataqualitytargettable-databasename
     */
    readonly databaseName?: string;

    /**
     * The name of the AWS Glue table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-dataqualityruleset-dataqualitytargettable.html#cfn-glue-dataqualityruleset-dataqualitytargettable-tablename
     */
    readonly tableName?: string;
  }
}

/**
 * Properties for defining a `CfnDataQualityRuleset`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-dataqualityruleset.html
 */
export interface CfnDataQualityRulesetProps {
  /**
   * Used for idempotency and is recommended to be set to a random ID (such as a UUID) to avoid creating or starting multiple instances of the same resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-dataqualityruleset.html#cfn-glue-dataqualityruleset-clienttoken
   */
  readonly clientToken?: string;

  /**
   * A description of the data quality ruleset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-dataqualityruleset.html#cfn-glue-dataqualityruleset-description
   */
  readonly description?: string;

  /**
   * The name of the data quality ruleset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-dataqualityruleset.html#cfn-glue-dataqualityruleset-name
   */
  readonly name?: string;

  /**
   * A Data Quality Definition Language (DQDL) ruleset.
   *
   * For more information see the AWS Glue Developer Guide.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-dataqualityruleset.html#cfn-glue-dataqualityruleset-ruleset
   */
  readonly ruleset?: string;

  /**
   * A list of tags applied to the data quality ruleset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-dataqualityruleset.html#cfn-glue-dataqualityruleset-tags
   */
  readonly tags?: any;

  /**
   * An object representing an AWS Glue table.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-dataqualityruleset.html#cfn-glue-dataqualityruleset-targettable
   */
  readonly targetTable?: CfnDataQualityRuleset.DataQualityTargetTableProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `DataQualityTargetTableProperty`
 *
 * @param properties - the TypeScript properties of a `DataQualityTargetTableProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataQualityRulesetDataQualityTargetTablePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"DataQualityTargetTableProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataQualityRulesetDataQualityTargetTablePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataQualityRulesetDataQualityTargetTablePropertyValidator(properties).assertSuccess();
  return {
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnDataQualityRulesetDataQualityTargetTablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataQualityRuleset.DataQualityTargetTableProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataQualityRuleset.DataQualityTargetTableProperty>();
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDataQualityRulesetProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataQualityRulesetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataQualityRulesetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientToken", cdk.validateString)(properties.clientToken));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("ruleset", cdk.validateString)(properties.ruleset));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator("targetTable", CfnDataQualityRulesetDataQualityTargetTablePropertyValidator)(properties.targetTable));
  return errors.wrap("supplied properties not correct for \"CfnDataQualityRulesetProps\"");
}

// @ts-ignore TS6133
function convertCfnDataQualityRulesetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataQualityRulesetPropsValidator(properties).assertSuccess();
  return {
    "ClientToken": cdk.stringToCloudFormation(properties.clientToken),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Ruleset": cdk.stringToCloudFormation(properties.ruleset),
    "Tags": cdk.objectToCloudFormation(properties.tags),
    "TargetTable": convertCfnDataQualityRulesetDataQualityTargetTablePropertyToCloudFormation(properties.targetTable)
  };
}

// @ts-ignore TS6133
function CfnDataQualityRulesetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataQualityRulesetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataQualityRulesetProps>();
  ret.addPropertyResult("clientToken", "ClientToken", (properties.ClientToken != null ? cfn_parse.FromCloudFormation.getString(properties.ClientToken) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("ruleset", "Ruleset", (properties.Ruleset != null ? cfn_parse.FromCloudFormation.getString(properties.Ruleset) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addPropertyResult("targetTable", "TargetTable", (properties.TargetTable != null ? CfnDataQualityRulesetDataQualityTargetTablePropertyFromCloudFormation(properties.TargetTable) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Glue::Database` resource specifies a logical grouping of tables in AWS Glue .
 *
 * For more information, see [Defining a Database in Your Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/define-database.html) and [Database Structure](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-catalog-databases.html#aws-glue-api-catalog-databases-Database) in the *AWS Glue Developer Guide* .
 *
 * @cloudformationResource AWS::Glue::Database
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-database.html
 */
export class CfnDatabase extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::Database";

  /**
   * Build a CfnDatabase from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDatabase {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDatabasePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDatabase(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The AWS account ID for the account in which to create the catalog object.
   */
  public catalogId: string;

  /**
   * The metadata for the database.
   */
  public databaseInput: CfnDatabase.DatabaseInputProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDatabaseProps) {
    super(scope, id, {
      "type": CfnDatabase.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "catalogId", this);
    cdk.requireProperty(props, "databaseInput", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.catalogId = props.catalogId;
    this.databaseInput = props.databaseInput;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "catalogId": this.catalogId,
      "databaseInput": this.databaseInput
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDatabase.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDatabasePropsToCloudFormation(props);
  }
}

export namespace CfnDatabase {
  /**
   * The structure used to create or update a database.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-databaseinput.html
   */
  export interface DatabaseInputProperty {
    /**
     * Creates a set of default permissions on the table for principals.
     *
     * Used by AWS Lake Formation . Not used in the normal course of AWS Glue operations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-databaseinput.html#cfn-glue-database-databaseinput-createtabledefaultpermissions
     */
    readonly createTableDefaultPermissions?: Array<cdk.IResolvable | CfnDatabase.PrincipalPrivilegesProperty> | cdk.IResolvable;

    /**
     * A description of the database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-databaseinput.html#cfn-glue-database-databaseinput-description
     */
    readonly description?: string;

    /**
     * A `FederatedDatabase` structure that references an entity outside the AWS Glue Data Catalog .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-databaseinput.html#cfn-glue-database-databaseinput-federateddatabase
     */
    readonly federatedDatabase?: CfnDatabase.FederatedDatabaseProperty | cdk.IResolvable;

    /**
     * The location of the database (for example, an HDFS path).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-databaseinput.html#cfn-glue-database-databaseinput-locationuri
     */
    readonly locationUri?: string;

    /**
     * The name of the database.
     *
     * For Hive compatibility, this is folded to lowercase when it is stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-databaseinput.html#cfn-glue-database-databaseinput-name
     */
    readonly name?: string;

    /**
     * These key-value pairs define parameters and properties of the database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-databaseinput.html#cfn-glue-database-databaseinput-parameters
     */
    readonly parameters?: any | cdk.IResolvable;

    /**
     * A `DatabaseIdentifier` structure that describes a target database for resource linking.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-databaseinput.html#cfn-glue-database-databaseinput-targetdatabase
     */
    readonly targetDatabase?: CfnDatabase.DatabaseIdentifierProperty | cdk.IResolvable;
  }

  /**
   * the permissions granted to a principal.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-principalprivileges.html
   */
  export interface PrincipalPrivilegesProperty {
    /**
     * The permissions that are granted to the principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-principalprivileges.html#cfn-glue-database-principalprivileges-permissions
     */
    readonly permissions?: Array<string>;

    /**
     * The principal who is granted permissions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-principalprivileges.html#cfn-glue-database-principalprivileges-principal
     */
    readonly principal?: CfnDatabase.DataLakePrincipalProperty | cdk.IResolvable;
  }

  /**
   * The AWS Lake Formation principal.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-datalakeprincipal.html
   */
  export interface DataLakePrincipalProperty {
    /**
     * An identifier for the AWS Lake Formation principal.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-datalakeprincipal.html#cfn-glue-database-datalakeprincipal-datalakeprincipalidentifier
     */
    readonly dataLakePrincipalIdentifier?: string;
  }

  /**
   * A structure that describes a target database for resource linking.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-databaseidentifier.html
   */
  export interface DatabaseIdentifierProperty {
    /**
     * The ID of the Data Catalog in which the database resides.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-databaseidentifier.html#cfn-glue-database-databaseidentifier-catalogid
     */
    readonly catalogId?: string;

    /**
     * The name of the catalog database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-databaseidentifier.html#cfn-glue-database-databaseidentifier-databasename
     */
    readonly databaseName?: string;

    /**
     * Region of the target database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-databaseidentifier.html#cfn-glue-database-databaseidentifier-region
     */
    readonly region?: string;
  }

  /**
   * A `FederatedDatabase` structure that references an entity outside the AWS Glue Data Catalog .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-federateddatabase.html
   */
  export interface FederatedDatabaseProperty {
    /**
     * The name of the connection to the external metastore.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-federateddatabase.html#cfn-glue-database-federateddatabase-connectionname
     */
    readonly connectionName?: string;

    /**
     * A unique identifier for the federated database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-database-federateddatabase.html#cfn-glue-database-federateddatabase-identifier
     */
    readonly identifier?: string;
  }
}

/**
 * Properties for defining a `CfnDatabase`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-database.html
 */
export interface CfnDatabaseProps {
  /**
   * The AWS account ID for the account in which to create the catalog object.
   *
   * > To specify the account ID, you can use the `Ref` intrinsic function with the `AWS::AccountId` pseudo parameter. For example: `!Ref AWS::AccountId`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-database.html#cfn-glue-database-catalogid
   */
  readonly catalogId: string;

  /**
   * The metadata for the database.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-database.html#cfn-glue-database-databaseinput
   */
  readonly databaseInput: CfnDatabase.DatabaseInputProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `DataLakePrincipalProperty`
 *
 * @param properties - the TypeScript properties of a `DataLakePrincipalProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatabaseDataLakePrincipalPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataLakePrincipalIdentifier", cdk.validateString)(properties.dataLakePrincipalIdentifier));
  return errors.wrap("supplied properties not correct for \"DataLakePrincipalProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatabaseDataLakePrincipalPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatabaseDataLakePrincipalPropertyValidator(properties).assertSuccess();
  return {
    "DataLakePrincipalIdentifier": cdk.stringToCloudFormation(properties.dataLakePrincipalIdentifier)
  };
}

// @ts-ignore TS6133
function CfnDatabaseDataLakePrincipalPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatabase.DataLakePrincipalProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatabase.DataLakePrincipalProperty>();
  ret.addPropertyResult("dataLakePrincipalIdentifier", "DataLakePrincipalIdentifier", (properties.DataLakePrincipalIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.DataLakePrincipalIdentifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PrincipalPrivilegesProperty`
 *
 * @param properties - the TypeScript properties of a `PrincipalPrivilegesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatabasePrincipalPrivilegesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("permissions", cdk.listValidator(cdk.validateString))(properties.permissions));
  errors.collect(cdk.propertyValidator("principal", CfnDatabaseDataLakePrincipalPropertyValidator)(properties.principal));
  return errors.wrap("supplied properties not correct for \"PrincipalPrivilegesProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatabasePrincipalPrivilegesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatabasePrincipalPrivilegesPropertyValidator(properties).assertSuccess();
  return {
    "Permissions": cdk.listMapper(cdk.stringToCloudFormation)(properties.permissions),
    "Principal": convertCfnDatabaseDataLakePrincipalPropertyToCloudFormation(properties.principal)
  };
}

// @ts-ignore TS6133
function CfnDatabasePrincipalPrivilegesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDatabase.PrincipalPrivilegesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatabase.PrincipalPrivilegesProperty>();
  ret.addPropertyResult("permissions", "Permissions", (properties.Permissions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Permissions) : undefined));
  ret.addPropertyResult("principal", "Principal", (properties.Principal != null ? CfnDatabaseDataLakePrincipalPropertyFromCloudFormation(properties.Principal) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatabaseIdentifierProperty`
 *
 * @param properties - the TypeScript properties of a `DatabaseIdentifierProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatabaseDatabaseIdentifierPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  return errors.wrap("supplied properties not correct for \"DatabaseIdentifierProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatabaseDatabaseIdentifierPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatabaseDatabaseIdentifierPropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "Region": cdk.stringToCloudFormation(properties.region)
  };
}

// @ts-ignore TS6133
function CfnDatabaseDatabaseIdentifierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatabase.DatabaseIdentifierProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatabase.DatabaseIdentifierProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FederatedDatabaseProperty`
 *
 * @param properties - the TypeScript properties of a `FederatedDatabaseProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatabaseFederatedDatabasePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionName", cdk.validateString)(properties.connectionName));
  errors.collect(cdk.propertyValidator("identifier", cdk.validateString)(properties.identifier));
  return errors.wrap("supplied properties not correct for \"FederatedDatabaseProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatabaseFederatedDatabasePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatabaseFederatedDatabasePropertyValidator(properties).assertSuccess();
  return {
    "ConnectionName": cdk.stringToCloudFormation(properties.connectionName),
    "Identifier": cdk.stringToCloudFormation(properties.identifier)
  };
}

// @ts-ignore TS6133
function CfnDatabaseFederatedDatabasePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatabase.FederatedDatabaseProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatabase.FederatedDatabaseProperty>();
  ret.addPropertyResult("connectionName", "ConnectionName", (properties.ConnectionName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionName) : undefined));
  ret.addPropertyResult("identifier", "Identifier", (properties.Identifier != null ? cfn_parse.FromCloudFormation.getString(properties.Identifier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatabaseInputProperty`
 *
 * @param properties - the TypeScript properties of a `DatabaseInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatabaseDatabaseInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("createTableDefaultPermissions", cdk.listValidator(CfnDatabasePrincipalPrivilegesPropertyValidator))(properties.createTableDefaultPermissions));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("federatedDatabase", CfnDatabaseFederatedDatabasePropertyValidator)(properties.federatedDatabase));
  errors.collect(cdk.propertyValidator("locationUri", cdk.validateString)(properties.locationUri));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("targetDatabase", CfnDatabaseDatabaseIdentifierPropertyValidator)(properties.targetDatabase));
  return errors.wrap("supplied properties not correct for \"DatabaseInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatabaseDatabaseInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatabaseDatabaseInputPropertyValidator(properties).assertSuccess();
  return {
    "CreateTableDefaultPermissions": cdk.listMapper(convertCfnDatabasePrincipalPrivilegesPropertyToCloudFormation)(properties.createTableDefaultPermissions),
    "Description": cdk.stringToCloudFormation(properties.description),
    "FederatedDatabase": convertCfnDatabaseFederatedDatabasePropertyToCloudFormation(properties.federatedDatabase),
    "LocationUri": cdk.stringToCloudFormation(properties.locationUri),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "TargetDatabase": convertCfnDatabaseDatabaseIdentifierPropertyToCloudFormation(properties.targetDatabase)
  };
}

// @ts-ignore TS6133
function CfnDatabaseDatabaseInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatabase.DatabaseInputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatabase.DatabaseInputProperty>();
  ret.addPropertyResult("createTableDefaultPermissions", "CreateTableDefaultPermissions", (properties.CreateTableDefaultPermissions != null ? cfn_parse.FromCloudFormation.getArray(CfnDatabasePrincipalPrivilegesPropertyFromCloudFormation)(properties.CreateTableDefaultPermissions) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("federatedDatabase", "FederatedDatabase", (properties.FederatedDatabase != null ? CfnDatabaseFederatedDatabasePropertyFromCloudFormation(properties.FederatedDatabase) : undefined));
  ret.addPropertyResult("locationUri", "LocationUri", (properties.LocationUri != null ? cfn_parse.FromCloudFormation.getString(properties.LocationUri) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("targetDatabase", "TargetDatabase", (properties.TargetDatabase != null ? CfnDatabaseDatabaseIdentifierPropertyFromCloudFormation(properties.TargetDatabase) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDatabaseProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatabaseProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatabasePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("databaseInput", cdk.requiredValidator)(properties.databaseInput));
  errors.collect(cdk.propertyValidator("databaseInput", CfnDatabaseDatabaseInputPropertyValidator)(properties.databaseInput));
  return errors.wrap("supplied properties not correct for \"CfnDatabaseProps\"");
}

// @ts-ignore TS6133
function convertCfnDatabasePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatabasePropsValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "DatabaseInput": convertCfnDatabaseDatabaseInputPropertyToCloudFormation(properties.databaseInput)
  };
}

// @ts-ignore TS6133
function CfnDatabasePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatabaseProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatabaseProps>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("databaseInput", "DatabaseInput", (properties.DatabaseInput != null ? CfnDatabaseDatabaseInputPropertyFromCloudFormation(properties.DatabaseInput) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Glue::DevEndpoint` resource specifies a development endpoint where a developer can remotely debug ETL scripts for AWS Glue .
 *
 * For more information, see [DevEndpoint Structure](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-jobs-dev-endpoint.html#aws-glue-api-jobs-dev-endpoint-DevEndpoint) in the AWS Glue Developer Guide.
 *
 * @cloudformationResource AWS::Glue::DevEndpoint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html
 */
export class CfnDevEndpoint extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::DevEndpoint";

  /**
   * Build a CfnDevEndpoint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDevEndpoint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDevEndpointPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDevEndpoint(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A map of arguments used to configure the `DevEndpoint` .
   */
  public arguments?: any | cdk.IResolvable;

  /**
   * The name of the `DevEndpoint` .
   */
  public endpointName?: string;

  /**
   * The path to one or more Java `.jar` files in an S3 bucket that should be loaded in your `DevEndpoint` .
   */
  public extraJarsS3Path?: string;

  /**
   * The paths to one or more Python libraries in an Amazon S3 bucket that should be loaded in your `DevEndpoint` .
   */
  public extraPythonLibsS3Path?: string;

  /**
   * The AWS Glue version determines the versions of Apache Spark and Python that AWS Glue supports.
   */
  public glueVersion?: string;

  /**
   * The number of AWS Glue Data Processing Units (DPUs) allocated to this `DevEndpoint` .
   */
  public numberOfNodes?: number;

  /**
   * The number of workers of a defined `workerType` that are allocated to the development endpoint.
   */
  public numberOfWorkers?: number;

  /**
   * The public key to be used by this `DevEndpoint` for authentication.
   */
  public publicKey?: string;

  /**
   * A list of public keys to be used by the `DevEndpoints` for authentication.
   */
  public publicKeys?: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the IAM role used in this `DevEndpoint` .
   */
  public roleArn: string;

  /**
   * The name of the `SecurityConfiguration` structure to be used with this `DevEndpoint` .
   */
  public securityConfiguration?: string;

  /**
   * A list of security group identifiers used in this `DevEndpoint` .
   */
  public securityGroupIds?: Array<string>;

  /**
   * The subnet ID for this `DevEndpoint` .
   */
  public subnetId?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to use with this DevEndpoint.
   */
  public tagsRaw?: any;

  /**
   * The type of predefined worker that is allocated to the development endpoint.
   */
  public workerType?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDevEndpointProps) {
    super(scope, id, {
      "type": CfnDevEndpoint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "roleArn", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.arguments = props.arguments;
    this.endpointName = props.endpointName;
    this.extraJarsS3Path = props.extraJarsS3Path;
    this.extraPythonLibsS3Path = props.extraPythonLibsS3Path;
    this.glueVersion = props.glueVersion;
    this.numberOfNodes = props.numberOfNodes;
    this.numberOfWorkers = props.numberOfWorkers;
    this.publicKey = props.publicKey;
    this.publicKeys = props.publicKeys;
    this.roleArn = props.roleArn;
    this.securityConfiguration = props.securityConfiguration;
    this.securityGroupIds = props.securityGroupIds;
    this.subnetId = props.subnetId;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Glue::DevEndpoint", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.workerType = props.workerType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "arguments": this.arguments,
      "endpointName": this.endpointName,
      "extraJarsS3Path": this.extraJarsS3Path,
      "extraPythonLibsS3Path": this.extraPythonLibsS3Path,
      "glueVersion": this.glueVersion,
      "numberOfNodes": this.numberOfNodes,
      "numberOfWorkers": this.numberOfWorkers,
      "publicKey": this.publicKey,
      "publicKeys": this.publicKeys,
      "roleArn": this.roleArn,
      "securityConfiguration": this.securityConfiguration,
      "securityGroupIds": this.securityGroupIds,
      "subnetId": this.subnetId,
      "tags": this.tags.renderTags(),
      "workerType": this.workerType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDevEndpoint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDevEndpointPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDevEndpoint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html
 */
export interface CfnDevEndpointProps {
  /**
   * A map of arguments used to configure the `DevEndpoint` .
   *
   * Valid arguments are:
   *
   * - `"--enable-glue-datacatalog": ""`
   * - `"GLUE_PYTHON_VERSION": "3"`
   * - `"GLUE_PYTHON_VERSION": "2"`
   *
   * You can specify a version of Python support for development endpoints by using the `Arguments` parameter in the `CreateDevEndpoint` or `UpdateDevEndpoint` APIs. If no arguments are provided, the version defaults to Python 2.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-arguments
   */
  readonly arguments?: any | cdk.IResolvable;

  /**
   * The name of the `DevEndpoint` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-endpointname
   */
  readonly endpointName?: string;

  /**
   * The path to one or more Java `.jar` files in an S3 bucket that should be loaded in your `DevEndpoint` .
   *
   * > You can only use pure Java/Scala libraries with a `DevEndpoint` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-extrajarss3path
   */
  readonly extraJarsS3Path?: string;

  /**
   * The paths to one or more Python libraries in an Amazon S3 bucket that should be loaded in your `DevEndpoint` .
   *
   * Multiple values must be complete paths separated by a comma.
   *
   * > You can only use pure Python libraries with a `DevEndpoint` . Libraries that rely on C extensions, such as the [pandas](https://docs.aws.amazon.com/http://pandas.pydata.org/) Python data analysis library, are not currently supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-extrapythonlibss3path
   */
  readonly extraPythonLibsS3Path?: string;

  /**
   * The AWS Glue version determines the versions of Apache Spark and Python that AWS Glue supports.
   *
   * The Python version indicates the version supported for running your ETL scripts on development endpoints.
   *
   * For more information about the available AWS Glue versions and corresponding Spark and Python versions, see [Glue version](https://docs.aws.amazon.com/glue/latest/dg/add-job.html) in the developer guide.
   *
   * Development endpoints that are created without specifying a Glue version default to Glue 0.9.
   *
   * You can specify a version of Python support for development endpoints by using the `Arguments` parameter in the `CreateDevEndpoint` or `UpdateDevEndpoint` APIs. If no arguments are provided, the version defaults to Python 2.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-glueversion
   */
  readonly glueVersion?: string;

  /**
   * The number of AWS Glue Data Processing Units (DPUs) allocated to this `DevEndpoint` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-numberofnodes
   */
  readonly numberOfNodes?: number;

  /**
   * The number of workers of a defined `workerType` that are allocated to the development endpoint.
   *
   * The maximum number of workers you can define are 299 for `G.1X` , and 149 for `G.2X` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-numberofworkers
   */
  readonly numberOfWorkers?: number;

  /**
   * The public key to be used by this `DevEndpoint` for authentication.
   *
   * This attribute is provided for backward compatibility because the recommended attribute to use is public keys.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-publickey
   */
  readonly publicKey?: string;

  /**
   * A list of public keys to be used by the `DevEndpoints` for authentication.
   *
   * Using this attribute is preferred over a single public key because the public keys allow you to have a different private key per client.
   *
   * > If you previously created an endpoint with a public key, you must remove that key to be able to set a list of public keys. Call the `UpdateDevEndpoint` API operation with the public key content in the `deletePublicKeys` attribute, and the list of new keys in the `addPublicKeys` attribute.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-publickeys
   */
  readonly publicKeys?: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the IAM role used in this `DevEndpoint` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-rolearn
   */
  readonly roleArn: string;

  /**
   * The name of the `SecurityConfiguration` structure to be used with this `DevEndpoint` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-securityconfiguration
   */
  readonly securityConfiguration?: string;

  /**
   * A list of security group identifiers used in this `DevEndpoint` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-securitygroupids
   */
  readonly securityGroupIds?: Array<string>;

  /**
   * The subnet ID for this `DevEndpoint` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-subnetid
   */
  readonly subnetId?: string;

  /**
   * The tags to use with this DevEndpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-tags
   */
  readonly tags?: any;

  /**
   * The type of predefined worker that is allocated to the development endpoint.
   *
   * Accepts a value of Standard, G.1X, or G.2X.
   *
   * - For the `Standard` worker type, each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.
   * - For the `G.1X` worker type, each worker maps to 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker. We recommend this worker type for memory-intensive jobs.
   * - For the `G.2X` worker type, each worker maps to 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker. We recommend this worker type for memory-intensive jobs.
   *
   * Known issue: when a development endpoint is created with the `G.2X` `WorkerType` configuration, the Spark drivers for the development endpoint will run on 4 vCPU, 16 GB of memory, and a 64 GB disk.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-devendpoint.html#cfn-glue-devendpoint-workertype
   */
  readonly workerType?: string;
}

/**
 * Determine whether the given properties match those of a `CfnDevEndpointProps`
 *
 * @param properties - the TypeScript properties of a `CfnDevEndpointProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDevEndpointPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arguments", cdk.validateObject)(properties.arguments));
  errors.collect(cdk.propertyValidator("endpointName", cdk.validateString)(properties.endpointName));
  errors.collect(cdk.propertyValidator("extraJarsS3Path", cdk.validateString)(properties.extraJarsS3Path));
  errors.collect(cdk.propertyValidator("extraPythonLibsS3Path", cdk.validateString)(properties.extraPythonLibsS3Path));
  errors.collect(cdk.propertyValidator("glueVersion", cdk.validateString)(properties.glueVersion));
  errors.collect(cdk.propertyValidator("numberOfNodes", cdk.validateNumber)(properties.numberOfNodes));
  errors.collect(cdk.propertyValidator("numberOfWorkers", cdk.validateNumber)(properties.numberOfWorkers));
  errors.collect(cdk.propertyValidator("publicKey", cdk.validateString)(properties.publicKey));
  errors.collect(cdk.propertyValidator("publicKeys", cdk.listValidator(cdk.validateString))(properties.publicKeys));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("securityConfiguration", cdk.validateString)(properties.securityConfiguration));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetId", cdk.validateString)(properties.subnetId));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator("workerType", cdk.validateString)(properties.workerType));
  return errors.wrap("supplied properties not correct for \"CfnDevEndpointProps\"");
}

// @ts-ignore TS6133
function convertCfnDevEndpointPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDevEndpointPropsValidator(properties).assertSuccess();
  return {
    "Arguments": cdk.objectToCloudFormation(properties.arguments),
    "EndpointName": cdk.stringToCloudFormation(properties.endpointName),
    "ExtraJarsS3Path": cdk.stringToCloudFormation(properties.extraJarsS3Path),
    "ExtraPythonLibsS3Path": cdk.stringToCloudFormation(properties.extraPythonLibsS3Path),
    "GlueVersion": cdk.stringToCloudFormation(properties.glueVersion),
    "NumberOfNodes": cdk.numberToCloudFormation(properties.numberOfNodes),
    "NumberOfWorkers": cdk.numberToCloudFormation(properties.numberOfWorkers),
    "PublicKey": cdk.stringToCloudFormation(properties.publicKey),
    "PublicKeys": cdk.listMapper(cdk.stringToCloudFormation)(properties.publicKeys),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SecurityConfiguration": cdk.stringToCloudFormation(properties.securityConfiguration),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetId": cdk.stringToCloudFormation(properties.subnetId),
    "Tags": cdk.objectToCloudFormation(properties.tags),
    "WorkerType": cdk.stringToCloudFormation(properties.workerType)
  };
}

// @ts-ignore TS6133
function CfnDevEndpointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDevEndpointProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDevEndpointProps>();
  ret.addPropertyResult("arguments", "Arguments", (properties.Arguments != null ? cfn_parse.FromCloudFormation.getAny(properties.Arguments) : undefined));
  ret.addPropertyResult("endpointName", "EndpointName", (properties.EndpointName != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointName) : undefined));
  ret.addPropertyResult("extraJarsS3Path", "ExtraJarsS3Path", (properties.ExtraJarsS3Path != null ? cfn_parse.FromCloudFormation.getString(properties.ExtraJarsS3Path) : undefined));
  ret.addPropertyResult("extraPythonLibsS3Path", "ExtraPythonLibsS3Path", (properties.ExtraPythonLibsS3Path != null ? cfn_parse.FromCloudFormation.getString(properties.ExtraPythonLibsS3Path) : undefined));
  ret.addPropertyResult("glueVersion", "GlueVersion", (properties.GlueVersion != null ? cfn_parse.FromCloudFormation.getString(properties.GlueVersion) : undefined));
  ret.addPropertyResult("numberOfNodes", "NumberOfNodes", (properties.NumberOfNodes != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfNodes) : undefined));
  ret.addPropertyResult("numberOfWorkers", "NumberOfWorkers", (properties.NumberOfWorkers != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfWorkers) : undefined));
  ret.addPropertyResult("publicKey", "PublicKey", (properties.PublicKey != null ? cfn_parse.FromCloudFormation.getString(properties.PublicKey) : undefined));
  ret.addPropertyResult("publicKeys", "PublicKeys", (properties.PublicKeys != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PublicKeys) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("securityConfiguration", "SecurityConfiguration", (properties.SecurityConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityConfiguration) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetId", "SubnetId", (properties.SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addPropertyResult("workerType", "WorkerType", (properties.WorkerType != null ? cfn_parse.FromCloudFormation.getString(properties.WorkerType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Glue::Job` resource specifies an AWS Glue job in the data catalog.
 *
 * For more information, see [Adding Jobs in AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/add-job.html) and [Job Structure](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-jobs-job.html#aws-glue-api-jobs-job-Job) in the *AWS Glue Developer Guide.*
 *
 * @cloudformationResource AWS::Glue::Job
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html
 */
export class CfnJob extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::Job";

  /**
   * Build a CfnJob from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnJob {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnJobPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnJob(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of this job run.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * This parameter is no longer supported. Use `MaxCapacity` instead.
   */
  public allocatedCapacity?: number;

  /**
   * The code that executes a job.
   */
  public command: cdk.IResolvable | CfnJob.JobCommandProperty;

  /**
   * The connections used for this job.
   */
  public connections?: CfnJob.ConnectionsListProperty | cdk.IResolvable;

  /**
   * The default arguments for this job, specified as name-value pairs.
   */
  public defaultArguments?: any | cdk.IResolvable;

  /**
   * A description of the job.
   */
  public description?: string;

  /**
   * Indicates whether the job is run with a standard or flexible execution class.
   */
  public executionClass?: string;

  /**
   * The maximum number of concurrent runs that are allowed for this job.
   */
  public executionProperty?: CfnJob.ExecutionPropertyProperty | cdk.IResolvable;

  /**
   * Glue version determines the versions of Apache Spark and Python that AWS Glue supports.
   */
  public glueVersion?: string;

  /**
   * This field is reserved for future use.
   */
  public logUri?: string;

  /**
   * The number of AWS Glue data processing units (DPUs) that can be allocated when this job runs.
   */
  public maxCapacity?: number;

  /**
   * The maximum number of times to retry this job after a JobRun fails.
   */
  public maxRetries?: number;

  /**
   * The name you assign to this job definition.
   */
  public name?: string;

  /**
   * Non-overridable arguments for this job, specified as name-value pairs.
   */
  public nonOverridableArguments?: any | cdk.IResolvable;

  /**
   * Specifies configuration properties of a notification.
   */
  public notificationProperty?: cdk.IResolvable | CfnJob.NotificationPropertyProperty;

  /**
   * The number of workers of a defined `workerType` that are allocated when a job runs.
   */
  public numberOfWorkers?: number;

  /**
   * The name or Amazon Resource Name (ARN) of the IAM role associated with this job.
   */
  public role: string;

  /**
   * The name of the `SecurityConfiguration` structure to be used with this job.
   */
  public securityConfiguration?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to use with this job.
   */
  public tagsRaw?: any;

  /**
   * The job timeout in minutes.
   */
  public timeout?: number;

  /**
   * The type of predefined worker that is allocated when a job runs.
   */
  public workerType?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnJobProps) {
    super(scope, id, {
      "type": CfnJob.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "command", this);
    cdk.requireProperty(props, "role", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.allocatedCapacity = props.allocatedCapacity;
    this.command = props.command;
    this.connections = props.connections;
    this.defaultArguments = props.defaultArguments;
    this.description = props.description;
    this.executionClass = props.executionClass;
    this.executionProperty = props.executionProperty;
    this.glueVersion = props.glueVersion;
    this.logUri = props.logUri;
    this.maxCapacity = props.maxCapacity;
    this.maxRetries = props.maxRetries;
    this.name = props.name;
    this.nonOverridableArguments = props.nonOverridableArguments;
    this.notificationProperty = props.notificationProperty;
    this.numberOfWorkers = props.numberOfWorkers;
    this.role = props.role;
    this.securityConfiguration = props.securityConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Glue::Job", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.timeout = props.timeout;
    this.workerType = props.workerType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allocatedCapacity": this.allocatedCapacity,
      "command": this.command,
      "connections": this.connections,
      "defaultArguments": this.defaultArguments,
      "description": this.description,
      "executionClass": this.executionClass,
      "executionProperty": this.executionProperty,
      "glueVersion": this.glueVersion,
      "logUri": this.logUri,
      "maxCapacity": this.maxCapacity,
      "maxRetries": this.maxRetries,
      "name": this.name,
      "nonOverridableArguments": this.nonOverridableArguments,
      "notificationProperty": this.notificationProperty,
      "numberOfWorkers": this.numberOfWorkers,
      "role": this.role,
      "securityConfiguration": this.securityConfiguration,
      "tags": this.tags.renderTags(),
      "timeout": this.timeout,
      "workerType": this.workerType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnJob.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnJobPropsToCloudFormation(props);
  }
}

export namespace CfnJob {
  /**
   * Specifies the connections used by a job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-connectionslist.html
   */
  export interface ConnectionsListProperty {
    /**
     * A list of connections used by the job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-connectionslist.html#cfn-glue-job-connectionslist-connections
     */
    readonly connections?: Array<string>;
  }

  /**
   * Specifies configuration properties of a notification.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-notificationproperty.html
   */
  export interface NotificationPropertyProperty {
    /**
     * After a job run starts, the number of minutes to wait before sending a job run delay notification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-notificationproperty.html#cfn-glue-job-notificationproperty-notifydelayafter
     */
    readonly notifyDelayAfter?: number;
  }

  /**
   * Specifies code executed when a job is run.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-jobcommand.html
   */
  export interface JobCommandProperty {
    /**
     * The name of the job command.
     *
     * For an Apache Spark ETL job, this must be `glueetl` . For a Python shell job, it must be `pythonshell` . For an Apache Spark streaming ETL job, this must be `gluestreaming` . For a Ray job, this must be `glueray` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-jobcommand.html#cfn-glue-job-jobcommand-name
     */
    readonly name?: string;

    /**
     * The Python version being used to execute a Python shell job.
     *
     * Allowed values are 3 or 3.9. Version 2 is deprecated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-jobcommand.html#cfn-glue-job-jobcommand-pythonversion
     */
    readonly pythonVersion?: string;

    /**
     * In Ray jobs, Runtime is used to specify the versions of Ray, Python and additional libraries available in your environment.
     *
     * This field is not used in other job types. For supported runtime environment values, see [Working with Ray jobs](https://docs.aws.amazon.com/glue/latest/dg/ray-jobs-section.html) in the AWS Glue Developer Guide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-jobcommand.html#cfn-glue-job-jobcommand-runtime
     */
    readonly runtime?: string;

    /**
     * Specifies the Amazon Simple Storage Service (Amazon S3) path to a script that executes a job (required).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-jobcommand.html#cfn-glue-job-jobcommand-scriptlocation
     */
    readonly scriptLocation?: string;
  }

  /**
   * An execution property of a job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-executionproperty.html
   */
  export interface ExecutionPropertyProperty {
    /**
     * The maximum number of concurrent runs allowed for the job.
     *
     * The default is 1. An error is returned when this threshold is reached. The maximum value you can specify is controlled by a service limit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-executionproperty.html#cfn-glue-job-executionproperty-maxconcurrentruns
     */
    readonly maxConcurrentRuns?: number;
  }
}

/**
 * Properties for defining a `CfnJob`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html
 */
export interface CfnJobProps {
  /**
   * This parameter is no longer supported. Use `MaxCapacity` instead.
   *
   * The number of capacity units that are allocated to this job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-allocatedcapacity
   */
  readonly allocatedCapacity?: number;

  /**
   * The code that executes a job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-command
   */
  readonly command: cdk.IResolvable | CfnJob.JobCommandProperty;

  /**
   * The connections used for this job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-connections
   */
  readonly connections?: CfnJob.ConnectionsListProperty | cdk.IResolvable;

  /**
   * The default arguments for this job, specified as name-value pairs.
   *
   * You can specify arguments here that your own job-execution script consumes, in addition to arguments that AWS Glue itself consumes.
   *
   * For information about how to specify and consume your own job arguments, see [Calling AWS Glue APIs in Python](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-python-calling.html) in the *AWS Glue Developer Guide* .
   *
   * For information about the key-value pairs that AWS Glue consumes to set up your job, see [Special Parameters Used by AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html) in the *AWS Glue Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-defaultarguments
   */
  readonly defaultArguments?: any | cdk.IResolvable;

  /**
   * A description of the job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-description
   */
  readonly description?: string;

  /**
   * Indicates whether the job is run with a standard or flexible execution class.
   *
   * The standard execution class is ideal for time-sensitive workloads that require fast job startup and dedicated resources.
   *
   * The flexible execution class is appropriate for time-insensitive jobs whose start and completion times may vary.
   *
   * Only jobs with AWS Glue version 3.0 and above and command type `glueetl` will be allowed to set `ExecutionClass` to `FLEX` . The flexible execution class is available for Spark jobs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-executionclass
   */
  readonly executionClass?: string;

  /**
   * The maximum number of concurrent runs that are allowed for this job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-executionproperty
   */
  readonly executionProperty?: CfnJob.ExecutionPropertyProperty | cdk.IResolvable;

  /**
   * Glue version determines the versions of Apache Spark and Python that AWS Glue supports.
   *
   * The Python version indicates the version supported for jobs of type Spark.
   *
   * For more information about the available AWS Glue versions and corresponding Spark and Python versions, see [Glue version](https://docs.aws.amazon.com/glue/latest/dg/add-job.html) in the developer guide.
   *
   * Jobs that are created without specifying a Glue version default to Glue 0.9.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-glueversion
   */
  readonly glueVersion?: string;

  /**
   * This field is reserved for future use.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-loguri
   */
  readonly logUri?: string;

  /**
   * The number of AWS Glue data processing units (DPUs) that can be allocated when this job runs.
   *
   * A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory.
   *
   * Do not set `Max Capacity` if using `WorkerType` and `NumberOfWorkers` .
   *
   * The value that can be allocated for `MaxCapacity` depends on whether you are running a Python shell job or an Apache Spark ETL job:
   *
   * - When you specify a Python shell job ( `JobCommand.Name` ="pythonshell"), you can allocate either 0.0625 or 1 DPU. The default is 0.0625 DPU.
   * - When you specify an Apache Spark ETL job ( `JobCommand.Name` ="glueetl"), you can allocate from 2 to 100 DPUs. The default is 10 DPUs. This job type cannot have a fractional DPU allocation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-maxcapacity
   */
  readonly maxCapacity?: number;

  /**
   * The maximum number of times to retry this job after a JobRun fails.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-maxretries
   */
  readonly maxRetries?: number;

  /**
   * The name you assign to this job definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-name
   */
  readonly name?: string;

  /**
   * Non-overridable arguments for this job, specified as name-value pairs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-nonoverridablearguments
   */
  readonly nonOverridableArguments?: any | cdk.IResolvable;

  /**
   * Specifies configuration properties of a notification.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-notificationproperty
   */
  readonly notificationProperty?: cdk.IResolvable | CfnJob.NotificationPropertyProperty;

  /**
   * The number of workers of a defined `workerType` that are allocated when a job runs.
   *
   * The maximum number of workers you can define are 299 for `G.1X` , and 149 for `G.2X` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-numberofworkers
   */
  readonly numberOfWorkers?: number;

  /**
   * The name or Amazon Resource Name (ARN) of the IAM role associated with this job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-role
   */
  readonly role: string;

  /**
   * The name of the `SecurityConfiguration` structure to be used with this job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-securityconfiguration
   */
  readonly securityConfiguration?: string;

  /**
   * The tags to use with this job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-tags
   */
  readonly tags?: any;

  /**
   * The job timeout in minutes.
   *
   * This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-timeout
   */
  readonly timeout?: number;

  /**
   * The type of predefined worker that is allocated when a job runs.
   *
   * Accepts a value of G.1X, G.2X, G.4X, G.8X or G.025X for Spark jobs. Accepts the value Z.2X for Ray jobs.
   *
   * - For the `G.1X` worker type, each worker maps to 1 DPU (4 vCPUs, 16 GB of memory) with 84GB disk (approximately 34GB free), and provides 1 executor per worker. We recommend this worker type for workloads such as data transforms, joins, and queries, to offers a scalable and cost effective way to run most jobs.
   * - For the `G.2X` worker type, each worker maps to 2 DPU (8 vCPUs, 32 GB of memory) with 128GB disk (approximately 77GB free), and provides 1 executor per worker. We recommend this worker type for workloads such as data transforms, joins, and queries, to offers a scalable and cost effective way to run most jobs.
   * - For the `G.4X` worker type, each worker maps to 4 DPU (16 vCPUs, 64 GB of memory) with 256GB disk (approximately 235GB free), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for AWS Glue version 3.0 or later Spark ETL jobs in the following AWS Regions: US East (Ohio), US East (N. Virginia), US West (Oregon), Asia Pacific (Singapore), Asia Pacific (Sydney), Asia Pacific (Tokyo), Canada (Central), Europe (Frankfurt), Europe (Ireland), and Europe (Stockholm).
   * - For the `G.8X` worker type, each worker maps to 8 DPU (32 vCPUs, 128 GB of memory) with 512GB disk (approximately 487GB free), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for AWS Glue version 3.0 or later Spark ETL jobs, in the same AWS Regions as supported for the `G.4X` worker type.
   * - For the `G.025X` worker type, each worker maps to 0.25 DPU (2 vCPUs, 4 GB of memory) with 84GB disk (approximately 34GB free), and provides 1 executor per worker. We recommend this worker type for low volume streaming jobs. This worker type is only available for AWS Glue version 3.0 streaming jobs.
   * - For the `Z.2X` worker type, each worker maps to 2 M-DPU (8vCPUs, 64 GB of memory) with 128 GB disk (approximately 120GB free), and provides up to 8 Ray workers based on the autoscaler.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-workertype
   */
  readonly workerType?: string;
}

/**
 * Determine whether the given properties match those of a `ConnectionsListProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectionsListProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobConnectionsListPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connections", cdk.listValidator(cdk.validateString))(properties.connections));
  return errors.wrap("supplied properties not correct for \"ConnectionsListProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobConnectionsListPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobConnectionsListPropertyValidator(properties).assertSuccess();
  return {
    "Connections": cdk.listMapper(cdk.stringToCloudFormation)(properties.connections)
  };
}

// @ts-ignore TS6133
function CfnJobConnectionsListPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJob.ConnectionsListProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.ConnectionsListProperty>();
  ret.addPropertyResult("connections", "Connections", (properties.Connections != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Connections) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotificationPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationPropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobNotificationPropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("notifyDelayAfter", cdk.validateNumber)(properties.notifyDelayAfter));
  return errors.wrap("supplied properties not correct for \"NotificationPropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobNotificationPropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobNotificationPropertyPropertyValidator(properties).assertSuccess();
  return {
    "NotifyDelayAfter": cdk.numberToCloudFormation(properties.notifyDelayAfter)
  };
}

// @ts-ignore TS6133
function CfnJobNotificationPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJob.NotificationPropertyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.NotificationPropertyProperty>();
  ret.addPropertyResult("notifyDelayAfter", "NotifyDelayAfter", (properties.NotifyDelayAfter != null ? cfn_parse.FromCloudFormation.getNumber(properties.NotifyDelayAfter) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JobCommandProperty`
 *
 * @param properties - the TypeScript properties of a `JobCommandProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobJobCommandPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("pythonVersion", cdk.validateString)(properties.pythonVersion));
  errors.collect(cdk.propertyValidator("runtime", cdk.validateString)(properties.runtime));
  errors.collect(cdk.propertyValidator("scriptLocation", cdk.validateString)(properties.scriptLocation));
  return errors.wrap("supplied properties not correct for \"JobCommandProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobJobCommandPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobJobCommandPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "PythonVersion": cdk.stringToCloudFormation(properties.pythonVersion),
    "Runtime": cdk.stringToCloudFormation(properties.runtime),
    "ScriptLocation": cdk.stringToCloudFormation(properties.scriptLocation)
  };
}

// @ts-ignore TS6133
function CfnJobJobCommandPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJob.JobCommandProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.JobCommandProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("pythonVersion", "PythonVersion", (properties.PythonVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PythonVersion) : undefined));
  ret.addPropertyResult("runtime", "Runtime", (properties.Runtime != null ? cfn_parse.FromCloudFormation.getString(properties.Runtime) : undefined));
  ret.addPropertyResult("scriptLocation", "ScriptLocation", (properties.ScriptLocation != null ? cfn_parse.FromCloudFormation.getString(properties.ScriptLocation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExecutionPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `ExecutionPropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobExecutionPropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxConcurrentRuns", cdk.validateNumber)(properties.maxConcurrentRuns));
  return errors.wrap("supplied properties not correct for \"ExecutionPropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobExecutionPropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobExecutionPropertyPropertyValidator(properties).assertSuccess();
  return {
    "MaxConcurrentRuns": cdk.numberToCloudFormation(properties.maxConcurrentRuns)
  };
}

// @ts-ignore TS6133
function CfnJobExecutionPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJob.ExecutionPropertyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.ExecutionPropertyProperty>();
  ret.addPropertyResult("maxConcurrentRuns", "MaxConcurrentRuns", (properties.MaxConcurrentRuns != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxConcurrentRuns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnJobProps`
 *
 * @param properties - the TypeScript properties of a `CfnJobProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allocatedCapacity", cdk.validateNumber)(properties.allocatedCapacity));
  errors.collect(cdk.propertyValidator("command", cdk.requiredValidator)(properties.command));
  errors.collect(cdk.propertyValidator("command", CfnJobJobCommandPropertyValidator)(properties.command));
  errors.collect(cdk.propertyValidator("connections", CfnJobConnectionsListPropertyValidator)(properties.connections));
  errors.collect(cdk.propertyValidator("defaultArguments", cdk.validateObject)(properties.defaultArguments));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("executionClass", cdk.validateString)(properties.executionClass));
  errors.collect(cdk.propertyValidator("executionProperty", CfnJobExecutionPropertyPropertyValidator)(properties.executionProperty));
  errors.collect(cdk.propertyValidator("glueVersion", cdk.validateString)(properties.glueVersion));
  errors.collect(cdk.propertyValidator("logUri", cdk.validateString)(properties.logUri));
  errors.collect(cdk.propertyValidator("maxCapacity", cdk.validateNumber)(properties.maxCapacity));
  errors.collect(cdk.propertyValidator("maxRetries", cdk.validateNumber)(properties.maxRetries));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("nonOverridableArguments", cdk.validateObject)(properties.nonOverridableArguments));
  errors.collect(cdk.propertyValidator("notificationProperty", CfnJobNotificationPropertyPropertyValidator)(properties.notificationProperty));
  errors.collect(cdk.propertyValidator("numberOfWorkers", cdk.validateNumber)(properties.numberOfWorkers));
  errors.collect(cdk.propertyValidator("role", cdk.requiredValidator)(properties.role));
  errors.collect(cdk.propertyValidator("role", cdk.validateString)(properties.role));
  errors.collect(cdk.propertyValidator("securityConfiguration", cdk.validateString)(properties.securityConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator("timeout", cdk.validateNumber)(properties.timeout));
  errors.collect(cdk.propertyValidator("workerType", cdk.validateString)(properties.workerType));
  return errors.wrap("supplied properties not correct for \"CfnJobProps\"");
}

// @ts-ignore TS6133
function convertCfnJobPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobPropsValidator(properties).assertSuccess();
  return {
    "AllocatedCapacity": cdk.numberToCloudFormation(properties.allocatedCapacity),
    "Command": convertCfnJobJobCommandPropertyToCloudFormation(properties.command),
    "Connections": convertCfnJobConnectionsListPropertyToCloudFormation(properties.connections),
    "DefaultArguments": cdk.objectToCloudFormation(properties.defaultArguments),
    "Description": cdk.stringToCloudFormation(properties.description),
    "ExecutionClass": cdk.stringToCloudFormation(properties.executionClass),
    "ExecutionProperty": convertCfnJobExecutionPropertyPropertyToCloudFormation(properties.executionProperty),
    "GlueVersion": cdk.stringToCloudFormation(properties.glueVersion),
    "LogUri": cdk.stringToCloudFormation(properties.logUri),
    "MaxCapacity": cdk.numberToCloudFormation(properties.maxCapacity),
    "MaxRetries": cdk.numberToCloudFormation(properties.maxRetries),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NonOverridableArguments": cdk.objectToCloudFormation(properties.nonOverridableArguments),
    "NotificationProperty": convertCfnJobNotificationPropertyPropertyToCloudFormation(properties.notificationProperty),
    "NumberOfWorkers": cdk.numberToCloudFormation(properties.numberOfWorkers),
    "Role": cdk.stringToCloudFormation(properties.role),
    "SecurityConfiguration": cdk.stringToCloudFormation(properties.securityConfiguration),
    "Tags": cdk.objectToCloudFormation(properties.tags),
    "Timeout": cdk.numberToCloudFormation(properties.timeout),
    "WorkerType": cdk.stringToCloudFormation(properties.workerType)
  };
}

// @ts-ignore TS6133
function CfnJobPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobProps>();
  ret.addPropertyResult("allocatedCapacity", "AllocatedCapacity", (properties.AllocatedCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.AllocatedCapacity) : undefined));
  ret.addPropertyResult("command", "Command", (properties.Command != null ? CfnJobJobCommandPropertyFromCloudFormation(properties.Command) : undefined));
  ret.addPropertyResult("connections", "Connections", (properties.Connections != null ? CfnJobConnectionsListPropertyFromCloudFormation(properties.Connections) : undefined));
  ret.addPropertyResult("defaultArguments", "DefaultArguments", (properties.DefaultArguments != null ? cfn_parse.FromCloudFormation.getAny(properties.DefaultArguments) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("executionClass", "ExecutionClass", (properties.ExecutionClass != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionClass) : undefined));
  ret.addPropertyResult("executionProperty", "ExecutionProperty", (properties.ExecutionProperty != null ? CfnJobExecutionPropertyPropertyFromCloudFormation(properties.ExecutionProperty) : undefined));
  ret.addPropertyResult("glueVersion", "GlueVersion", (properties.GlueVersion != null ? cfn_parse.FromCloudFormation.getString(properties.GlueVersion) : undefined));
  ret.addPropertyResult("logUri", "LogUri", (properties.LogUri != null ? cfn_parse.FromCloudFormation.getString(properties.LogUri) : undefined));
  ret.addPropertyResult("maxCapacity", "MaxCapacity", (properties.MaxCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity) : undefined));
  ret.addPropertyResult("maxRetries", "MaxRetries", (properties.MaxRetries != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxRetries) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("nonOverridableArguments", "NonOverridableArguments", (properties.NonOverridableArguments != null ? cfn_parse.FromCloudFormation.getAny(properties.NonOverridableArguments) : undefined));
  ret.addPropertyResult("notificationProperty", "NotificationProperty", (properties.NotificationProperty != null ? CfnJobNotificationPropertyPropertyFromCloudFormation(properties.NotificationProperty) : undefined));
  ret.addPropertyResult("numberOfWorkers", "NumberOfWorkers", (properties.NumberOfWorkers != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfWorkers) : undefined));
  ret.addPropertyResult("role", "Role", (properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined));
  ret.addPropertyResult("securityConfiguration", "SecurityConfiguration", (properties.SecurityConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.Timeout) : undefined));
  ret.addPropertyResult("workerType", "WorkerType", (properties.WorkerType != null ? cfn_parse.FromCloudFormation.getString(properties.WorkerType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::Glue::MLTransform is an AWS Glue resource type that manages machine learning transforms.
 *
 * @cloudformationResource AWS::Glue::MLTransform
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html
 */
export class CfnMLTransform extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::MLTransform";

  /**
   * Build a CfnMLTransform from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMLTransform {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMLTransformPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMLTransform(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A user-defined, long-form description text for the machine learning transform.
   */
  public description?: string;

  /**
   * This value determines which version of AWS Glue this machine learning transform is compatible with.
   */
  public glueVersion?: string;

  /**
   * A list of AWS Glue table definitions used by the transform.
   */
  public inputRecordTables: CfnMLTransform.InputRecordTablesProperty | cdk.IResolvable;

  /**
   * The number of AWS Glue data processing units (DPUs) that are allocated to task runs for this transform.
   */
  public maxCapacity?: number;

  /**
   * The maximum number of times to retry after an `MLTaskRun` of the machine learning transform fails.
   */
  public maxRetries?: number;

  /**
   * A user-defined name for the machine learning transform. Names are required to be unique. `Name` is optional:.
   */
  public name?: string;

  /**
   * The number of workers of a defined `workerType` that are allocated when a task of the transform runs.
   */
  public numberOfWorkers?: number;

  /**
   * The name or Amazon Resource Name (ARN) of the IAM role with the required permissions.
   */
  public role: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to use with this machine learning transform.
   */
  public tagsRaw?: any;

  /**
   * The timeout in minutes of the machine learning transform.
   */
  public timeout?: number;

  /**
   * The encryption-at-rest settings of the transform that apply to accessing user data.
   */
  public transformEncryption?: cdk.IResolvable | CfnMLTransform.TransformEncryptionProperty;

  /**
   * The algorithm-specific parameters that are associated with the machine learning transform.
   */
  public transformParameters: cdk.IResolvable | CfnMLTransform.TransformParametersProperty;

  /**
   * The type of predefined worker that is allocated when a task of this transform runs.
   */
  public workerType?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMLTransformProps) {
    super(scope, id, {
      "type": CfnMLTransform.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "inputRecordTables", this);
    cdk.requireProperty(props, "role", this);
    cdk.requireProperty(props, "transformParameters", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.glueVersion = props.glueVersion;
    this.inputRecordTables = props.inputRecordTables;
    this.maxCapacity = props.maxCapacity;
    this.maxRetries = props.maxRetries;
    this.name = props.name;
    this.numberOfWorkers = props.numberOfWorkers;
    this.role = props.role;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Glue::MLTransform", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.timeout = props.timeout;
    this.transformEncryption = props.transformEncryption;
    this.transformParameters = props.transformParameters;
    this.workerType = props.workerType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "glueVersion": this.glueVersion,
      "inputRecordTables": this.inputRecordTables,
      "maxCapacity": this.maxCapacity,
      "maxRetries": this.maxRetries,
      "name": this.name,
      "numberOfWorkers": this.numberOfWorkers,
      "role": this.role,
      "tags": this.tags.renderTags(),
      "timeout": this.timeout,
      "transformEncryption": this.transformEncryption,
      "transformParameters": this.transformParameters,
      "workerType": this.workerType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMLTransform.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMLTransformPropsToCloudFormation(props);
  }
}

export namespace CfnMLTransform {
  /**
   * The encryption-at-rest settings of the transform that apply to accessing user data.
   *
   * Machine learning
   * transforms can access user data encrypted in Amazon S3 using KMS.
   *
   * Additionally, imported labels and trained transforms can now be encrypted using a customer provided
   * KMS key.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-transformencryption.html
   */
  export interface TransformEncryptionProperty {
    /**
     * The encryption-at-rest settings of the transform that apply to accessing user data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-transformencryption.html#cfn-glue-mltransform-transformencryption-mluserdataencryption
     */
    readonly mlUserDataEncryption?: cdk.IResolvable | CfnMLTransform.MLUserDataEncryptionProperty;

    /**
     * The name of the security configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-transformencryption.html#cfn-glue-mltransform-transformencryption-taskrunsecurityconfigurationname
     */
    readonly taskRunSecurityConfigurationName?: string;
  }

  /**
   * The encryption-at-rest settings of the transform that apply to accessing user data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-mluserdataencryption.html
   */
  export interface MLUserDataEncryptionProperty {
    /**
     * The ID for the customer-provided KMS key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-mluserdataencryption.html#cfn-glue-mltransform-mluserdataencryption-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * The encryption mode applied to user data. Valid values are:.
     *
     * - DISABLED: encryption is disabled.
     * - SSEKMS: use of server-side encryption with AWS Key Management Service (SSE-KMS) for user data
     * stored in Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-mluserdataencryption.html#cfn-glue-mltransform-mluserdataencryption-mluserdataencryptionmode
     */
    readonly mlUserDataEncryptionMode: string;
  }

  /**
   * The algorithm-specific parameters that are associated with the machine learning transform.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-transformparameters.html
   */
  export interface TransformParametersProperty {
    /**
     * The parameters for the find matches algorithm.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-transformparameters.html#cfn-glue-mltransform-transformparameters-findmatchesparameters
     */
    readonly findMatchesParameters?: CfnMLTransform.FindMatchesParametersProperty | cdk.IResolvable;

    /**
     * The type of machine learning transform. `FIND_MATCHES` is the only option.
     *
     * For information about the types of machine learning transforms, see [Creating Machine Learning Transforms](https://docs.aws.amazon.com/glue/latest/dg/add-job-machine-learning-transform.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-transformparameters.html#cfn-glue-mltransform-transformparameters-transformtype
     */
    readonly transformType: string;
  }

  /**
   * The parameters to configure the find matches transform.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-findmatchesparameters.html
   */
  export interface FindMatchesParametersProperty {
    /**
     * The value that is selected when tuning your transform for a balance between accuracy and cost.
     *
     * A value of 0.5 means that the system balances accuracy and cost concerns. A value of 1.0 means a bias purely for accuracy, which typically results in a higher cost, sometimes substantially higher. A value of 0.0 means a bias purely for cost, which results in a less accurate `FindMatches` transform, sometimes with unacceptable accuracy.
     *
     * Accuracy measures how well the transform finds true positives and true negatives. Increasing accuracy requires more machine resources and cost. But it also results in increased recall.
     *
     * Cost measures how many compute resources, and thus money, are consumed to run the transform.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-findmatchesparameters.html#cfn-glue-mltransform-findmatchesparameters-accuracycosttradeoff
     */
    readonly accuracyCostTradeoff?: number;

    /**
     * The value to switch on or off to force the output to match the provided labels from users.
     *
     * If the value is `True` , the `find matches` transform forces the output to match the provided labels. The results override the normal conflation results. If the value is `False` , the `find matches` transform does not ensure all the labels provided are respected, and the results rely on the trained model.
     *
     * Note that setting this value to true may increase the conflation execution time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-findmatchesparameters.html#cfn-glue-mltransform-findmatchesparameters-enforceprovidedlabels
     */
    readonly enforceProvidedLabels?: boolean | cdk.IResolvable;

    /**
     * The value selected when tuning your transform for a balance between precision and recall.
     *
     * A value of 0.5 means no preference; a value of 1.0 means a bias purely for precision, and a value of 0.0 means a bias for recall. Because this is a tradeoff, choosing values close to 1.0 means very low recall, and choosing values close to 0.0 results in very low precision.
     *
     * The precision metric indicates how often your model is correct when it predicts a match.
     *
     * The recall metric indicates that for an actual match, how often your model predicts the match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-findmatchesparameters.html#cfn-glue-mltransform-findmatchesparameters-precisionrecalltradeoff
     */
    readonly precisionRecallTradeoff?: number;

    /**
     * The name of a column that uniquely identifies rows in the source table.
     *
     * Used to help identify matching records.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-findmatchesparameters.html#cfn-glue-mltransform-findmatchesparameters-primarykeycolumnname
     */
    readonly primaryKeyColumnName: string;
  }

  /**
   * A list of AWS Glue table definitions used by the transform.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-inputrecordtables.html
   */
  export interface InputRecordTablesProperty {
    /**
     * The database and table in the AWS Glue Data Catalog that is used for input or output data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-inputrecordtables.html#cfn-glue-mltransform-inputrecordtables-gluetables
     */
    readonly glueTables?: Array<CfnMLTransform.GlueTablesProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The database and table in the AWS Glue Data Catalog that is used for input or output data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-gluetables.html
   */
  export interface GlueTablesProperty {
    /**
     * A unique identifier for the AWS Glue Data Catalog .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-gluetables.html#cfn-glue-mltransform-gluetables-catalogid
     */
    readonly catalogId?: string;

    /**
     * The name of the connection to the AWS Glue Data Catalog .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-gluetables.html#cfn-glue-mltransform-gluetables-connectionname
     */
    readonly connectionName?: string;

    /**
     * A database name in the AWS Glue Data Catalog .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-gluetables.html#cfn-glue-mltransform-gluetables-databasename
     */
    readonly databaseName: string;

    /**
     * A table name in the AWS Glue Data Catalog .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-mltransform-gluetables.html#cfn-glue-mltransform-gluetables-tablename
     */
    readonly tableName: string;
  }
}

/**
 * Properties for defining a `CfnMLTransform`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html
 */
export interface CfnMLTransformProps {
  /**
   * A user-defined, long-form description text for the machine learning transform.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html#cfn-glue-mltransform-description
   */
  readonly description?: string;

  /**
   * This value determines which version of AWS Glue this machine learning transform is compatible with.
   *
   * Glue 1.0 is recommended for most customers. If the value is not set, the Glue compatibility defaults to Glue 0.9. For more information, see [AWS Glue Versions](https://docs.aws.amazon.com/glue/latest/dg/release-notes.html#release-notes-versions) in the developer guide.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html#cfn-glue-mltransform-glueversion
   */
  readonly glueVersion?: string;

  /**
   * A list of AWS Glue table definitions used by the transform.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html#cfn-glue-mltransform-inputrecordtables
   */
  readonly inputRecordTables: CfnMLTransform.InputRecordTablesProperty | cdk.IResolvable;

  /**
   * The number of AWS Glue data processing units (DPUs) that are allocated to task runs for this transform.
   *
   * You can allocate from 2 to 100 DPUs; the default is 10. A DPU is a relative measure of processing power that consists of 4 vCPUs of compute capacity and 16 GB of memory. For more information, see the [AWS Glue pricing page](https://docs.aws.amazon.com/glue/pricing/) .
   *
   * `MaxCapacity` is a mutually exclusive option with `NumberOfWorkers` and `WorkerType` .
   *
   * - If either `NumberOfWorkers` or `WorkerType` is set, then `MaxCapacity` cannot be set.
   * - If `MaxCapacity` is set then neither `NumberOfWorkers` or `WorkerType` can be set.
   * - If `WorkerType` is set, then `NumberOfWorkers` is required (and vice versa).
   * - `MaxCapacity` and `NumberOfWorkers` must both be at least 1.
   *
   * When the `WorkerType` field is set to a value other than `Standard` , the `MaxCapacity` field is set automatically and becomes read-only.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html#cfn-glue-mltransform-maxcapacity
   */
  readonly maxCapacity?: number;

  /**
   * The maximum number of times to retry after an `MLTaskRun` of the machine learning transform fails.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html#cfn-glue-mltransform-maxretries
   */
  readonly maxRetries?: number;

  /**
   * A user-defined name for the machine learning transform. Names are required to be unique. `Name` is optional:.
   *
   * - If you supply `Name` , the stack cannot be repeatedly created.
   * - If `Name` is not provided, a randomly generated name will be used instead.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html#cfn-glue-mltransform-name
   */
  readonly name?: string;

  /**
   * The number of workers of a defined `workerType` that are allocated when a task of the transform runs.
   *
   * If `WorkerType` is set, then `NumberOfWorkers` is required (and vice versa).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html#cfn-glue-mltransform-numberofworkers
   */
  readonly numberOfWorkers?: number;

  /**
   * The name or Amazon Resource Name (ARN) of the IAM role with the required permissions.
   *
   * The required permissions include both AWS Glue service role permissions to AWS Glue resources, and Amazon S3 permissions required by the transform.
   *
   * - This role needs AWS Glue service role permissions to allow access to resources in AWS Glue . See [Attach a Policy to IAM Users That Access AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/attach-policy-iam-user.html) .
   * - This role needs permission to your Amazon Simple Storage Service (Amazon S3) sources, targets, temporary directory, scripts, and any libraries used by the task run for this transform.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html#cfn-glue-mltransform-role
   */
  readonly role: string;

  /**
   * The tags to use with this machine learning transform.
   *
   * You may use tags to limit access to the machine learning transform. For more information about tags in AWS Glue , see [AWS Tags in AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/monitor-tags.html) in the developer guide.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html#cfn-glue-mltransform-tags
   */
  readonly tags?: any;

  /**
   * The timeout in minutes of the machine learning transform.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html#cfn-glue-mltransform-timeout
   */
  readonly timeout?: number;

  /**
   * The encryption-at-rest settings of the transform that apply to accessing user data.
   *
   * Machine learning
   * transforms can access user data encrypted in Amazon S3 using KMS.
   *
   * Additionally, imported labels and trained transforms can now be encrypted using a customer provided
   * KMS key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html#cfn-glue-mltransform-transformencryption
   */
  readonly transformEncryption?: cdk.IResolvable | CfnMLTransform.TransformEncryptionProperty;

  /**
   * The algorithm-specific parameters that are associated with the machine learning transform.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html#cfn-glue-mltransform-transformparameters
   */
  readonly transformParameters: cdk.IResolvable | CfnMLTransform.TransformParametersProperty;

  /**
   * The type of predefined worker that is allocated when a task of this transform runs.
   *
   * Accepts a value of Standard, G.1X, or G.2X.
   *
   * - For the `Standard` worker type, each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.
   * - For the `G.1X` worker type, each worker provides 4 vCPU, 16 GB of memory and a 64GB disk, and 1 executor per worker.
   * - For the `G.2X` worker type, each worker provides 8 vCPU, 32 GB of memory and a 128GB disk, and 1 executor per worker.
   *
   * `MaxCapacity` is a mutually exclusive option with `NumberOfWorkers` and `WorkerType` .
   *
   * - If either `NumberOfWorkers` or `WorkerType` is set, then `MaxCapacity` cannot be set.
   * - If `MaxCapacity` is set then neither `NumberOfWorkers` or `WorkerType` can be set.
   * - If `WorkerType` is set, then `NumberOfWorkers` is required (and vice versa).
   * - `MaxCapacity` and `NumberOfWorkers` must both be at least 1.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-mltransform.html#cfn-glue-mltransform-workertype
   */
  readonly workerType?: string;
}

/**
 * Determine whether the given properties match those of a `MLUserDataEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `MLUserDataEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMLTransformMLUserDataEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("mlUserDataEncryptionMode", cdk.requiredValidator)(properties.mlUserDataEncryptionMode));
  errors.collect(cdk.propertyValidator("mlUserDataEncryptionMode", cdk.validateString)(properties.mlUserDataEncryptionMode));
  return errors.wrap("supplied properties not correct for \"MLUserDataEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnMLTransformMLUserDataEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMLTransformMLUserDataEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "MLUserDataEncryptionMode": cdk.stringToCloudFormation(properties.mlUserDataEncryptionMode)
  };
}

// @ts-ignore TS6133
function CfnMLTransformMLUserDataEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMLTransform.MLUserDataEncryptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMLTransform.MLUserDataEncryptionProperty>();
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("mlUserDataEncryptionMode", "MLUserDataEncryptionMode", (properties.MLUserDataEncryptionMode != null ? cfn_parse.FromCloudFormation.getString(properties.MLUserDataEncryptionMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TransformEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `TransformEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMLTransformTransformEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mlUserDataEncryption", CfnMLTransformMLUserDataEncryptionPropertyValidator)(properties.mlUserDataEncryption));
  errors.collect(cdk.propertyValidator("taskRunSecurityConfigurationName", cdk.validateString)(properties.taskRunSecurityConfigurationName));
  return errors.wrap("supplied properties not correct for \"TransformEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnMLTransformTransformEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMLTransformTransformEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "MLUserDataEncryption": convertCfnMLTransformMLUserDataEncryptionPropertyToCloudFormation(properties.mlUserDataEncryption),
    "TaskRunSecurityConfigurationName": cdk.stringToCloudFormation(properties.taskRunSecurityConfigurationName)
  };
}

// @ts-ignore TS6133
function CfnMLTransformTransformEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMLTransform.TransformEncryptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMLTransform.TransformEncryptionProperty>();
  ret.addPropertyResult("mlUserDataEncryption", "MLUserDataEncryption", (properties.MLUserDataEncryption != null ? CfnMLTransformMLUserDataEncryptionPropertyFromCloudFormation(properties.MLUserDataEncryption) : undefined));
  ret.addPropertyResult("taskRunSecurityConfigurationName", "TaskRunSecurityConfigurationName", (properties.TaskRunSecurityConfigurationName != null ? cfn_parse.FromCloudFormation.getString(properties.TaskRunSecurityConfigurationName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FindMatchesParametersProperty`
 *
 * @param properties - the TypeScript properties of a `FindMatchesParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMLTransformFindMatchesParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accuracyCostTradeoff", cdk.validateNumber)(properties.accuracyCostTradeoff));
  errors.collect(cdk.propertyValidator("enforceProvidedLabels", cdk.validateBoolean)(properties.enforceProvidedLabels));
  errors.collect(cdk.propertyValidator("precisionRecallTradeoff", cdk.validateNumber)(properties.precisionRecallTradeoff));
  errors.collect(cdk.propertyValidator("primaryKeyColumnName", cdk.requiredValidator)(properties.primaryKeyColumnName));
  errors.collect(cdk.propertyValidator("primaryKeyColumnName", cdk.validateString)(properties.primaryKeyColumnName));
  return errors.wrap("supplied properties not correct for \"FindMatchesParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnMLTransformFindMatchesParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMLTransformFindMatchesParametersPropertyValidator(properties).assertSuccess();
  return {
    "AccuracyCostTradeoff": cdk.numberToCloudFormation(properties.accuracyCostTradeoff),
    "EnforceProvidedLabels": cdk.booleanToCloudFormation(properties.enforceProvidedLabels),
    "PrecisionRecallTradeoff": cdk.numberToCloudFormation(properties.precisionRecallTradeoff),
    "PrimaryKeyColumnName": cdk.stringToCloudFormation(properties.primaryKeyColumnName)
  };
}

// @ts-ignore TS6133
function CfnMLTransformFindMatchesParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMLTransform.FindMatchesParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMLTransform.FindMatchesParametersProperty>();
  ret.addPropertyResult("accuracyCostTradeoff", "AccuracyCostTradeoff", (properties.AccuracyCostTradeoff != null ? cfn_parse.FromCloudFormation.getNumber(properties.AccuracyCostTradeoff) : undefined));
  ret.addPropertyResult("enforceProvidedLabels", "EnforceProvidedLabels", (properties.EnforceProvidedLabels != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnforceProvidedLabels) : undefined));
  ret.addPropertyResult("precisionRecallTradeoff", "PrecisionRecallTradeoff", (properties.PrecisionRecallTradeoff != null ? cfn_parse.FromCloudFormation.getNumber(properties.PrecisionRecallTradeoff) : undefined));
  ret.addPropertyResult("primaryKeyColumnName", "PrimaryKeyColumnName", (properties.PrimaryKeyColumnName != null ? cfn_parse.FromCloudFormation.getString(properties.PrimaryKeyColumnName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TransformParametersProperty`
 *
 * @param properties - the TypeScript properties of a `TransformParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMLTransformTransformParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("findMatchesParameters", CfnMLTransformFindMatchesParametersPropertyValidator)(properties.findMatchesParameters));
  errors.collect(cdk.propertyValidator("transformType", cdk.requiredValidator)(properties.transformType));
  errors.collect(cdk.propertyValidator("transformType", cdk.validateString)(properties.transformType));
  return errors.wrap("supplied properties not correct for \"TransformParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnMLTransformTransformParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMLTransformTransformParametersPropertyValidator(properties).assertSuccess();
  return {
    "FindMatchesParameters": convertCfnMLTransformFindMatchesParametersPropertyToCloudFormation(properties.findMatchesParameters),
    "TransformType": cdk.stringToCloudFormation(properties.transformType)
  };
}

// @ts-ignore TS6133
function CfnMLTransformTransformParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMLTransform.TransformParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMLTransform.TransformParametersProperty>();
  ret.addPropertyResult("findMatchesParameters", "FindMatchesParameters", (properties.FindMatchesParameters != null ? CfnMLTransformFindMatchesParametersPropertyFromCloudFormation(properties.FindMatchesParameters) : undefined));
  ret.addPropertyResult("transformType", "TransformType", (properties.TransformType != null ? cfn_parse.FromCloudFormation.getString(properties.TransformType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GlueTablesProperty`
 *
 * @param properties - the TypeScript properties of a `GlueTablesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMLTransformGlueTablesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("connectionName", cdk.validateString)(properties.connectionName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"GlueTablesProperty\"");
}

// @ts-ignore TS6133
function convertCfnMLTransformGlueTablesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMLTransformGlueTablesPropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "ConnectionName": cdk.stringToCloudFormation(properties.connectionName),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnMLTransformGlueTablesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMLTransform.GlueTablesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMLTransform.GlueTablesProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("connectionName", "ConnectionName", (properties.ConnectionName != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionName) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InputRecordTablesProperty`
 *
 * @param properties - the TypeScript properties of a `InputRecordTablesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMLTransformInputRecordTablesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("glueTables", cdk.listValidator(CfnMLTransformGlueTablesPropertyValidator))(properties.glueTables));
  return errors.wrap("supplied properties not correct for \"InputRecordTablesProperty\"");
}

// @ts-ignore TS6133
function convertCfnMLTransformInputRecordTablesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMLTransformInputRecordTablesPropertyValidator(properties).assertSuccess();
  return {
    "GlueTables": cdk.listMapper(convertCfnMLTransformGlueTablesPropertyToCloudFormation)(properties.glueTables)
  };
}

// @ts-ignore TS6133
function CfnMLTransformInputRecordTablesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMLTransform.InputRecordTablesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMLTransform.InputRecordTablesProperty>();
  ret.addPropertyResult("glueTables", "GlueTables", (properties.GlueTables != null ? cfn_parse.FromCloudFormation.getArray(CfnMLTransformGlueTablesPropertyFromCloudFormation)(properties.GlueTables) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMLTransformProps`
 *
 * @param properties - the TypeScript properties of a `CfnMLTransformProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMLTransformPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("glueVersion", cdk.validateString)(properties.glueVersion));
  errors.collect(cdk.propertyValidator("inputRecordTables", cdk.requiredValidator)(properties.inputRecordTables));
  errors.collect(cdk.propertyValidator("inputRecordTables", CfnMLTransformInputRecordTablesPropertyValidator)(properties.inputRecordTables));
  errors.collect(cdk.propertyValidator("maxCapacity", cdk.validateNumber)(properties.maxCapacity));
  errors.collect(cdk.propertyValidator("maxRetries", cdk.validateNumber)(properties.maxRetries));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("numberOfWorkers", cdk.validateNumber)(properties.numberOfWorkers));
  errors.collect(cdk.propertyValidator("role", cdk.requiredValidator)(properties.role));
  errors.collect(cdk.propertyValidator("role", cdk.validateString)(properties.role));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator("timeout", cdk.validateNumber)(properties.timeout));
  errors.collect(cdk.propertyValidator("transformEncryption", CfnMLTransformTransformEncryptionPropertyValidator)(properties.transformEncryption));
  errors.collect(cdk.propertyValidator("transformParameters", cdk.requiredValidator)(properties.transformParameters));
  errors.collect(cdk.propertyValidator("transformParameters", CfnMLTransformTransformParametersPropertyValidator)(properties.transformParameters));
  errors.collect(cdk.propertyValidator("workerType", cdk.validateString)(properties.workerType));
  return errors.wrap("supplied properties not correct for \"CfnMLTransformProps\"");
}

// @ts-ignore TS6133
function convertCfnMLTransformPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMLTransformPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "GlueVersion": cdk.stringToCloudFormation(properties.glueVersion),
    "InputRecordTables": convertCfnMLTransformInputRecordTablesPropertyToCloudFormation(properties.inputRecordTables),
    "MaxCapacity": cdk.numberToCloudFormation(properties.maxCapacity),
    "MaxRetries": cdk.numberToCloudFormation(properties.maxRetries),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NumberOfWorkers": cdk.numberToCloudFormation(properties.numberOfWorkers),
    "Role": cdk.stringToCloudFormation(properties.role),
    "Tags": cdk.objectToCloudFormation(properties.tags),
    "Timeout": cdk.numberToCloudFormation(properties.timeout),
    "TransformEncryption": convertCfnMLTransformTransformEncryptionPropertyToCloudFormation(properties.transformEncryption),
    "TransformParameters": convertCfnMLTransformTransformParametersPropertyToCloudFormation(properties.transformParameters),
    "WorkerType": cdk.stringToCloudFormation(properties.workerType)
  };
}

// @ts-ignore TS6133
function CfnMLTransformPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMLTransformProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMLTransformProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("glueVersion", "GlueVersion", (properties.GlueVersion != null ? cfn_parse.FromCloudFormation.getString(properties.GlueVersion) : undefined));
  ret.addPropertyResult("inputRecordTables", "InputRecordTables", (properties.InputRecordTables != null ? CfnMLTransformInputRecordTablesPropertyFromCloudFormation(properties.InputRecordTables) : undefined));
  ret.addPropertyResult("maxCapacity", "MaxCapacity", (properties.MaxCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity) : undefined));
  ret.addPropertyResult("maxRetries", "MaxRetries", (properties.MaxRetries != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxRetries) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("numberOfWorkers", "NumberOfWorkers", (properties.NumberOfWorkers != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfWorkers) : undefined));
  ret.addPropertyResult("role", "Role", (properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.Timeout) : undefined));
  ret.addPropertyResult("transformEncryption", "TransformEncryption", (properties.TransformEncryption != null ? CfnMLTransformTransformEncryptionPropertyFromCloudFormation(properties.TransformEncryption) : undefined));
  ret.addPropertyResult("transformParameters", "TransformParameters", (properties.TransformParameters != null ? CfnMLTransformTransformParametersPropertyFromCloudFormation(properties.TransformParameters) : undefined));
  ret.addPropertyResult("workerType", "WorkerType", (properties.WorkerType != null ? cfn_parse.FromCloudFormation.getString(properties.WorkerType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Glue::Partition` resource creates an AWS Glue partition, which represents a slice of table data.
 *
 * For more information, see [CreatePartition Action](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-catalog-partitions.html#aws-glue-api-catalog-partitions-CreatePartition) and [Partition Structure](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-catalog-partitions.html#aws-glue-api-catalog-partitions-Partition) in the *AWS Glue Developer Guide* .
 *
 * @cloudformationResource AWS::Glue::Partition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-partition.html
 */
export class CfnPartition extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::Partition";

  /**
   * Build a CfnPartition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPartition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPartitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPartition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The AWS account ID of the catalog in which the partion is to be created.
   */
  public catalogId: string;

  /**
   * The name of the catalog database in which to create the partition.
   */
  public databaseName: string;

  /**
   * The structure used to create and update a partition.
   */
  public partitionInput: cdk.IResolvable | CfnPartition.PartitionInputProperty;

  /**
   * The name of the metadata table in which the partition is to be created.
   */
  public tableName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPartitionProps) {
    super(scope, id, {
      "type": CfnPartition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "catalogId", this);
    cdk.requireProperty(props, "databaseName", this);
    cdk.requireProperty(props, "partitionInput", this);
    cdk.requireProperty(props, "tableName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.catalogId = props.catalogId;
    this.databaseName = props.databaseName;
    this.partitionInput = props.partitionInput;
    this.tableName = props.tableName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "catalogId": this.catalogId,
      "databaseName": this.databaseName,
      "partitionInput": this.partitionInput,
      "tableName": this.tableName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPartition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPartitionPropsToCloudFormation(props);
  }
}

export namespace CfnPartition {
  /**
   * The structure used to create and update a partition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-partitioninput.html
   */
  export interface PartitionInputProperty {
    /**
     * These key-value pairs define partition parameters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-partitioninput.html#cfn-glue-partition-partitioninput-parameters
     */
    readonly parameters?: any | cdk.IResolvable;

    /**
     * Provides information about the physical location where the partition is stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-partitioninput.html#cfn-glue-partition-partitioninput-storagedescriptor
     */
    readonly storageDescriptor?: cdk.IResolvable | CfnPartition.StorageDescriptorProperty;

    /**
     * The values of the partition.
     *
     * Although this parameter is not required by the SDK, you must specify this parameter for a valid input.
     *
     * The values for the keys for the new partition must be passed as an array of String objects that must be ordered in the same order as the partition keys appearing in the Amazon S3 prefix. Otherwise AWS Glue will add the values to the wrong keys.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-partitioninput.html#cfn-glue-partition-partitioninput-values
     */
    readonly values: Array<string>;
  }

  /**
   * Describes the physical storage of table data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html
   */
  export interface StorageDescriptorProperty {
    /**
     * A list of reducer grouping columns, clustering columns, and bucketing columns in the table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-bucketcolumns
     */
    readonly bucketColumns?: Array<string>;

    /**
     * A list of the `Columns` in the table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-columns
     */
    readonly columns?: Array<CfnPartition.ColumnProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * `True` if the data in the table is compressed, or `False` if not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-compressed
     */
    readonly compressed?: boolean | cdk.IResolvable;

    /**
     * The input format: `SequenceFileInputFormat` (binary), or `TextInputFormat` , or a custom format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-inputformat
     */
    readonly inputFormat?: string;

    /**
     * The physical location of the table.
     *
     * By default, this takes the form of the warehouse location, followed by the database location in the warehouse, followed by the table name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-location
     */
    readonly location?: string;

    /**
     * The number of buckets.
     *
     * You must specify this property if the partition contains any dimension columns.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-numberofbuckets
     */
    readonly numberOfBuckets?: number;

    /**
     * The output format: `SequenceFileOutputFormat` (binary), or `IgnoreKeyTextOutputFormat` , or a custom format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-outputformat
     */
    readonly outputFormat?: string;

    /**
     * The user-supplied properties in key-value form.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-parameters
     */
    readonly parameters?: any | cdk.IResolvable;

    /**
     * An object that references a schema stored in the AWS Glue Schema Registry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-schemareference
     */
    readonly schemaReference?: cdk.IResolvable | CfnPartition.SchemaReferenceProperty;

    /**
     * The serialization/deserialization (SerDe) information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-serdeinfo
     */
    readonly serdeInfo?: cdk.IResolvable | CfnPartition.SerdeInfoProperty;

    /**
     * The information about values that appear frequently in a column (skewed values).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-skewedinfo
     */
    readonly skewedInfo?: cdk.IResolvable | CfnPartition.SkewedInfoProperty;

    /**
     * A list specifying the sort order of each bucket in the table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-sortcolumns
     */
    readonly sortColumns?: Array<cdk.IResolvable | CfnPartition.OrderProperty> | cdk.IResolvable;

    /**
     * `True` if the table data is stored in subdirectories, or `False` if not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-storagedescriptor.html#cfn-glue-partition-storagedescriptor-storedassubdirectories
     */
    readonly storedAsSubDirectories?: boolean | cdk.IResolvable;
  }

  /**
   * A column in a `Table` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-column.html
   */
  export interface ColumnProperty {
    /**
     * A free-form text comment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-column.html#cfn-glue-partition-column-comment
     */
    readonly comment?: string;

    /**
     * The name of the `Column` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-column.html#cfn-glue-partition-column-name
     */
    readonly name: string;

    /**
     * The data type of the `Column` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-column.html#cfn-glue-partition-column-type
     */
    readonly type?: string;
  }

  /**
   * Information about a serialization/deserialization program (SerDe) that serves as an extractor and loader.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-serdeinfo.html
   */
  export interface SerdeInfoProperty {
    /**
     * Name of the SerDe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-serdeinfo.html#cfn-glue-partition-serdeinfo-name
     */
    readonly name?: string;

    /**
     * These key-value pairs define initialization parameters for the SerDe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-serdeinfo.html#cfn-glue-partition-serdeinfo-parameters
     */
    readonly parameters?: any | cdk.IResolvable;

    /**
     * Usually the class that implements the SerDe.
     *
     * An example is `org.apache.hadoop.hive.serde2.columnar.ColumnarSerDe` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-serdeinfo.html#cfn-glue-partition-serdeinfo-serializationlibrary
     */
    readonly serializationLibrary?: string;
  }

  /**
   * Specifies the sort order of a sorted column.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-order.html
   */
  export interface OrderProperty {
    /**
     * The name of the column.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-order.html#cfn-glue-partition-order-column
     */
    readonly column: string;

    /**
     * Indicates that the column is sorted in ascending order ( `== 1` ), or in descending order ( `==0` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-order.html#cfn-glue-partition-order-sortorder
     */
    readonly sortOrder?: number;
  }

  /**
   * An object that references a schema stored in the AWS Glue Schema Registry.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-schemareference.html
   */
  export interface SchemaReferenceProperty {
    /**
     * A structure that contains schema identity fields.
     *
     * Either this or the `SchemaVersionId` has to be
     * provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-schemareference.html#cfn-glue-partition-schemareference-schemaid
     */
    readonly schemaId?: cdk.IResolvable | CfnPartition.SchemaIdProperty;

    /**
     * The unique ID assigned to a version of the schema.
     *
     * Either this or the `SchemaId` has to be provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-schemareference.html#cfn-glue-partition-schemareference-schemaversionid
     */
    readonly schemaVersionId?: string;

    /**
     * The version number of the schema.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-schemareference.html#cfn-glue-partition-schemareference-schemaversionnumber
     */
    readonly schemaVersionNumber?: number;
  }

  /**
   * A structure that contains schema identity fields.
   *
   * Either this or the `SchemaVersionId` has to be
   * provided.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-schemaid.html
   */
  export interface SchemaIdProperty {
    /**
     * The name of the schema registry that contains the schema.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-schemaid.html#cfn-glue-partition-schemaid-registryname
     */
    readonly registryName?: string;

    /**
     * The Amazon Resource Name (ARN) of the schema.
     *
     * One of `SchemaArn` or `SchemaName` has to be
     * provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-schemaid.html#cfn-glue-partition-schemaid-schemaarn
     */
    readonly schemaArn?: string;

    /**
     * The name of the schema.
     *
     * One of `SchemaArn` or `SchemaName` has to be provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-schemaid.html#cfn-glue-partition-schemaid-schemaname
     */
    readonly schemaName?: string;
  }

  /**
   * Specifies skewed values in a table.
   *
   * Skewed values are those that occur with very high frequency.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-skewedinfo.html
   */
  export interface SkewedInfoProperty {
    /**
     * A list of names of columns that contain skewed values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-skewedinfo.html#cfn-glue-partition-skewedinfo-skewedcolumnnames
     */
    readonly skewedColumnNames?: Array<string>;

    /**
     * A mapping of skewed values to the columns that contain them.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-skewedinfo.html#cfn-glue-partition-skewedinfo-skewedcolumnvaluelocationmaps
     */
    readonly skewedColumnValueLocationMaps?: any | cdk.IResolvable;

    /**
     * A list of values that appear so frequently as to be considered skewed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-partition-skewedinfo.html#cfn-glue-partition-skewedinfo-skewedcolumnvalues
     */
    readonly skewedColumnValues?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnPartition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-partition.html
 */
export interface CfnPartitionProps {
  /**
   * The AWS account ID of the catalog in which the partion is to be created.
   *
   * > To specify the account ID, you can use the `Ref` intrinsic function with the `AWS::AccountId` pseudo parameter. For example: `!Ref AWS::AccountId`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-partition.html#cfn-glue-partition-catalogid
   */
  readonly catalogId: string;

  /**
   * The name of the catalog database in which to create the partition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-partition.html#cfn-glue-partition-databasename
   */
  readonly databaseName: string;

  /**
   * The structure used to create and update a partition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-partition.html#cfn-glue-partition-partitioninput
   */
  readonly partitionInput: cdk.IResolvable | CfnPartition.PartitionInputProperty;

  /**
   * The name of the metadata table in which the partition is to be created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-partition.html#cfn-glue-partition-tablename
   */
  readonly tableName: string;
}

/**
 * Determine whether the given properties match those of a `ColumnProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPartitionColumnPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comment", cdk.validateString)(properties.comment));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ColumnProperty\"");
}

// @ts-ignore TS6133
function convertCfnPartitionColumnPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPartitionColumnPropertyValidator(properties).assertSuccess();
  return {
    "Comment": cdk.stringToCloudFormation(properties.comment),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnPartitionColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPartition.ColumnProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartition.ColumnProperty>();
  ret.addPropertyResult("comment", "Comment", (properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SerdeInfoProperty`
 *
 * @param properties - the TypeScript properties of a `SerdeInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPartitionSerdeInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("serializationLibrary", cdk.validateString)(properties.serializationLibrary));
  return errors.wrap("supplied properties not correct for \"SerdeInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnPartitionSerdeInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPartitionSerdeInfoPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "SerializationLibrary": cdk.stringToCloudFormation(properties.serializationLibrary)
  };
}

// @ts-ignore TS6133
function CfnPartitionSerdeInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPartition.SerdeInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartition.SerdeInfoProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("serializationLibrary", "SerializationLibrary", (properties.SerializationLibrary != null ? cfn_parse.FromCloudFormation.getString(properties.SerializationLibrary) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OrderProperty`
 *
 * @param properties - the TypeScript properties of a `OrderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPartitionOrderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("column", cdk.requiredValidator)(properties.column));
  errors.collect(cdk.propertyValidator("column", cdk.validateString)(properties.column));
  errors.collect(cdk.propertyValidator("sortOrder", cdk.validateNumber)(properties.sortOrder));
  return errors.wrap("supplied properties not correct for \"OrderProperty\"");
}

// @ts-ignore TS6133
function convertCfnPartitionOrderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPartitionOrderPropertyValidator(properties).assertSuccess();
  return {
    "Column": cdk.stringToCloudFormation(properties.column),
    "SortOrder": cdk.numberToCloudFormation(properties.sortOrder)
  };
}

// @ts-ignore TS6133
function CfnPartitionOrderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPartition.OrderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartition.OrderProperty>();
  ret.addPropertyResult("column", "Column", (properties.Column != null ? cfn_parse.FromCloudFormation.getString(properties.Column) : undefined));
  ret.addPropertyResult("sortOrder", "SortOrder", (properties.SortOrder != null ? cfn_parse.FromCloudFormation.getNumber(properties.SortOrder) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SchemaIdProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaIdProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPartitionSchemaIdPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("registryName", cdk.validateString)(properties.registryName));
  errors.collect(cdk.propertyValidator("schemaArn", cdk.validateString)(properties.schemaArn));
  errors.collect(cdk.propertyValidator("schemaName", cdk.validateString)(properties.schemaName));
  return errors.wrap("supplied properties not correct for \"SchemaIdProperty\"");
}

// @ts-ignore TS6133
function convertCfnPartitionSchemaIdPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPartitionSchemaIdPropertyValidator(properties).assertSuccess();
  return {
    "RegistryName": cdk.stringToCloudFormation(properties.registryName),
    "SchemaArn": cdk.stringToCloudFormation(properties.schemaArn),
    "SchemaName": cdk.stringToCloudFormation(properties.schemaName)
  };
}

// @ts-ignore TS6133
function CfnPartitionSchemaIdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPartition.SchemaIdProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartition.SchemaIdProperty>();
  ret.addPropertyResult("registryName", "RegistryName", (properties.RegistryName != null ? cfn_parse.FromCloudFormation.getString(properties.RegistryName) : undefined));
  ret.addPropertyResult("schemaArn", "SchemaArn", (properties.SchemaArn != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaArn) : undefined));
  ret.addPropertyResult("schemaName", "SchemaName", (properties.SchemaName != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SchemaReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaReferenceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPartitionSchemaReferencePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("schemaId", CfnPartitionSchemaIdPropertyValidator)(properties.schemaId));
  errors.collect(cdk.propertyValidator("schemaVersionId", cdk.validateString)(properties.schemaVersionId));
  errors.collect(cdk.propertyValidator("schemaVersionNumber", cdk.validateNumber)(properties.schemaVersionNumber));
  return errors.wrap("supplied properties not correct for \"SchemaReferenceProperty\"");
}

// @ts-ignore TS6133
function convertCfnPartitionSchemaReferencePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPartitionSchemaReferencePropertyValidator(properties).assertSuccess();
  return {
    "SchemaId": convertCfnPartitionSchemaIdPropertyToCloudFormation(properties.schemaId),
    "SchemaVersionId": cdk.stringToCloudFormation(properties.schemaVersionId),
    "SchemaVersionNumber": cdk.numberToCloudFormation(properties.schemaVersionNumber)
  };
}

// @ts-ignore TS6133
function CfnPartitionSchemaReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPartition.SchemaReferenceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartition.SchemaReferenceProperty>();
  ret.addPropertyResult("schemaId", "SchemaId", (properties.SchemaId != null ? CfnPartitionSchemaIdPropertyFromCloudFormation(properties.SchemaId) : undefined));
  ret.addPropertyResult("schemaVersionId", "SchemaVersionId", (properties.SchemaVersionId != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaVersionId) : undefined));
  ret.addPropertyResult("schemaVersionNumber", "SchemaVersionNumber", (properties.SchemaVersionNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.SchemaVersionNumber) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SkewedInfoProperty`
 *
 * @param properties - the TypeScript properties of a `SkewedInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPartitionSkewedInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("skewedColumnNames", cdk.listValidator(cdk.validateString))(properties.skewedColumnNames));
  errors.collect(cdk.propertyValidator("skewedColumnValueLocationMaps", cdk.validateObject)(properties.skewedColumnValueLocationMaps));
  errors.collect(cdk.propertyValidator("skewedColumnValues", cdk.listValidator(cdk.validateString))(properties.skewedColumnValues));
  return errors.wrap("supplied properties not correct for \"SkewedInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnPartitionSkewedInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPartitionSkewedInfoPropertyValidator(properties).assertSuccess();
  return {
    "SkewedColumnNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.skewedColumnNames),
    "SkewedColumnValueLocationMaps": cdk.objectToCloudFormation(properties.skewedColumnValueLocationMaps),
    "SkewedColumnValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.skewedColumnValues)
  };
}

// @ts-ignore TS6133
function CfnPartitionSkewedInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPartition.SkewedInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartition.SkewedInfoProperty>();
  ret.addPropertyResult("skewedColumnNames", "SkewedColumnNames", (properties.SkewedColumnNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SkewedColumnNames) : undefined));
  ret.addPropertyResult("skewedColumnValueLocationMaps", "SkewedColumnValueLocationMaps", (properties.SkewedColumnValueLocationMaps != null ? cfn_parse.FromCloudFormation.getAny(properties.SkewedColumnValueLocationMaps) : undefined));
  ret.addPropertyResult("skewedColumnValues", "SkewedColumnValues", (properties.SkewedColumnValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SkewedColumnValues) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StorageDescriptorProperty`
 *
 * @param properties - the TypeScript properties of a `StorageDescriptorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPartitionStorageDescriptorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketColumns", cdk.listValidator(cdk.validateString))(properties.bucketColumns));
  errors.collect(cdk.propertyValidator("columns", cdk.listValidator(CfnPartitionColumnPropertyValidator))(properties.columns));
  errors.collect(cdk.propertyValidator("compressed", cdk.validateBoolean)(properties.compressed));
  errors.collect(cdk.propertyValidator("inputFormat", cdk.validateString)(properties.inputFormat));
  errors.collect(cdk.propertyValidator("location", cdk.validateString)(properties.location));
  errors.collect(cdk.propertyValidator("numberOfBuckets", cdk.validateNumber)(properties.numberOfBuckets));
  errors.collect(cdk.propertyValidator("outputFormat", cdk.validateString)(properties.outputFormat));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("schemaReference", CfnPartitionSchemaReferencePropertyValidator)(properties.schemaReference));
  errors.collect(cdk.propertyValidator("serdeInfo", CfnPartitionSerdeInfoPropertyValidator)(properties.serdeInfo));
  errors.collect(cdk.propertyValidator("skewedInfo", CfnPartitionSkewedInfoPropertyValidator)(properties.skewedInfo));
  errors.collect(cdk.propertyValidator("sortColumns", cdk.listValidator(CfnPartitionOrderPropertyValidator))(properties.sortColumns));
  errors.collect(cdk.propertyValidator("storedAsSubDirectories", cdk.validateBoolean)(properties.storedAsSubDirectories));
  return errors.wrap("supplied properties not correct for \"StorageDescriptorProperty\"");
}

// @ts-ignore TS6133
function convertCfnPartitionStorageDescriptorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPartitionStorageDescriptorPropertyValidator(properties).assertSuccess();
  return {
    "BucketColumns": cdk.listMapper(cdk.stringToCloudFormation)(properties.bucketColumns),
    "Columns": cdk.listMapper(convertCfnPartitionColumnPropertyToCloudFormation)(properties.columns),
    "Compressed": cdk.booleanToCloudFormation(properties.compressed),
    "InputFormat": cdk.stringToCloudFormation(properties.inputFormat),
    "Location": cdk.stringToCloudFormation(properties.location),
    "NumberOfBuckets": cdk.numberToCloudFormation(properties.numberOfBuckets),
    "OutputFormat": cdk.stringToCloudFormation(properties.outputFormat),
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "SchemaReference": convertCfnPartitionSchemaReferencePropertyToCloudFormation(properties.schemaReference),
    "SerdeInfo": convertCfnPartitionSerdeInfoPropertyToCloudFormation(properties.serdeInfo),
    "SkewedInfo": convertCfnPartitionSkewedInfoPropertyToCloudFormation(properties.skewedInfo),
    "SortColumns": cdk.listMapper(convertCfnPartitionOrderPropertyToCloudFormation)(properties.sortColumns),
    "StoredAsSubDirectories": cdk.booleanToCloudFormation(properties.storedAsSubDirectories)
  };
}

// @ts-ignore TS6133
function CfnPartitionStorageDescriptorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPartition.StorageDescriptorProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartition.StorageDescriptorProperty>();
  ret.addPropertyResult("bucketColumns", "BucketColumns", (properties.BucketColumns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.BucketColumns) : undefined));
  ret.addPropertyResult("columns", "Columns", (properties.Columns != null ? cfn_parse.FromCloudFormation.getArray(CfnPartitionColumnPropertyFromCloudFormation)(properties.Columns) : undefined));
  ret.addPropertyResult("compressed", "Compressed", (properties.Compressed != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Compressed) : undefined));
  ret.addPropertyResult("inputFormat", "InputFormat", (properties.InputFormat != null ? cfn_parse.FromCloudFormation.getString(properties.InputFormat) : undefined));
  ret.addPropertyResult("location", "Location", (properties.Location != null ? cfn_parse.FromCloudFormation.getString(properties.Location) : undefined));
  ret.addPropertyResult("numberOfBuckets", "NumberOfBuckets", (properties.NumberOfBuckets != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfBuckets) : undefined));
  ret.addPropertyResult("outputFormat", "OutputFormat", (properties.OutputFormat != null ? cfn_parse.FromCloudFormation.getString(properties.OutputFormat) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("schemaReference", "SchemaReference", (properties.SchemaReference != null ? CfnPartitionSchemaReferencePropertyFromCloudFormation(properties.SchemaReference) : undefined));
  ret.addPropertyResult("serdeInfo", "SerdeInfo", (properties.SerdeInfo != null ? CfnPartitionSerdeInfoPropertyFromCloudFormation(properties.SerdeInfo) : undefined));
  ret.addPropertyResult("skewedInfo", "SkewedInfo", (properties.SkewedInfo != null ? CfnPartitionSkewedInfoPropertyFromCloudFormation(properties.SkewedInfo) : undefined));
  ret.addPropertyResult("sortColumns", "SortColumns", (properties.SortColumns != null ? cfn_parse.FromCloudFormation.getArray(CfnPartitionOrderPropertyFromCloudFormation)(properties.SortColumns) : undefined));
  ret.addPropertyResult("storedAsSubDirectories", "StoredAsSubDirectories", (properties.StoredAsSubDirectories != null ? cfn_parse.FromCloudFormation.getBoolean(properties.StoredAsSubDirectories) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PartitionInputProperty`
 *
 * @param properties - the TypeScript properties of a `PartitionInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPartitionPartitionInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("storageDescriptor", CfnPartitionStorageDescriptorPropertyValidator)(properties.storageDescriptor));
  errors.collect(cdk.propertyValidator("values", cdk.requiredValidator)(properties.values));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"PartitionInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnPartitionPartitionInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPartitionPartitionInputPropertyValidator(properties).assertSuccess();
  return {
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "StorageDescriptor": convertCfnPartitionStorageDescriptorPropertyToCloudFormation(properties.storageDescriptor),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnPartitionPartitionInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPartition.PartitionInputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartition.PartitionInputProperty>();
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("storageDescriptor", "StorageDescriptor", (properties.StorageDescriptor != null ? CfnPartitionStorageDescriptorPropertyFromCloudFormation(properties.StorageDescriptor) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPartitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnPartitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPartitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("partitionInput", cdk.requiredValidator)(properties.partitionInput));
  errors.collect(cdk.propertyValidator("partitionInput", CfnPartitionPartitionInputPropertyValidator)(properties.partitionInput));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"CfnPartitionProps\"");
}

// @ts-ignore TS6133
function convertCfnPartitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPartitionPropsValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "PartitionInput": convertCfnPartitionPartitionInputPropertyToCloudFormation(properties.partitionInput),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnPartitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPartitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartitionProps>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("partitionInput", "PartitionInput", (properties.PartitionInput != null ? CfnPartitionPartitionInputPropertyFromCloudFormation(properties.PartitionInput) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::Glue::Registry is an AWS Glue resource type that manages registries of schemas in the AWS Glue Schema Registry.
 *
 * @cloudformationResource AWS::Glue::Registry
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-registry.html
 */
export class CfnRegistry extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::Registry";

  /**
   * Build a CfnRegistry from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRegistry {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRegistryPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRegistry(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Amazon Resource Name for the created Registry.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A description of the registry.
   */
  public description?: string;

  /**
   * The name of the registry.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * AWS tags that contain a key value pair and may be searched by console, command line, or API.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRegistryProps) {
    super(scope, id, {
      "type": CfnRegistry.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Glue::Registry", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRegistry.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRegistryPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRegistry`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-registry.html
 */
export interface CfnRegistryProps {
  /**
   * A description of the registry.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-registry.html#cfn-glue-registry-description
   */
  readonly description?: string;

  /**
   * The name of the registry.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-registry.html#cfn-glue-registry-name
   */
  readonly name: string;

  /**
   * AWS tags that contain a key value pair and may be searched by console, command line, or API.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-registry.html#cfn-glue-registry-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnRegistryProps`
 *
 * @param properties - the TypeScript properties of a `CfnRegistryProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRegistryPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRegistryProps\"");
}

// @ts-ignore TS6133
function convertCfnRegistryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRegistryPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRegistryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRegistryProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRegistryProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Glue::Schema` is an AWS Glue resource type that manages schemas in the AWS Glue Schema Registry.
 *
 * @cloudformationResource AWS::Glue::Schema
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schema.html
 */
export class CfnSchema extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::Schema";

  /**
   * Build a CfnSchema from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSchema {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSchemaPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSchema(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the schema.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Represents the version ID associated with the initial schema version.
   *
   * @cloudformationAttribute InitialSchemaVersionId
   */
  public readonly attrInitialSchemaVersionId: string;

  /**
   * Specify the `VersionNumber` or the `IsLatest` for setting the checkpoint for the schema.
   */
  public checkpointVersion?: cdk.IResolvable | CfnSchema.SchemaVersionProperty;

  /**
   * The compatibility mode of the schema.
   */
  public compatibility: string;

  /**
   * The data format of the schema definition.
   */
  public dataFormat: string;

  /**
   * A description of the schema if specified when created.
   */
  public description?: string;

  /**
   * Name of the schema to be created of max length of 255, and may only contain letters, numbers, hyphen, underscore, dollar sign, or hash mark.
   */
  public name: string;

  /**
   * The registry where a schema is stored.
   */
  public registry?: cdk.IResolvable | CfnSchema.RegistryProperty;

  /**
   * The schema definition using the `DataFormat` setting for `SchemaName` .
   */
  public schemaDefinition: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * AWS tags that contain a key value pair and may be searched by console, command line, or API.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSchemaProps) {
    super(scope, id, {
      "type": CfnSchema.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "compatibility", this);
    cdk.requireProperty(props, "dataFormat", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "schemaDefinition", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrInitialSchemaVersionId = cdk.Token.asString(this.getAtt("InitialSchemaVersionId", cdk.ResolutionTypeHint.STRING));
    this.checkpointVersion = props.checkpointVersion;
    this.compatibility = props.compatibility;
    this.dataFormat = props.dataFormat;
    this.description = props.description;
    this.name = props.name;
    this.registry = props.registry;
    this.schemaDefinition = props.schemaDefinition;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Glue::Schema", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "checkpointVersion": this.checkpointVersion,
      "compatibility": this.compatibility,
      "dataFormat": this.dataFormat,
      "description": this.description,
      "name": this.name,
      "registry": this.registry,
      "schemaDefinition": this.schemaDefinition,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSchema.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSchemaPropsToCloudFormation(props);
  }
}

export namespace CfnSchema {
  /**
   * Specifies a registry in the AWS Glue Schema Registry.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-schema-registry.html
   */
  export interface RegistryProperty {
    /**
     * The Amazon Resource Name (ARN) of the registry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-schema-registry.html#cfn-glue-schema-registry-arn
     */
    readonly arn?: string;

    /**
     * The name of the registry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-schema-registry.html#cfn-glue-schema-registry-name
     */
    readonly name?: string;
  }

  /**
   * Specifies the version of a schema.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-schema-schemaversion.html
   */
  export interface SchemaVersionProperty {
    /**
     * Indicates if this version is the latest version of the schema.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-schema-schemaversion.html#cfn-glue-schema-schemaversion-islatest
     */
    readonly isLatest?: boolean | cdk.IResolvable;

    /**
     * The version number of the schema.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-schema-schemaversion.html#cfn-glue-schema-schemaversion-versionnumber
     */
    readonly versionNumber?: number;
  }
}

/**
 * Properties for defining a `CfnSchema`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schema.html
 */
export interface CfnSchemaProps {
  /**
   * Specify the `VersionNumber` or the `IsLatest` for setting the checkpoint for the schema.
   *
   * This is only required for updating a checkpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schema.html#cfn-glue-schema-checkpointversion
   */
  readonly checkpointVersion?: cdk.IResolvable | CfnSchema.SchemaVersionProperty;

  /**
   * The compatibility mode of the schema.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schema.html#cfn-glue-schema-compatibility
   */
  readonly compatibility: string;

  /**
   * The data format of the schema definition.
   *
   * Currently only `AVRO` is supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schema.html#cfn-glue-schema-dataformat
   */
  readonly dataFormat: string;

  /**
   * A description of the schema if specified when created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schema.html#cfn-glue-schema-description
   */
  readonly description?: string;

  /**
   * Name of the schema to be created of max length of 255, and may only contain letters, numbers, hyphen, underscore, dollar sign, or hash mark.
   *
   * No whitespace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schema.html#cfn-glue-schema-name
   */
  readonly name: string;

  /**
   * The registry where a schema is stored.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schema.html#cfn-glue-schema-registry
   */
  readonly registry?: cdk.IResolvable | CfnSchema.RegistryProperty;

  /**
   * The schema definition using the `DataFormat` setting for `SchemaName` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schema.html#cfn-glue-schema-schemadefinition
   */
  readonly schemaDefinition: string;

  /**
   * AWS tags that contain a key value pair and may be searched by console, command line, or API.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schema.html#cfn-glue-schema-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `RegistryProperty`
 *
 * @param properties - the TypeScript properties of a `RegistryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchemaRegistryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"RegistryProperty\"");
}

// @ts-ignore TS6133
function convertCfnSchemaRegistryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchemaRegistryPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnSchemaRegistryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchema.RegistryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchema.RegistryProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SchemaVersionProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaVersionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchemaSchemaVersionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isLatest", cdk.validateBoolean)(properties.isLatest));
  errors.collect(cdk.propertyValidator("versionNumber", cdk.validateNumber)(properties.versionNumber));
  return errors.wrap("supplied properties not correct for \"SchemaVersionProperty\"");
}

// @ts-ignore TS6133
function convertCfnSchemaSchemaVersionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchemaSchemaVersionPropertyValidator(properties).assertSuccess();
  return {
    "IsLatest": cdk.booleanToCloudFormation(properties.isLatest),
    "VersionNumber": cdk.numberToCloudFormation(properties.versionNumber)
  };
}

// @ts-ignore TS6133
function CfnSchemaSchemaVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchema.SchemaVersionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchema.SchemaVersionProperty>();
  ret.addPropertyResult("isLatest", "IsLatest", (properties.IsLatest != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsLatest) : undefined));
  ret.addPropertyResult("versionNumber", "VersionNumber", (properties.VersionNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.VersionNumber) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSchemaProps`
 *
 * @param properties - the TypeScript properties of a `CfnSchemaProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchemaPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("checkpointVersion", CfnSchemaSchemaVersionPropertyValidator)(properties.checkpointVersion));
  errors.collect(cdk.propertyValidator("compatibility", cdk.requiredValidator)(properties.compatibility));
  errors.collect(cdk.propertyValidator("compatibility", cdk.validateString)(properties.compatibility));
  errors.collect(cdk.propertyValidator("dataFormat", cdk.requiredValidator)(properties.dataFormat));
  errors.collect(cdk.propertyValidator("dataFormat", cdk.validateString)(properties.dataFormat));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("registry", CfnSchemaRegistryPropertyValidator)(properties.registry));
  errors.collect(cdk.propertyValidator("schemaDefinition", cdk.requiredValidator)(properties.schemaDefinition));
  errors.collect(cdk.propertyValidator("schemaDefinition", cdk.validateString)(properties.schemaDefinition));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSchemaProps\"");
}

// @ts-ignore TS6133
function convertCfnSchemaPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchemaPropsValidator(properties).assertSuccess();
  return {
    "CheckpointVersion": convertCfnSchemaSchemaVersionPropertyToCloudFormation(properties.checkpointVersion),
    "Compatibility": cdk.stringToCloudFormation(properties.compatibility),
    "DataFormat": cdk.stringToCloudFormation(properties.dataFormat),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Registry": convertCfnSchemaRegistryPropertyToCloudFormation(properties.registry),
    "SchemaDefinition": cdk.stringToCloudFormation(properties.schemaDefinition),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSchemaPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchemaProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchemaProps>();
  ret.addPropertyResult("checkpointVersion", "CheckpointVersion", (properties.CheckpointVersion != null ? CfnSchemaSchemaVersionPropertyFromCloudFormation(properties.CheckpointVersion) : undefined));
  ret.addPropertyResult("compatibility", "Compatibility", (properties.Compatibility != null ? cfn_parse.FromCloudFormation.getString(properties.Compatibility) : undefined));
  ret.addPropertyResult("dataFormat", "DataFormat", (properties.DataFormat != null ? cfn_parse.FromCloudFormation.getString(properties.DataFormat) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("registry", "Registry", (properties.Registry != null ? CfnSchemaRegistryPropertyFromCloudFormation(properties.Registry) : undefined));
  ret.addPropertyResult("schemaDefinition", "SchemaDefinition", (properties.SchemaDefinition != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaDefinition) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Glue::SchemaVersion` is an AWS Glue resource type that manages schema versions of schemas in the AWS Glue Schema Registry.
 *
 * @cloudformationResource AWS::Glue::SchemaVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schemaversion.html
 */
export class CfnSchemaVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::SchemaVersion";

  /**
   * Build a CfnSchemaVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSchemaVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSchemaVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSchemaVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Represents the version ID associated with the schema version.
   *
   * @cloudformationAttribute VersionId
   */
  public readonly attrVersionId: string;

  /**
   * The schema that includes the schema version.
   */
  public schema: cdk.IResolvable | CfnSchemaVersion.SchemaProperty;

  /**
   * The schema definition for the schema version.
   */
  public schemaDefinition: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSchemaVersionProps) {
    super(scope, id, {
      "type": CfnSchemaVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "schema", this);
    cdk.requireProperty(props, "schemaDefinition", this);

    this.attrVersionId = cdk.Token.asString(this.getAtt("VersionId", cdk.ResolutionTypeHint.STRING));
    this.schema = props.schema;
    this.schemaDefinition = props.schemaDefinition;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "schema": this.schema,
      "schemaDefinition": this.schemaDefinition
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSchemaVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSchemaVersionPropsToCloudFormation(props);
  }
}

export namespace CfnSchemaVersion {
  /**
   * A wrapper structure to contain schema identity fields.
   *
   * Either `SchemaArn` , or `SchemaName` and `RegistryName` has to be provided.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-schemaversion-schema.html
   */
  export interface SchemaProperty {
    /**
     * The name of the registry where the schema is stored.
     *
     * Either `SchemaArn` , or `SchemaName` and `RegistryName` has to be provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-schemaversion-schema.html#cfn-glue-schemaversion-schema-registryname
     */
    readonly registryName?: string;

    /**
     * The Amazon Resource Name (ARN) of the schema.
     *
     * Either `SchemaArn` , or `SchemaName` and `RegistryName` has to be provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-schemaversion-schema.html#cfn-glue-schemaversion-schema-schemaarn
     */
    readonly schemaArn?: string;

    /**
     * The name of the schema.
     *
     * Either `SchemaArn` , or `SchemaName` and `RegistryName` has to be provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-schemaversion-schema.html#cfn-glue-schemaversion-schema-schemaname
     */
    readonly schemaName?: string;
  }
}

/**
 * Properties for defining a `CfnSchemaVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schemaversion.html
 */
export interface CfnSchemaVersionProps {
  /**
   * The schema that includes the schema version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schemaversion.html#cfn-glue-schemaversion-schema
   */
  readonly schema: cdk.IResolvable | CfnSchemaVersion.SchemaProperty;

  /**
   * The schema definition for the schema version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schemaversion.html#cfn-glue-schemaversion-schemadefinition
   */
  readonly schemaDefinition: string;
}

/**
 * Determine whether the given properties match those of a `SchemaProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchemaVersionSchemaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("registryName", cdk.validateString)(properties.registryName));
  errors.collect(cdk.propertyValidator("schemaArn", cdk.validateString)(properties.schemaArn));
  errors.collect(cdk.propertyValidator("schemaName", cdk.validateString)(properties.schemaName));
  return errors.wrap("supplied properties not correct for \"SchemaProperty\"");
}

// @ts-ignore TS6133
function convertCfnSchemaVersionSchemaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchemaVersionSchemaPropertyValidator(properties).assertSuccess();
  return {
    "RegistryName": cdk.stringToCloudFormation(properties.registryName),
    "SchemaArn": cdk.stringToCloudFormation(properties.schemaArn),
    "SchemaName": cdk.stringToCloudFormation(properties.schemaName)
  };
}

// @ts-ignore TS6133
function CfnSchemaVersionSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchemaVersion.SchemaProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchemaVersion.SchemaProperty>();
  ret.addPropertyResult("registryName", "RegistryName", (properties.RegistryName != null ? cfn_parse.FromCloudFormation.getString(properties.RegistryName) : undefined));
  ret.addPropertyResult("schemaArn", "SchemaArn", (properties.SchemaArn != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaArn) : undefined));
  ret.addPropertyResult("schemaName", "SchemaName", (properties.SchemaName != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSchemaVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnSchemaVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchemaVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("schema", cdk.requiredValidator)(properties.schema));
  errors.collect(cdk.propertyValidator("schema", CfnSchemaVersionSchemaPropertyValidator)(properties.schema));
  errors.collect(cdk.propertyValidator("schemaDefinition", cdk.requiredValidator)(properties.schemaDefinition));
  errors.collect(cdk.propertyValidator("schemaDefinition", cdk.validateString)(properties.schemaDefinition));
  return errors.wrap("supplied properties not correct for \"CfnSchemaVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnSchemaVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchemaVersionPropsValidator(properties).assertSuccess();
  return {
    "Schema": convertCfnSchemaVersionSchemaPropertyToCloudFormation(properties.schema),
    "SchemaDefinition": cdk.stringToCloudFormation(properties.schemaDefinition)
  };
}

// @ts-ignore TS6133
function CfnSchemaVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchemaVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchemaVersionProps>();
  ret.addPropertyResult("schema", "Schema", (properties.Schema != null ? CfnSchemaVersionSchemaPropertyFromCloudFormation(properties.Schema) : undefined));
  ret.addPropertyResult("schemaDefinition", "SchemaDefinition", (properties.SchemaDefinition != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaDefinition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Glue::SchemaVersionMetadata` is an AWS Glue resource type that defines the metadata key-value pairs for a schema version in AWS Glue Schema Registry.
 *
 * @cloudformationResource AWS::Glue::SchemaVersionMetadata
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schemaversionmetadata.html
 */
export class CfnSchemaVersionMetadata extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::SchemaVersionMetadata";

  /**
   * Build a CfnSchemaVersionMetadata from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSchemaVersionMetadata {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSchemaVersionMetadataPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSchemaVersionMetadata(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A metadata key in a key-value pair for metadata.
   */
  public key: string;

  /**
   * The version number of the schema.
   */
  public schemaVersionId: string;

  /**
   * A metadata key's corresponding value.
   */
  public value: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSchemaVersionMetadataProps) {
    super(scope, id, {
      "type": CfnSchemaVersionMetadata.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "key", this);
    cdk.requireProperty(props, "schemaVersionId", this);
    cdk.requireProperty(props, "value", this);

    this.key = props.key;
    this.schemaVersionId = props.schemaVersionId;
    this.value = props.value;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "key": this.key,
      "schemaVersionId": this.schemaVersionId,
      "value": this.value
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSchemaVersionMetadata.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSchemaVersionMetadataPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSchemaVersionMetadata`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schemaversionmetadata.html
 */
export interface CfnSchemaVersionMetadataProps {
  /**
   * A metadata key in a key-value pair for metadata.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schemaversionmetadata.html#cfn-glue-schemaversionmetadata-key
   */
  readonly key: string;

  /**
   * The version number of the schema.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schemaversionmetadata.html#cfn-glue-schemaversionmetadata-schemaversionid
   */
  readonly schemaVersionId: string;

  /**
   * A metadata key's corresponding value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-schemaversionmetadata.html#cfn-glue-schemaversionmetadata-value
   */
  readonly value: string;
}

/**
 * Determine whether the given properties match those of a `CfnSchemaVersionMetadataProps`
 *
 * @param properties - the TypeScript properties of a `CfnSchemaVersionMetadataProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchemaVersionMetadataPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("schemaVersionId", cdk.requiredValidator)(properties.schemaVersionId));
  errors.collect(cdk.propertyValidator("schemaVersionId", cdk.validateString)(properties.schemaVersionId));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"CfnSchemaVersionMetadataProps\"");
}

// @ts-ignore TS6133
function convertCfnSchemaVersionMetadataPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchemaVersionMetadataPropsValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "SchemaVersionId": cdk.stringToCloudFormation(properties.schemaVersionId),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnSchemaVersionMetadataPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchemaVersionMetadataProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchemaVersionMetadataProps>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("schemaVersionId", "SchemaVersionId", (properties.SchemaVersionId != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaVersionId) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new security configuration.
 *
 * A security configuration is a set of security properties that can be used by AWS Glue . You can use a security configuration to encrypt data at rest. For information about using security configurations in AWS Glue , see [Encrypting Data Written by Crawlers, Jobs, and Development Endpoints](https://docs.aws.amazon.com/glue/latest/dg/encryption-security-configuration.html) .
 *
 * @cloudformationResource AWS::Glue::SecurityConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-securityconfiguration.html
 */
export class CfnSecurityConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::SecurityConfiguration";

  /**
   * Build a CfnSecurityConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSecurityConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSecurityConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSecurityConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The encryption configuration associated with this security configuration.
   */
  public encryptionConfiguration: CfnSecurityConfiguration.EncryptionConfigurationProperty | cdk.IResolvable;

  /**
   * The name of the security configuration.
   */
  public name: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSecurityConfigurationProps) {
    super(scope, id, {
      "type": CfnSecurityConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "encryptionConfiguration", this);
    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.encryptionConfiguration = props.encryptionConfiguration;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "encryptionConfiguration": this.encryptionConfiguration,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSecurityConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSecurityConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnSecurityConfiguration {
  /**
   * Specifies an encryption configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-encryptionconfiguration.html
   */
  export interface EncryptionConfigurationProperty {
    /**
     * The encryption configuration for Amazon CloudWatch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-encryptionconfiguration.html#cfn-glue-securityconfiguration-encryptionconfiguration-cloudwatchencryption
     */
    readonly cloudWatchEncryption?: CfnSecurityConfiguration.CloudWatchEncryptionProperty | cdk.IResolvable;

    /**
     * The encryption configuration for job bookmarks.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-encryptionconfiguration.html#cfn-glue-securityconfiguration-encryptionconfiguration-jobbookmarksencryption
     */
    readonly jobBookmarksEncryption?: cdk.IResolvable | CfnSecurityConfiguration.JobBookmarksEncryptionProperty;

    /**
     * The encyption configuration for Amazon Simple Storage Service (Amazon S3) data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-encryptionconfiguration.html#cfn-glue-securityconfiguration-encryptionconfiguration-s3encryptions
     */
    readonly s3Encryptions?: Array<cdk.IResolvable | CfnSecurityConfiguration.S3EncryptionProperty> | cdk.IResolvable;
  }

  /**
   * Specifies how Amazon Simple Storage Service (Amazon S3) data should be encrypted.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-s3encryption.html
   */
  export interface S3EncryptionProperty {
    /**
     * The Amazon Resource Name (ARN) of the KMS key to be used to encrypt the data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-s3encryption.html#cfn-glue-securityconfiguration-s3encryption-kmskeyarn
     */
    readonly kmsKeyArn?: string;

    /**
     * The encryption mode to use for Amazon S3 data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-s3encryption.html#cfn-glue-securityconfiguration-s3encryption-s3encryptionmode
     */
    readonly s3EncryptionMode?: string;
  }

  /**
   * Specifies how Amazon CloudWatch data should be encrypted.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-cloudwatchencryption.html
   */
  export interface CloudWatchEncryptionProperty {
    /**
     * The encryption mode to use for CloudWatch data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-cloudwatchencryption.html#cfn-glue-securityconfiguration-cloudwatchencryption-cloudwatchencryptionmode
     */
    readonly cloudWatchEncryptionMode?: string;

    /**
     * The Amazon Resource Name (ARN) of the KMS key to be used to encrypt the data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-cloudwatchencryption.html#cfn-glue-securityconfiguration-cloudwatchencryption-kmskeyarn
     */
    readonly kmsKeyArn?: string;
  }

  /**
   * Specifies how job bookmark data should be encrypted.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-jobbookmarksencryption.html
   */
  export interface JobBookmarksEncryptionProperty {
    /**
     * The encryption mode to use for job bookmarks data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-jobbookmarksencryption.html#cfn-glue-securityconfiguration-jobbookmarksencryption-jobbookmarksencryptionmode
     */
    readonly jobBookmarksEncryptionMode?: string;

    /**
     * The Amazon Resource Name (ARN) of the KMS key to be used to encrypt the data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-jobbookmarksencryption.html#cfn-glue-securityconfiguration-jobbookmarksencryption-kmskeyarn
     */
    readonly kmsKeyArn?: string;
  }
}

/**
 * Properties for defining a `CfnSecurityConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-securityconfiguration.html
 */
export interface CfnSecurityConfigurationProps {
  /**
   * The encryption configuration associated with this security configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-securityconfiguration.html#cfn-glue-securityconfiguration-encryptionconfiguration
   */
  readonly encryptionConfiguration: CfnSecurityConfiguration.EncryptionConfigurationProperty | cdk.IResolvable;

  /**
   * The name of the security configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-securityconfiguration.html#cfn-glue-securityconfiguration-name
   */
  readonly name: string;
}

/**
 * Determine whether the given properties match those of a `S3EncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `S3EncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityConfigurationS3EncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("s3EncryptionMode", cdk.validateString)(properties.s3EncryptionMode));
  return errors.wrap("supplied properties not correct for \"S3EncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecurityConfigurationS3EncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityConfigurationS3EncryptionPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "S3EncryptionMode": cdk.stringToCloudFormation(properties.s3EncryptionMode)
  };
}

// @ts-ignore TS6133
function CfnSecurityConfigurationS3EncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSecurityConfiguration.S3EncryptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityConfiguration.S3EncryptionProperty>();
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addPropertyResult("s3EncryptionMode", "S3EncryptionMode", (properties.S3EncryptionMode != null ? cfn_parse.FromCloudFormation.getString(properties.S3EncryptionMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityConfigurationCloudWatchEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchEncryptionMode", cdk.validateString)(properties.cloudWatchEncryptionMode));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  return errors.wrap("supplied properties not correct for \"CloudWatchEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecurityConfigurationCloudWatchEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityConfigurationCloudWatchEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchEncryptionMode": cdk.stringToCloudFormation(properties.cloudWatchEncryptionMode),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn)
  };
}

// @ts-ignore TS6133
function CfnSecurityConfigurationCloudWatchEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityConfiguration.CloudWatchEncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityConfiguration.CloudWatchEncryptionProperty>();
  ret.addPropertyResult("cloudWatchEncryptionMode", "CloudWatchEncryptionMode", (properties.CloudWatchEncryptionMode != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchEncryptionMode) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JobBookmarksEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `JobBookmarksEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityConfigurationJobBookmarksEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("jobBookmarksEncryptionMode", cdk.validateString)(properties.jobBookmarksEncryptionMode));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  return errors.wrap("supplied properties not correct for \"JobBookmarksEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecurityConfigurationJobBookmarksEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityConfigurationJobBookmarksEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "JobBookmarksEncryptionMode": cdk.stringToCloudFormation(properties.jobBookmarksEncryptionMode),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn)
  };
}

// @ts-ignore TS6133
function CfnSecurityConfigurationJobBookmarksEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSecurityConfiguration.JobBookmarksEncryptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityConfiguration.JobBookmarksEncryptionProperty>();
  ret.addPropertyResult("jobBookmarksEncryptionMode", "JobBookmarksEncryptionMode", (properties.JobBookmarksEncryptionMode != null ? cfn_parse.FromCloudFormation.getString(properties.JobBookmarksEncryptionMode) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityConfigurationEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchEncryption", CfnSecurityConfigurationCloudWatchEncryptionPropertyValidator)(properties.cloudWatchEncryption));
  errors.collect(cdk.propertyValidator("jobBookmarksEncryption", CfnSecurityConfigurationJobBookmarksEncryptionPropertyValidator)(properties.jobBookmarksEncryption));
  errors.collect(cdk.propertyValidator("s3Encryptions", cdk.listValidator(CfnSecurityConfigurationS3EncryptionPropertyValidator))(properties.s3Encryptions));
  return errors.wrap("supplied properties not correct for \"EncryptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnSecurityConfigurationEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityConfigurationEncryptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchEncryption": convertCfnSecurityConfigurationCloudWatchEncryptionPropertyToCloudFormation(properties.cloudWatchEncryption),
    "JobBookmarksEncryption": convertCfnSecurityConfigurationJobBookmarksEncryptionPropertyToCloudFormation(properties.jobBookmarksEncryption),
    "S3Encryptions": cdk.listMapper(convertCfnSecurityConfigurationS3EncryptionPropertyToCloudFormation)(properties.s3Encryptions)
  };
}

// @ts-ignore TS6133
function CfnSecurityConfigurationEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityConfiguration.EncryptionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityConfiguration.EncryptionConfigurationProperty>();
  ret.addPropertyResult("cloudWatchEncryption", "CloudWatchEncryption", (properties.CloudWatchEncryption != null ? CfnSecurityConfigurationCloudWatchEncryptionPropertyFromCloudFormation(properties.CloudWatchEncryption) : undefined));
  ret.addPropertyResult("jobBookmarksEncryption", "JobBookmarksEncryption", (properties.JobBookmarksEncryption != null ? CfnSecurityConfigurationJobBookmarksEncryptionPropertyFromCloudFormation(properties.JobBookmarksEncryption) : undefined));
  ret.addPropertyResult("s3Encryptions", "S3Encryptions", (properties.S3Encryptions != null ? cfn_parse.FromCloudFormation.getArray(CfnSecurityConfigurationS3EncryptionPropertyFromCloudFormation)(properties.S3Encryptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSecurityConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnSecurityConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryptionConfiguration", cdk.requiredValidator)(properties.encryptionConfiguration));
  errors.collect(cdk.propertyValidator("encryptionConfiguration", CfnSecurityConfigurationEncryptionConfigurationPropertyValidator)(properties.encryptionConfiguration));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnSecurityConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnSecurityConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityConfigurationPropsValidator(properties).assertSuccess();
  return {
    "EncryptionConfiguration": convertCfnSecurityConfigurationEncryptionConfigurationPropertyToCloudFormation(properties.encryptionConfiguration),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnSecurityConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityConfigurationProps>();
  ret.addPropertyResult("encryptionConfiguration", "EncryptionConfiguration", (properties.EncryptionConfiguration != null ? CfnSecurityConfigurationEncryptionConfigurationPropertyFromCloudFormation(properties.EncryptionConfiguration) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Glue::Table` resource specifies tabular data in the AWS Glue data catalog.
 *
 * For more information, see [Defining Tables in the AWS Glue Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/tables-described.html) and [Table Structure](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-catalog-tables.html#aws-glue-api-catalog-tables-Table) in the *AWS Glue Developer Guide* .
 *
 * @cloudformationResource AWS::Glue::Table
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-table.html
 */
export class CfnTable extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::Table";

  /**
   * Build a CfnTable from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTable {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTablePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTable(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ID of the Data Catalog in which to create the `Table` .
   */
  public catalogId: string;

  /**
   * The name of the database where the table metadata resides.
   */
  public databaseName: string;

  /**
   * A structure representing an open format table.
   */
  public openTableFormatInput?: cdk.IResolvable | CfnTable.OpenTableFormatInputProperty;

  /**
   * A structure used to define a table.
   */
  public tableInput: cdk.IResolvable | CfnTable.TableInputProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTableProps) {
    super(scope, id, {
      "type": CfnTable.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "catalogId", this);
    cdk.requireProperty(props, "databaseName", this);
    cdk.requireProperty(props, "tableInput", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.catalogId = props.catalogId;
    this.databaseName = props.databaseName;
    this.openTableFormatInput = props.openTableFormatInput;
    this.tableInput = props.tableInput;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "catalogId": this.catalogId,
      "databaseName": this.databaseName,
      "openTableFormatInput": this.openTableFormatInput,
      "tableInput": this.tableInput
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTable.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTablePropsToCloudFormation(props);
  }
}

export namespace CfnTable {
  /**
   * A structure used to define a table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html
   */
  export interface TableInputProperty {
    /**
     * A description of the table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-description
     */
    readonly description?: string;

    /**
     * The table name.
     *
     * For Hive compatibility, this is folded to lowercase when it is stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-name
     */
    readonly name?: string;

    /**
     * The table owner.
     *
     * Included for Apache Hive compatibility. Not used in the normal course of AWS Glue operations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-owner
     */
    readonly owner?: string;

    /**
     * These key-value pairs define properties associated with the table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-parameters
     */
    readonly parameters?: any | cdk.IResolvable;

    /**
     * A list of columns by which the table is partitioned. Only primitive types are supported as partition keys.
     *
     * When you create a table used by Amazon Athena, and you do not specify any `partitionKeys` , you must at least set the value of `partitionKeys` to an empty list. For example:
     *
     * `"PartitionKeys": []`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-partitionkeys
     */
    readonly partitionKeys?: Array<CfnTable.ColumnProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The retention time for this table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-retention
     */
    readonly retention?: number;

    /**
     * A storage descriptor containing information about the physical storage of this table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-storagedescriptor
     */
    readonly storageDescriptor?: cdk.IResolvable | CfnTable.StorageDescriptorProperty;

    /**
     * The type of this table.
     *
     * AWS Glue will create tables with the `EXTERNAL_TABLE` type. Other services, such as Athena, may create tables with additional table types.
     *
     * AWS Glue related table types:
     *
     * - **EXTERNAL_TABLE** - Hive compatible attribute - indicates a non-Hive managed table.
     * - **GOVERNED** - Used by AWS Lake Formation . The AWS Glue Data Catalog understands `GOVERNED` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-tabletype
     */
    readonly tableType?: string;

    /**
     * A `TableIdentifier` structure that describes a target table for resource linking.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-targettable
     */
    readonly targetTable?: cdk.IResolvable | CfnTable.TableIdentifierProperty;

    /**
     * Included for Apache Hive compatibility.
     *
     * Not used in the normal course of AWS Glue operations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-viewexpandedtext
     */
    readonly viewExpandedText?: string;

    /**
     * Included for Apache Hive compatibility.
     *
     * Not used in the normal course of AWS Glue operations. If the table is a `VIRTUAL_VIEW` , certain Athena configuration encoded in base64.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableinput.html#cfn-glue-table-tableinput-vieworiginaltext
     */
    readonly viewOriginalText?: string;
  }

  /**
   * Describes the physical storage of table data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html
   */
  export interface StorageDescriptorProperty {
    /**
     * A list of reducer grouping columns, clustering columns, and bucketing columns in the table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-bucketcolumns
     */
    readonly bucketColumns?: Array<string>;

    /**
     * A list of the `Columns` in the table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-columns
     */
    readonly columns?: Array<CfnTable.ColumnProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * `True` if the data in the table is compressed, or `False` if not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-compressed
     */
    readonly compressed?: boolean | cdk.IResolvable;

    /**
     * The input format: `SequenceFileInputFormat` (binary), or `TextInputFormat` , or a custom format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-inputformat
     */
    readonly inputFormat?: string;

    /**
     * The physical location of the table.
     *
     * By default, this takes the form of the warehouse location, followed by the database location in the warehouse, followed by the table name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-location
     */
    readonly location?: string;

    /**
     * Must be specified if the table contains any dimension columns.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-numberofbuckets
     */
    readonly numberOfBuckets?: number;

    /**
     * The output format: `SequenceFileOutputFormat` (binary), or `IgnoreKeyTextOutputFormat` , or a custom format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-outputformat
     */
    readonly outputFormat?: string;

    /**
     * The user-supplied properties in key-value form.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-parameters
     */
    readonly parameters?: any | cdk.IResolvable;

    /**
     * An object that references a schema stored in the AWS Glue Schema Registry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-schemareference
     */
    readonly schemaReference?: cdk.IResolvable | CfnTable.SchemaReferenceProperty;

    /**
     * The serialization/deserialization (SerDe) information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-serdeinfo
     */
    readonly serdeInfo?: cdk.IResolvable | CfnTable.SerdeInfoProperty;

    /**
     * The information about values that appear frequently in a column (skewed values).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-skewedinfo
     */
    readonly skewedInfo?: cdk.IResolvable | CfnTable.SkewedInfoProperty;

    /**
     * A list specifying the sort order of each bucket in the table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-sortcolumns
     */
    readonly sortColumns?: Array<cdk.IResolvable | CfnTable.OrderProperty> | cdk.IResolvable;

    /**
     * `True` if the table data is stored in subdirectories, or `False` if not.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-storagedescriptor.html#cfn-glue-table-storagedescriptor-storedassubdirectories
     */
    readonly storedAsSubDirectories?: boolean | cdk.IResolvable;
  }

  /**
   * A column in a `Table` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-column.html
   */
  export interface ColumnProperty {
    /**
     * A free-form text comment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-column.html#cfn-glue-table-column-comment
     */
    readonly comment?: string;

    /**
     * The name of the `Column` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-column.html#cfn-glue-table-column-name
     */
    readonly name: string;

    /**
     * The data type of the `Column` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-column.html#cfn-glue-table-column-type
     */
    readonly type?: string;
  }

  /**
   * Information about a serialization/deserialization program (SerDe) that serves as an extractor and loader.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-serdeinfo.html
   */
  export interface SerdeInfoProperty {
    /**
     * Name of the SerDe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-serdeinfo.html#cfn-glue-table-serdeinfo-name
     */
    readonly name?: string;

    /**
     * These key-value pairs define initialization parameters for the SerDe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-serdeinfo.html#cfn-glue-table-serdeinfo-parameters
     */
    readonly parameters?: any | cdk.IResolvable;

    /**
     * Usually the class that implements the SerDe.
     *
     * An example is `org.apache.hadoop.hive.serde2.columnar.ColumnarSerDe` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-serdeinfo.html#cfn-glue-table-serdeinfo-serializationlibrary
     */
    readonly serializationLibrary?: string;
  }

  /**
   * Specifies the sort order of a sorted column.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-order.html
   */
  export interface OrderProperty {
    /**
     * The name of the column.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-order.html#cfn-glue-table-order-column
     */
    readonly column: string;

    /**
     * Indicates that the column is sorted in ascending order ( `== 1` ), or in descending order ( `==0` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-order.html#cfn-glue-table-order-sortorder
     */
    readonly sortOrder: number;
  }

  /**
   * An object that references a schema stored in the AWS Glue Schema Registry.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-schemareference.html
   */
  export interface SchemaReferenceProperty {
    /**
     * A structure that contains schema identity fields.
     *
     * Either this or the `SchemaVersionId` has to be
     * provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-schemareference.html#cfn-glue-table-schemareference-schemaid
     */
    readonly schemaId?: cdk.IResolvable | CfnTable.SchemaIdProperty;

    /**
     * The unique ID assigned to a version of the schema.
     *
     * Either this or the `SchemaId` has to be provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-schemareference.html#cfn-glue-table-schemareference-schemaversionid
     */
    readonly schemaVersionId?: string;

    /**
     * The version number of the schema.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-schemareference.html#cfn-glue-table-schemareference-schemaversionnumber
     */
    readonly schemaVersionNumber?: number;
  }

  /**
   * A structure that contains schema identity fields.
   *
   * Either this or the `SchemaVersionId` has to be
   * provided.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-schemaid.html
   */
  export interface SchemaIdProperty {
    /**
     * The name of the schema registry that contains the schema.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-schemaid.html#cfn-glue-table-schemaid-registryname
     */
    readonly registryName?: string;

    /**
     * The Amazon Resource Name (ARN) of the schema.
     *
     * One of `SchemaArn` or `SchemaName` has to be
     * provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-schemaid.html#cfn-glue-table-schemaid-schemaarn
     */
    readonly schemaArn?: string;

    /**
     * The name of the schema.
     *
     * One of `SchemaArn` or `SchemaName` has to be provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-schemaid.html#cfn-glue-table-schemaid-schemaname
     */
    readonly schemaName?: string;
  }

  /**
   * Specifies skewed values in a table.
   *
   * Skewed values are those that occur with very high frequency.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-skewedinfo.html
   */
  export interface SkewedInfoProperty {
    /**
     * A list of names of columns that contain skewed values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-skewedinfo.html#cfn-glue-table-skewedinfo-skewedcolumnnames
     */
    readonly skewedColumnNames?: Array<string>;

    /**
     * A mapping of skewed values to the columns that contain them.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-skewedinfo.html#cfn-glue-table-skewedinfo-skewedcolumnvaluelocationmaps
     */
    readonly skewedColumnValueLocationMaps?: any | cdk.IResolvable;

    /**
     * A list of values that appear so frequently as to be considered skewed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-skewedinfo.html#cfn-glue-table-skewedinfo-skewedcolumnvalues
     */
    readonly skewedColumnValues?: Array<string>;
  }

  /**
   * A structure that describes a target table for resource linking.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableidentifier.html
   */
  export interface TableIdentifierProperty {
    /**
     * The ID of the Data Catalog in which the table resides.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableidentifier.html#cfn-glue-table-tableidentifier-catalogid
     */
    readonly catalogId?: string;

    /**
     * The name of the catalog database that contains the target table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableidentifier.html#cfn-glue-table-tableidentifier-databasename
     */
    readonly databaseName?: string;

    /**
     * The name of the target table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableidentifier.html#cfn-glue-table-tableidentifier-name
     */
    readonly name?: string;

    /**
     * Region of the target table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-tableidentifier.html#cfn-glue-table-tableidentifier-region
     */
    readonly region?: string;
  }

  /**
   * A structure representing an open format table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-opentableformatinput.html
   */
  export interface OpenTableFormatInputProperty {
    /**
     * Specifies an `IcebergInput` structure that defines an Apache Iceberg metadata table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-opentableformatinput.html#cfn-glue-table-opentableformatinput-iceberginput
     */
    readonly icebergInput?: CfnTable.IcebergInputProperty | cdk.IResolvable;
  }

  /**
   * A structure that defines an Apache Iceberg metadata table to create in the catalog.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-iceberginput.html
   */
  export interface IcebergInputProperty {
    /**
     * A required metadata operation.
     *
     * Can only be set to `CREATE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-iceberginput.html#cfn-glue-table-iceberginput-metadataoperation
     */
    readonly metadataOperation?: string;

    /**
     * The table version for the Iceberg table.
     *
     * Defaults to 2.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-table-iceberginput.html#cfn-glue-table-iceberginput-version
     */
    readonly version?: string;
  }
}

/**
 * Properties for defining a `CfnTable`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-table.html
 */
export interface CfnTableProps {
  /**
   * The ID of the Data Catalog in which to create the `Table` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-table.html#cfn-glue-table-catalogid
   */
  readonly catalogId: string;

  /**
   * The name of the database where the table metadata resides.
   *
   * For Hive compatibility, this must be all lowercase.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-table.html#cfn-glue-table-databasename
   */
  readonly databaseName: string;

  /**
   * A structure representing an open format table.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-table.html#cfn-glue-table-opentableformatinput
   */
  readonly openTableFormatInput?: cdk.IResolvable | CfnTable.OpenTableFormatInputProperty;

  /**
   * A structure used to define a table.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-table.html#cfn-glue-table-tableinput
   */
  readonly tableInput: cdk.IResolvable | CfnTable.TableInputProperty;
}

/**
 * Determine whether the given properties match those of a `ColumnProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableColumnPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("comment", cdk.validateString)(properties.comment));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ColumnProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableColumnPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableColumnPropertyValidator(properties).assertSuccess();
  return {
    "Comment": cdk.stringToCloudFormation(properties.comment),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnTableColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.ColumnProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.ColumnProperty>();
  ret.addPropertyResult("comment", "Comment", (properties.Comment != null ? cfn_parse.FromCloudFormation.getString(properties.Comment) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SerdeInfoProperty`
 *
 * @param properties - the TypeScript properties of a `SerdeInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableSerdeInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("serializationLibrary", cdk.validateString)(properties.serializationLibrary));
  return errors.wrap("supplied properties not correct for \"SerdeInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableSerdeInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableSerdeInfoPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "SerializationLibrary": cdk.stringToCloudFormation(properties.serializationLibrary)
  };
}

// @ts-ignore TS6133
function CfnTableSerdeInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.SerdeInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.SerdeInfoProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("serializationLibrary", "SerializationLibrary", (properties.SerializationLibrary != null ? cfn_parse.FromCloudFormation.getString(properties.SerializationLibrary) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OrderProperty`
 *
 * @param properties - the TypeScript properties of a `OrderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableOrderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("column", cdk.requiredValidator)(properties.column));
  errors.collect(cdk.propertyValidator("column", cdk.validateString)(properties.column));
  errors.collect(cdk.propertyValidator("sortOrder", cdk.requiredValidator)(properties.sortOrder));
  errors.collect(cdk.propertyValidator("sortOrder", cdk.validateNumber)(properties.sortOrder));
  return errors.wrap("supplied properties not correct for \"OrderProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableOrderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableOrderPropertyValidator(properties).assertSuccess();
  return {
    "Column": cdk.stringToCloudFormation(properties.column),
    "SortOrder": cdk.numberToCloudFormation(properties.sortOrder)
  };
}

// @ts-ignore TS6133
function CfnTableOrderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.OrderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.OrderProperty>();
  ret.addPropertyResult("column", "Column", (properties.Column != null ? cfn_parse.FromCloudFormation.getString(properties.Column) : undefined));
  ret.addPropertyResult("sortOrder", "SortOrder", (properties.SortOrder != null ? cfn_parse.FromCloudFormation.getNumber(properties.SortOrder) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SchemaIdProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaIdProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableSchemaIdPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("registryName", cdk.validateString)(properties.registryName));
  errors.collect(cdk.propertyValidator("schemaArn", cdk.validateString)(properties.schemaArn));
  errors.collect(cdk.propertyValidator("schemaName", cdk.validateString)(properties.schemaName));
  return errors.wrap("supplied properties not correct for \"SchemaIdProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableSchemaIdPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableSchemaIdPropertyValidator(properties).assertSuccess();
  return {
    "RegistryName": cdk.stringToCloudFormation(properties.registryName),
    "SchemaArn": cdk.stringToCloudFormation(properties.schemaArn),
    "SchemaName": cdk.stringToCloudFormation(properties.schemaName)
  };
}

// @ts-ignore TS6133
function CfnTableSchemaIdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.SchemaIdProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.SchemaIdProperty>();
  ret.addPropertyResult("registryName", "RegistryName", (properties.RegistryName != null ? cfn_parse.FromCloudFormation.getString(properties.RegistryName) : undefined));
  ret.addPropertyResult("schemaArn", "SchemaArn", (properties.SchemaArn != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaArn) : undefined));
  ret.addPropertyResult("schemaName", "SchemaName", (properties.SchemaName != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SchemaReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaReferenceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableSchemaReferencePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("schemaId", CfnTableSchemaIdPropertyValidator)(properties.schemaId));
  errors.collect(cdk.propertyValidator("schemaVersionId", cdk.validateString)(properties.schemaVersionId));
  errors.collect(cdk.propertyValidator("schemaVersionNumber", cdk.validateNumber)(properties.schemaVersionNumber));
  return errors.wrap("supplied properties not correct for \"SchemaReferenceProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableSchemaReferencePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableSchemaReferencePropertyValidator(properties).assertSuccess();
  return {
    "SchemaId": convertCfnTableSchemaIdPropertyToCloudFormation(properties.schemaId),
    "SchemaVersionId": cdk.stringToCloudFormation(properties.schemaVersionId),
    "SchemaVersionNumber": cdk.numberToCloudFormation(properties.schemaVersionNumber)
  };
}

// @ts-ignore TS6133
function CfnTableSchemaReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.SchemaReferenceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.SchemaReferenceProperty>();
  ret.addPropertyResult("schemaId", "SchemaId", (properties.SchemaId != null ? CfnTableSchemaIdPropertyFromCloudFormation(properties.SchemaId) : undefined));
  ret.addPropertyResult("schemaVersionId", "SchemaVersionId", (properties.SchemaVersionId != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaVersionId) : undefined));
  ret.addPropertyResult("schemaVersionNumber", "SchemaVersionNumber", (properties.SchemaVersionNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.SchemaVersionNumber) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SkewedInfoProperty`
 *
 * @param properties - the TypeScript properties of a `SkewedInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableSkewedInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("skewedColumnNames", cdk.listValidator(cdk.validateString))(properties.skewedColumnNames));
  errors.collect(cdk.propertyValidator("skewedColumnValueLocationMaps", cdk.validateObject)(properties.skewedColumnValueLocationMaps));
  errors.collect(cdk.propertyValidator("skewedColumnValues", cdk.listValidator(cdk.validateString))(properties.skewedColumnValues));
  return errors.wrap("supplied properties not correct for \"SkewedInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableSkewedInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableSkewedInfoPropertyValidator(properties).assertSuccess();
  return {
    "SkewedColumnNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.skewedColumnNames),
    "SkewedColumnValueLocationMaps": cdk.objectToCloudFormation(properties.skewedColumnValueLocationMaps),
    "SkewedColumnValues": cdk.listMapper(cdk.stringToCloudFormation)(properties.skewedColumnValues)
  };
}

// @ts-ignore TS6133
function CfnTableSkewedInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.SkewedInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.SkewedInfoProperty>();
  ret.addPropertyResult("skewedColumnNames", "SkewedColumnNames", (properties.SkewedColumnNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SkewedColumnNames) : undefined));
  ret.addPropertyResult("skewedColumnValueLocationMaps", "SkewedColumnValueLocationMaps", (properties.SkewedColumnValueLocationMaps != null ? cfn_parse.FromCloudFormation.getAny(properties.SkewedColumnValueLocationMaps) : undefined));
  ret.addPropertyResult("skewedColumnValues", "SkewedColumnValues", (properties.SkewedColumnValues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SkewedColumnValues) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StorageDescriptorProperty`
 *
 * @param properties - the TypeScript properties of a `StorageDescriptorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableStorageDescriptorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketColumns", cdk.listValidator(cdk.validateString))(properties.bucketColumns));
  errors.collect(cdk.propertyValidator("columns", cdk.listValidator(CfnTableColumnPropertyValidator))(properties.columns));
  errors.collect(cdk.propertyValidator("compressed", cdk.validateBoolean)(properties.compressed));
  errors.collect(cdk.propertyValidator("inputFormat", cdk.validateString)(properties.inputFormat));
  errors.collect(cdk.propertyValidator("location", cdk.validateString)(properties.location));
  errors.collect(cdk.propertyValidator("numberOfBuckets", cdk.validateNumber)(properties.numberOfBuckets));
  errors.collect(cdk.propertyValidator("outputFormat", cdk.validateString)(properties.outputFormat));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("schemaReference", CfnTableSchemaReferencePropertyValidator)(properties.schemaReference));
  errors.collect(cdk.propertyValidator("serdeInfo", CfnTableSerdeInfoPropertyValidator)(properties.serdeInfo));
  errors.collect(cdk.propertyValidator("skewedInfo", CfnTableSkewedInfoPropertyValidator)(properties.skewedInfo));
  errors.collect(cdk.propertyValidator("sortColumns", cdk.listValidator(CfnTableOrderPropertyValidator))(properties.sortColumns));
  errors.collect(cdk.propertyValidator("storedAsSubDirectories", cdk.validateBoolean)(properties.storedAsSubDirectories));
  return errors.wrap("supplied properties not correct for \"StorageDescriptorProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableStorageDescriptorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableStorageDescriptorPropertyValidator(properties).assertSuccess();
  return {
    "BucketColumns": cdk.listMapper(cdk.stringToCloudFormation)(properties.bucketColumns),
    "Columns": cdk.listMapper(convertCfnTableColumnPropertyToCloudFormation)(properties.columns),
    "Compressed": cdk.booleanToCloudFormation(properties.compressed),
    "InputFormat": cdk.stringToCloudFormation(properties.inputFormat),
    "Location": cdk.stringToCloudFormation(properties.location),
    "NumberOfBuckets": cdk.numberToCloudFormation(properties.numberOfBuckets),
    "OutputFormat": cdk.stringToCloudFormation(properties.outputFormat),
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "SchemaReference": convertCfnTableSchemaReferencePropertyToCloudFormation(properties.schemaReference),
    "SerdeInfo": convertCfnTableSerdeInfoPropertyToCloudFormation(properties.serdeInfo),
    "SkewedInfo": convertCfnTableSkewedInfoPropertyToCloudFormation(properties.skewedInfo),
    "SortColumns": cdk.listMapper(convertCfnTableOrderPropertyToCloudFormation)(properties.sortColumns),
    "StoredAsSubDirectories": cdk.booleanToCloudFormation(properties.storedAsSubDirectories)
  };
}

// @ts-ignore TS6133
function CfnTableStorageDescriptorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.StorageDescriptorProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.StorageDescriptorProperty>();
  ret.addPropertyResult("bucketColumns", "BucketColumns", (properties.BucketColumns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.BucketColumns) : undefined));
  ret.addPropertyResult("columns", "Columns", (properties.Columns != null ? cfn_parse.FromCloudFormation.getArray(CfnTableColumnPropertyFromCloudFormation)(properties.Columns) : undefined));
  ret.addPropertyResult("compressed", "Compressed", (properties.Compressed != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Compressed) : undefined));
  ret.addPropertyResult("inputFormat", "InputFormat", (properties.InputFormat != null ? cfn_parse.FromCloudFormation.getString(properties.InputFormat) : undefined));
  ret.addPropertyResult("location", "Location", (properties.Location != null ? cfn_parse.FromCloudFormation.getString(properties.Location) : undefined));
  ret.addPropertyResult("numberOfBuckets", "NumberOfBuckets", (properties.NumberOfBuckets != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfBuckets) : undefined));
  ret.addPropertyResult("outputFormat", "OutputFormat", (properties.OutputFormat != null ? cfn_parse.FromCloudFormation.getString(properties.OutputFormat) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("schemaReference", "SchemaReference", (properties.SchemaReference != null ? CfnTableSchemaReferencePropertyFromCloudFormation(properties.SchemaReference) : undefined));
  ret.addPropertyResult("serdeInfo", "SerdeInfo", (properties.SerdeInfo != null ? CfnTableSerdeInfoPropertyFromCloudFormation(properties.SerdeInfo) : undefined));
  ret.addPropertyResult("skewedInfo", "SkewedInfo", (properties.SkewedInfo != null ? CfnTableSkewedInfoPropertyFromCloudFormation(properties.SkewedInfo) : undefined));
  ret.addPropertyResult("sortColumns", "SortColumns", (properties.SortColumns != null ? cfn_parse.FromCloudFormation.getArray(CfnTableOrderPropertyFromCloudFormation)(properties.SortColumns) : undefined));
  ret.addPropertyResult("storedAsSubDirectories", "StoredAsSubDirectories", (properties.StoredAsSubDirectories != null ? cfn_parse.FromCloudFormation.getBoolean(properties.StoredAsSubDirectories) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TableIdentifierProperty`
 *
 * @param properties - the TypeScript properties of a `TableIdentifierProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableTableIdentifierPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  return errors.wrap("supplied properties not correct for \"TableIdentifierProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableTableIdentifierPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableTableIdentifierPropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Region": cdk.stringToCloudFormation(properties.region)
  };
}

// @ts-ignore TS6133
function CfnTableTableIdentifierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.TableIdentifierProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.TableIdentifierProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TableInputProperty`
 *
 * @param properties - the TypeScript properties of a `TableInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableTableInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("owner", cdk.validateString)(properties.owner));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("partitionKeys", cdk.listValidator(CfnTableColumnPropertyValidator))(properties.partitionKeys));
  errors.collect(cdk.propertyValidator("retention", cdk.validateNumber)(properties.retention));
  errors.collect(cdk.propertyValidator("storageDescriptor", CfnTableStorageDescriptorPropertyValidator)(properties.storageDescriptor));
  errors.collect(cdk.propertyValidator("tableType", cdk.validateString)(properties.tableType));
  errors.collect(cdk.propertyValidator("targetTable", CfnTableTableIdentifierPropertyValidator)(properties.targetTable));
  errors.collect(cdk.propertyValidator("viewExpandedText", cdk.validateString)(properties.viewExpandedText));
  errors.collect(cdk.propertyValidator("viewOriginalText", cdk.validateString)(properties.viewOriginalText));
  return errors.wrap("supplied properties not correct for \"TableInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableTableInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableTableInputPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Owner": cdk.stringToCloudFormation(properties.owner),
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "PartitionKeys": cdk.listMapper(convertCfnTableColumnPropertyToCloudFormation)(properties.partitionKeys),
    "Retention": cdk.numberToCloudFormation(properties.retention),
    "StorageDescriptor": convertCfnTableStorageDescriptorPropertyToCloudFormation(properties.storageDescriptor),
    "TableType": cdk.stringToCloudFormation(properties.tableType),
    "TargetTable": convertCfnTableTableIdentifierPropertyToCloudFormation(properties.targetTable),
    "ViewExpandedText": cdk.stringToCloudFormation(properties.viewExpandedText),
    "ViewOriginalText": cdk.stringToCloudFormation(properties.viewOriginalText)
  };
}

// @ts-ignore TS6133
function CfnTableTableInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.TableInputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.TableInputProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("owner", "Owner", (properties.Owner != null ? cfn_parse.FromCloudFormation.getString(properties.Owner) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("partitionKeys", "PartitionKeys", (properties.PartitionKeys != null ? cfn_parse.FromCloudFormation.getArray(CfnTableColumnPropertyFromCloudFormation)(properties.PartitionKeys) : undefined));
  ret.addPropertyResult("retention", "Retention", (properties.Retention != null ? cfn_parse.FromCloudFormation.getNumber(properties.Retention) : undefined));
  ret.addPropertyResult("storageDescriptor", "StorageDescriptor", (properties.StorageDescriptor != null ? CfnTableStorageDescriptorPropertyFromCloudFormation(properties.StorageDescriptor) : undefined));
  ret.addPropertyResult("tableType", "TableType", (properties.TableType != null ? cfn_parse.FromCloudFormation.getString(properties.TableType) : undefined));
  ret.addPropertyResult("targetTable", "TargetTable", (properties.TargetTable != null ? CfnTableTableIdentifierPropertyFromCloudFormation(properties.TargetTable) : undefined));
  ret.addPropertyResult("viewExpandedText", "ViewExpandedText", (properties.ViewExpandedText != null ? cfn_parse.FromCloudFormation.getString(properties.ViewExpandedText) : undefined));
  ret.addPropertyResult("viewOriginalText", "ViewOriginalText", (properties.ViewOriginalText != null ? cfn_parse.FromCloudFormation.getString(properties.ViewOriginalText) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IcebergInputProperty`
 *
 * @param properties - the TypeScript properties of a `IcebergInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableIcebergInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("metadataOperation", cdk.validateString)(properties.metadataOperation));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"IcebergInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableIcebergInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableIcebergInputPropertyValidator(properties).assertSuccess();
  return {
    "MetadataOperation": cdk.stringToCloudFormation(properties.metadataOperation),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnTableIcebergInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTable.IcebergInputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.IcebergInputProperty>();
  ret.addPropertyResult("metadataOperation", "MetadataOperation", (properties.MetadataOperation != null ? cfn_parse.FromCloudFormation.getString(properties.MetadataOperation) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OpenTableFormatInputProperty`
 *
 * @param properties - the TypeScript properties of a `OpenTableFormatInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableOpenTableFormatInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("icebergInput", CfnTableIcebergInputPropertyValidator)(properties.icebergInput));
  return errors.wrap("supplied properties not correct for \"OpenTableFormatInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableOpenTableFormatInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableOpenTableFormatInputPropertyValidator(properties).assertSuccess();
  return {
    "IcebergInput": convertCfnTableIcebergInputPropertyToCloudFormation(properties.icebergInput)
  };
}

// @ts-ignore TS6133
function CfnTableOpenTableFormatInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.OpenTableFormatInputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.OpenTableFormatInputProperty>();
  ret.addPropertyResult("icebergInput", "IcebergInput", (properties.IcebergInput != null ? CfnTableIcebergInputPropertyFromCloudFormation(properties.IcebergInput) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTableProps`
 *
 * @param properties - the TypeScript properties of a `CfnTableProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTablePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.requiredValidator)(properties.catalogId));
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("openTableFormatInput", CfnTableOpenTableFormatInputPropertyValidator)(properties.openTableFormatInput));
  errors.collect(cdk.propertyValidator("tableInput", cdk.requiredValidator)(properties.tableInput));
  errors.collect(cdk.propertyValidator("tableInput", CfnTableTableInputPropertyValidator)(properties.tableInput));
  return errors.wrap("supplied properties not correct for \"CfnTableProps\"");
}

// @ts-ignore TS6133
function convertCfnTablePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTablePropsValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "OpenTableFormatInput": convertCfnTableOpenTableFormatInputPropertyToCloudFormation(properties.openTableFormatInput),
    "TableInput": convertCfnTableTableInputPropertyToCloudFormation(properties.tableInput)
  };
}

// @ts-ignore TS6133
function CfnTablePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTableProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTableProps>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("openTableFormatInput", "OpenTableFormatInput", (properties.OpenTableFormatInput != null ? CfnTableOpenTableFormatInputPropertyFromCloudFormation(properties.OpenTableFormatInput) : undefined));
  ret.addPropertyResult("tableInput", "TableInput", (properties.TableInput != null ? CfnTableTableInputPropertyFromCloudFormation(properties.TableInput) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Glue::Trigger` resource specifies triggers that run AWS Glue jobs.
 *
 * For more information, see [Triggering Jobs in AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/trigger-job.html) and [Trigger Structure](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-jobs-trigger.html#aws-glue-api-jobs-trigger-Trigger) in the *AWS Glue Developer Guide* .
 *
 * @cloudformationResource AWS::Glue::Trigger
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html
 */
export class CfnTrigger extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::Trigger";

  /**
   * Build a CfnTrigger from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTrigger {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTriggerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTrigger(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Reserved for future use.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The actions initiated by this trigger.
   */
  public actions: Array<CfnTrigger.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A description of this trigger.
   */
  public description?: string;

  /**
   * Batch condition that must be met (specified number of events received or batch time window expired) before EventBridge event trigger fires.
   */
  public eventBatchingCondition?: CfnTrigger.EventBatchingConditionProperty | cdk.IResolvable;

  /**
   * The name of the trigger.
   */
  public name?: string;

  /**
   * The predicate of this trigger, which defines when it will fire.
   */
  public predicate?: cdk.IResolvable | CfnTrigger.PredicateProperty;

  /**
   * A `cron` expression used to specify the schedule.
   */
  public schedule?: string;

  /**
   * Set to true to start `SCHEDULED` and `CONDITIONAL` triggers when created.
   */
  public startOnCreation?: boolean | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to use with this trigger.
   */
  public tagsRaw?: any;

  /**
   * The type of trigger that this is.
   */
  public type: string;

  /**
   * The name of the workflow associated with the trigger.
   */
  public workflowName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTriggerProps) {
    super(scope, id, {
      "type": CfnTrigger.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "actions", this);
    cdk.requireProperty(props, "type", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.actions = props.actions;
    this.description = props.description;
    this.eventBatchingCondition = props.eventBatchingCondition;
    this.name = props.name;
    this.predicate = props.predicate;
    this.schedule = props.schedule;
    this.startOnCreation = props.startOnCreation;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Glue::Trigger", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
    this.workflowName = props.workflowName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "actions": this.actions,
      "description": this.description,
      "eventBatchingCondition": this.eventBatchingCondition,
      "name": this.name,
      "predicate": this.predicate,
      "schedule": this.schedule,
      "startOnCreation": this.startOnCreation,
      "tags": this.tags.renderTags(),
      "type": this.type,
      "workflowName": this.workflowName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTrigger.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTriggerPropsToCloudFormation(props);
  }
}

export namespace CfnTrigger {
  /**
   * Defines an action to be initiated by a trigger.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html
   */
  export interface ActionProperty {
    /**
     * The job arguments used when this trigger fires.
     *
     * For this job run, they replace the default arguments set in the job definition itself.
     *
     * You can specify arguments here that your own job-execution script consumes, in addition to arguments that AWS Glue itself consumes.
     *
     * For information about how to specify and consume your own job arguments, see [Calling AWS Glue APIs in Python](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-python-calling.html) in the *AWS Glue Developer Guide* .
     *
     * For information about the key-value pairs that AWS Glue consumes to set up your job, see the [Special Parameters Used by AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html) topic in the developer guide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html#cfn-glue-trigger-action-arguments
     */
    readonly arguments?: any | cdk.IResolvable;

    /**
     * The name of the crawler to be used with this action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html#cfn-glue-trigger-action-crawlername
     */
    readonly crawlerName?: string;

    /**
     * The name of a job to be executed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html#cfn-glue-trigger-action-jobname
     */
    readonly jobName?: string;

    /**
     * Specifies configuration properties of a job run notification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html#cfn-glue-trigger-action-notificationproperty
     */
    readonly notificationProperty?: cdk.IResolvable | CfnTrigger.NotificationPropertyProperty;

    /**
     * The name of the `SecurityConfiguration` structure to be used with this action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html#cfn-glue-trigger-action-securityconfiguration
     */
    readonly securityConfiguration?: string;

    /**
     * The `JobRun` timeout in minutes.
     *
     * This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status. The default is 2,880 minutes (48 hours). This overrides the timeout value set in the parent job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-action.html#cfn-glue-trigger-action-timeout
     */
    readonly timeout?: number;
  }

  /**
   * Specifies configuration properties of a job run notification.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-notificationproperty.html
   */
  export interface NotificationPropertyProperty {
    /**
     * After a job run starts, the number of minutes to wait before sending a job run delay notification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-notificationproperty.html#cfn-glue-trigger-notificationproperty-notifydelayafter
     */
    readonly notifyDelayAfter?: number;
  }

  /**
   * Batch condition that must be met (specified number of events received or batch time window expired) before EventBridge event trigger fires.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-eventbatchingcondition.html
   */
  export interface EventBatchingConditionProperty {
    /**
     * Number of events that must be received from Amazon EventBridge before EventBridge event trigger fires.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-eventbatchingcondition.html#cfn-glue-trigger-eventbatchingcondition-batchsize
     */
    readonly batchSize: number;

    /**
     * Window of time in seconds after which EventBridge event trigger fires.
     *
     * Window starts when first event is received.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-eventbatchingcondition.html#cfn-glue-trigger-eventbatchingcondition-batchwindow
     */
    readonly batchWindow?: number;
  }

  /**
   * Defines the predicate of the trigger, which determines when it fires.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-predicate.html
   */
  export interface PredicateProperty {
    /**
     * A list of the conditions that determine when the trigger will fire.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-predicate.html#cfn-glue-trigger-predicate-conditions
     */
    readonly conditions?: Array<CfnTrigger.ConditionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An optional field if only one condition is listed.
     *
     * If multiple conditions are listed, then this field is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-predicate.html#cfn-glue-trigger-predicate-logical
     */
    readonly logical?: string;
  }

  /**
   * Defines a condition under which a trigger fires.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html
   */
  export interface ConditionProperty {
    /**
     * The name of the crawler to which this condition applies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-crawlername
     */
    readonly crawlerName?: string;

    /**
     * The state of the crawler to which this condition applies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-crawlstate
     */
    readonly crawlState?: string;

    /**
     * The name of the job whose `JobRuns` this condition applies to, and on which this trigger waits.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-jobname
     */
    readonly jobName?: string;

    /**
     * A logical operator.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-logicaloperator
     */
    readonly logicalOperator?: string;

    /**
     * The condition state.
     *
     * Currently, the values supported are `SUCCEEDED` , `STOPPED` , `TIMEOUT` , and `FAILED` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-trigger-condition.html#cfn-glue-trigger-condition-state
     */
    readonly state?: string;
  }
}

/**
 * Properties for defining a `CfnTrigger`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html
 */
export interface CfnTriggerProps {
  /**
   * The actions initiated by this trigger.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-actions
   */
  readonly actions: Array<CfnTrigger.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A description of this trigger.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-description
   */
  readonly description?: string;

  /**
   * Batch condition that must be met (specified number of events received or batch time window expired) before EventBridge event trigger fires.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-eventbatchingcondition
   */
  readonly eventBatchingCondition?: CfnTrigger.EventBatchingConditionProperty | cdk.IResolvable;

  /**
   * The name of the trigger.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-name
   */
  readonly name?: string;

  /**
   * The predicate of this trigger, which defines when it will fire.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-predicate
   */
  readonly predicate?: cdk.IResolvable | CfnTrigger.PredicateProperty;

  /**
   * A `cron` expression used to specify the schedule.
   *
   * For more information, see [Time-Based Schedules for Jobs and Crawlers](https://docs.aws.amazon.com/glue/latest/dg/monitor-data-warehouse-schedule.html) in the *AWS Glue Developer Guide* . For example, to run something every day at 12:15 UTC, specify `cron(15 12 * * ? *)` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-schedule
   */
  readonly schedule?: string;

  /**
   * Set to true to start `SCHEDULED` and `CONDITIONAL` triggers when created.
   *
   * True is not supported for `ON_DEMAND` triggers.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-startoncreation
   */
  readonly startOnCreation?: boolean | cdk.IResolvable;

  /**
   * The tags to use with this trigger.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-tags
   */
  readonly tags?: any;

  /**
   * The type of trigger that this is.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-type
   */
  readonly type: string;

  /**
   * The name of the workflow associated with the trigger.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-trigger.html#cfn-glue-trigger-workflowname
   */
  readonly workflowName?: string;
}

/**
 * Determine whether the given properties match those of a `NotificationPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationPropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTriggerNotificationPropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("notifyDelayAfter", cdk.validateNumber)(properties.notifyDelayAfter));
  return errors.wrap("supplied properties not correct for \"NotificationPropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnTriggerNotificationPropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTriggerNotificationPropertyPropertyValidator(properties).assertSuccess();
  return {
    "NotifyDelayAfter": cdk.numberToCloudFormation(properties.notifyDelayAfter)
  };
}

// @ts-ignore TS6133
function CfnTriggerNotificationPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTrigger.NotificationPropertyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrigger.NotificationPropertyProperty>();
  ret.addPropertyResult("notifyDelayAfter", "NotifyDelayAfter", (properties.NotifyDelayAfter != null ? cfn_parse.FromCloudFormation.getNumber(properties.NotifyDelayAfter) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTriggerActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arguments", cdk.validateObject)(properties.arguments));
  errors.collect(cdk.propertyValidator("crawlerName", cdk.validateString)(properties.crawlerName));
  errors.collect(cdk.propertyValidator("jobName", cdk.validateString)(properties.jobName));
  errors.collect(cdk.propertyValidator("notificationProperty", CfnTriggerNotificationPropertyPropertyValidator)(properties.notificationProperty));
  errors.collect(cdk.propertyValidator("securityConfiguration", cdk.validateString)(properties.securityConfiguration));
  errors.collect(cdk.propertyValidator("timeout", cdk.validateNumber)(properties.timeout));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTriggerActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTriggerActionPropertyValidator(properties).assertSuccess();
  return {
    "Arguments": cdk.objectToCloudFormation(properties.arguments),
    "CrawlerName": cdk.stringToCloudFormation(properties.crawlerName),
    "JobName": cdk.stringToCloudFormation(properties.jobName),
    "NotificationProperty": convertCfnTriggerNotificationPropertyPropertyToCloudFormation(properties.notificationProperty),
    "SecurityConfiguration": cdk.stringToCloudFormation(properties.securityConfiguration),
    "Timeout": cdk.numberToCloudFormation(properties.timeout)
  };
}

// @ts-ignore TS6133
function CfnTriggerActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTrigger.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrigger.ActionProperty>();
  ret.addPropertyResult("arguments", "Arguments", (properties.Arguments != null ? cfn_parse.FromCloudFormation.getAny(properties.Arguments) : undefined));
  ret.addPropertyResult("crawlerName", "CrawlerName", (properties.CrawlerName != null ? cfn_parse.FromCloudFormation.getString(properties.CrawlerName) : undefined));
  ret.addPropertyResult("jobName", "JobName", (properties.JobName != null ? cfn_parse.FromCloudFormation.getString(properties.JobName) : undefined));
  ret.addPropertyResult("notificationProperty", "NotificationProperty", (properties.NotificationProperty != null ? CfnTriggerNotificationPropertyPropertyFromCloudFormation(properties.NotificationProperty) : undefined));
  ret.addPropertyResult("securityConfiguration", "SecurityConfiguration", (properties.SecurityConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityConfiguration) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.Timeout) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventBatchingConditionProperty`
 *
 * @param properties - the TypeScript properties of a `EventBatchingConditionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTriggerEventBatchingConditionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchSize", cdk.requiredValidator)(properties.batchSize));
  errors.collect(cdk.propertyValidator("batchSize", cdk.validateNumber)(properties.batchSize));
  errors.collect(cdk.propertyValidator("batchWindow", cdk.validateNumber)(properties.batchWindow));
  return errors.wrap("supplied properties not correct for \"EventBatchingConditionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTriggerEventBatchingConditionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTriggerEventBatchingConditionPropertyValidator(properties).assertSuccess();
  return {
    "BatchSize": cdk.numberToCloudFormation(properties.batchSize),
    "BatchWindow": cdk.numberToCloudFormation(properties.batchWindow)
  };
}

// @ts-ignore TS6133
function CfnTriggerEventBatchingConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTrigger.EventBatchingConditionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrigger.EventBatchingConditionProperty>();
  ret.addPropertyResult("batchSize", "BatchSize", (properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined));
  ret.addPropertyResult("batchWindow", "BatchWindow", (properties.BatchWindow != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchWindow) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConditionProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTriggerConditionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("crawlState", cdk.validateString)(properties.crawlState));
  errors.collect(cdk.propertyValidator("crawlerName", cdk.validateString)(properties.crawlerName));
  errors.collect(cdk.propertyValidator("jobName", cdk.validateString)(properties.jobName));
  errors.collect(cdk.propertyValidator("logicalOperator", cdk.validateString)(properties.logicalOperator));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  return errors.wrap("supplied properties not correct for \"ConditionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTriggerConditionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTriggerConditionPropertyValidator(properties).assertSuccess();
  return {
    "CrawlState": cdk.stringToCloudFormation(properties.crawlState),
    "CrawlerName": cdk.stringToCloudFormation(properties.crawlerName),
    "JobName": cdk.stringToCloudFormation(properties.jobName),
    "LogicalOperator": cdk.stringToCloudFormation(properties.logicalOperator),
    "State": cdk.stringToCloudFormation(properties.state)
  };
}

// @ts-ignore TS6133
function CfnTriggerConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTrigger.ConditionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrigger.ConditionProperty>();
  ret.addPropertyResult("crawlerName", "CrawlerName", (properties.CrawlerName != null ? cfn_parse.FromCloudFormation.getString(properties.CrawlerName) : undefined));
  ret.addPropertyResult("crawlState", "CrawlState", (properties.CrawlState != null ? cfn_parse.FromCloudFormation.getString(properties.CrawlState) : undefined));
  ret.addPropertyResult("jobName", "JobName", (properties.JobName != null ? cfn_parse.FromCloudFormation.getString(properties.JobName) : undefined));
  ret.addPropertyResult("logicalOperator", "LogicalOperator", (properties.LogicalOperator != null ? cfn_parse.FromCloudFormation.getString(properties.LogicalOperator) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PredicateProperty`
 *
 * @param properties - the TypeScript properties of a `PredicateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTriggerPredicatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("conditions", cdk.listValidator(CfnTriggerConditionPropertyValidator))(properties.conditions));
  errors.collect(cdk.propertyValidator("logical", cdk.validateString)(properties.logical));
  return errors.wrap("supplied properties not correct for \"PredicateProperty\"");
}

// @ts-ignore TS6133
function convertCfnTriggerPredicatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTriggerPredicatePropertyValidator(properties).assertSuccess();
  return {
    "Conditions": cdk.listMapper(convertCfnTriggerConditionPropertyToCloudFormation)(properties.conditions),
    "Logical": cdk.stringToCloudFormation(properties.logical)
  };
}

// @ts-ignore TS6133
function CfnTriggerPredicatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTrigger.PredicateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrigger.PredicateProperty>();
  ret.addPropertyResult("conditions", "Conditions", (properties.Conditions != null ? cfn_parse.FromCloudFormation.getArray(CfnTriggerConditionPropertyFromCloudFormation)(properties.Conditions) : undefined));
  ret.addPropertyResult("logical", "Logical", (properties.Logical != null ? cfn_parse.FromCloudFormation.getString(properties.Logical) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTriggerProps`
 *
 * @param properties - the TypeScript properties of a `CfnTriggerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTriggerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.requiredValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("actions", cdk.listValidator(CfnTriggerActionPropertyValidator))(properties.actions));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("eventBatchingCondition", CfnTriggerEventBatchingConditionPropertyValidator)(properties.eventBatchingCondition));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("predicate", CfnTriggerPredicatePropertyValidator)(properties.predicate));
  errors.collect(cdk.propertyValidator("schedule", cdk.validateString)(properties.schedule));
  errors.collect(cdk.propertyValidator("startOnCreation", cdk.validateBoolean)(properties.startOnCreation));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("workflowName", cdk.validateString)(properties.workflowName));
  return errors.wrap("supplied properties not correct for \"CfnTriggerProps\"");
}

// @ts-ignore TS6133
function convertCfnTriggerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTriggerPropsValidator(properties).assertSuccess();
  return {
    "Actions": cdk.listMapper(convertCfnTriggerActionPropertyToCloudFormation)(properties.actions),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EventBatchingCondition": convertCfnTriggerEventBatchingConditionPropertyToCloudFormation(properties.eventBatchingCondition),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Predicate": convertCfnTriggerPredicatePropertyToCloudFormation(properties.predicate),
    "Schedule": cdk.stringToCloudFormation(properties.schedule),
    "StartOnCreation": cdk.booleanToCloudFormation(properties.startOnCreation),
    "Tags": cdk.objectToCloudFormation(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type),
    "WorkflowName": cdk.stringToCloudFormation(properties.workflowName)
  };
}

// @ts-ignore TS6133
function CfnTriggerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTriggerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTriggerProps>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(CfnTriggerActionPropertyFromCloudFormation)(properties.Actions) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("eventBatchingCondition", "EventBatchingCondition", (properties.EventBatchingCondition != null ? CfnTriggerEventBatchingConditionPropertyFromCloudFormation(properties.EventBatchingCondition) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("predicate", "Predicate", (properties.Predicate != null ? CfnTriggerPredicatePropertyFromCloudFormation(properties.Predicate) : undefined));
  ret.addPropertyResult("schedule", "Schedule", (properties.Schedule != null ? cfn_parse.FromCloudFormation.getString(properties.Schedule) : undefined));
  ret.addPropertyResult("startOnCreation", "StartOnCreation", (properties.StartOnCreation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.StartOnCreation) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("workflowName", "WorkflowName", (properties.WorkflowName != null ? cfn_parse.FromCloudFormation.getString(properties.WorkflowName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Glue::Workflow` is an AWS Glue resource type that manages AWS Glue workflows.
 *
 * A workflow is a container for a set of related jobs, crawlers, and triggers in AWS Glue . Using a workflow, you can design a complex multi-job extract, transform, and load (ETL) activity that AWS Glue can execute and track as single entity.
 *
 * @cloudformationResource AWS::Glue::Workflow
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-workflow.html
 */
export class CfnWorkflow extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::Workflow";

  /**
   * Build a CfnWorkflow from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkflow {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWorkflowPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWorkflow(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A collection of properties to be used as part of each execution of the workflow.
   */
  public defaultRunProperties?: any | cdk.IResolvable;

  /**
   * A description of the workflow.
   */
  public description?: string;

  /**
   * You can use this parameter to prevent unwanted multiple updates to data, to control costs, or in some cases, to prevent exceeding the maximum number of concurrent runs of any of the component jobs.
   */
  public maxConcurrentRuns?: number;

  /**
   * The name of the workflow representing the flow.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to use with this workflow.
   */
  public tagsRaw?: any;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWorkflowProps = {}) {
    super(scope, id, {
      "type": CfnWorkflow.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.defaultRunProperties = props.defaultRunProperties;
    this.description = props.description;
    this.maxConcurrentRuns = props.maxConcurrentRuns;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Glue::Workflow", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "defaultRunProperties": this.defaultRunProperties,
      "description": this.description,
      "maxConcurrentRuns": this.maxConcurrentRuns,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkflow.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWorkflowPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnWorkflow`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-workflow.html
 */
export interface CfnWorkflowProps {
  /**
   * A collection of properties to be used as part of each execution of the workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-workflow.html#cfn-glue-workflow-defaultrunproperties
   */
  readonly defaultRunProperties?: any | cdk.IResolvable;

  /**
   * A description of the workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-workflow.html#cfn-glue-workflow-description
   */
  readonly description?: string;

  /**
   * You can use this parameter to prevent unwanted multiple updates to data, to control costs, or in some cases, to prevent exceeding the maximum number of concurrent runs of any of the component jobs.
   *
   * If you leave this parameter blank, there is no limit to the number of concurrent workflow runs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-workflow.html#cfn-glue-workflow-maxconcurrentruns
   */
  readonly maxConcurrentRuns?: number;

  /**
   * The name of the workflow representing the flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-workflow.html#cfn-glue-workflow-name
   */
  readonly name?: string;

  /**
   * The tags to use with this workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-workflow.html#cfn-glue-workflow-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `CfnWorkflowProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkflowProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultRunProperties", cdk.validateObject)(properties.defaultRunProperties));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("maxConcurrentRuns", cdk.validateNumber)(properties.maxConcurrentRuns));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnWorkflowProps\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowPropsValidator(properties).assertSuccess();
  return {
    "DefaultRunProperties": cdk.objectToCloudFormation(properties.defaultRunProperties),
    "Description": cdk.stringToCloudFormation(properties.description),
    "MaxConcurrentRuns": cdk.numberToCloudFormation(properties.maxConcurrentRuns),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.objectToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnWorkflowPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflowProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflowProps>();
  ret.addPropertyResult("defaultRunProperties", "DefaultRunProperties", (properties.DefaultRunProperties != null ? cfn_parse.FromCloudFormation.getAny(properties.DefaultRunProperties) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("maxConcurrentRuns", "MaxConcurrentRuns", (properties.MaxConcurrentRuns != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxConcurrentRuns) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a custom pattern that is used to detect sensitive data across the columns and rows of your structured data.
 *
 * Each custom pattern you create specifies a regular expression and an optional list of context words. If no context words are passed only a regular expression is checked.
 *
 * @cloudformationResource AWS::Glue::CustomEntityType
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-customentitytype.html
 */
export class CfnCustomEntityType extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Glue::CustomEntityType";

  /**
   * Build a CfnCustomEntityType from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomEntityType {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCustomEntityTypePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCustomEntityType(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A list of context words.
   */
  public contextWords?: Array<string>;

  /**
   * A name for the custom pattern that allows it to be retrieved or deleted later.
   */
  public name?: string;

  /**
   * A regular expression string that is used for detecting sensitive data in a custom pattern.
   */
  public regexString?: string;

  public tags?: any;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCustomEntityTypeProps = {}) {
    super(scope, id, {
      "type": CfnCustomEntityType.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.contextWords = props.contextWords;
    this.name = props.name;
    this.regexString = props.regexString;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "contextWords": this.contextWords,
      "name": this.name,
      "regexString": this.regexString,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCustomEntityType.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCustomEntityTypePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnCustomEntityType`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-customentitytype.html
 */
export interface CfnCustomEntityTypeProps {
  /**
   * A list of context words.
   *
   * If none of these context words are found within the vicinity of the regular expression the data will not be detected as sensitive data.
   *
   * If no context words are passed only a regular expression is checked.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-customentitytype.html#cfn-glue-customentitytype-contextwords
   */
  readonly contextWords?: Array<string>;

  /**
   * A name for the custom pattern that allows it to be retrieved or deleted later.
   *
   * This name must be unique per AWS account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-customentitytype.html#cfn-glue-customentitytype-name
   */
  readonly name?: string;

  /**
   * A regular expression string that is used for detecting sensitive data in a custom pattern.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-customentitytype.html#cfn-glue-customentitytype-regexstring
   */
  readonly regexString?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-customentitytype.html#cfn-glue-customentitytype-tags
   */
  readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `CfnCustomEntityTypeProps`
 *
 * @param properties - the TypeScript properties of a `CfnCustomEntityTypeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomEntityTypePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contextWords", cdk.listValidator(cdk.validateString))(properties.contextWords));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("regexString", cdk.validateString)(properties.regexString));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCustomEntityTypeProps\"");
}

// @ts-ignore TS6133
function convertCfnCustomEntityTypePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomEntityTypePropsValidator(properties).assertSuccess();
  return {
    "ContextWords": cdk.listMapper(cdk.stringToCloudFormation)(properties.contextWords),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RegexString": cdk.stringToCloudFormation(properties.regexString),
    "Tags": cdk.objectToCloudFormation(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCustomEntityTypePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomEntityTypeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomEntityTypeProps>();
  ret.addPropertyResult("contextWords", "ContextWords", (properties.ContextWords != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ContextWords) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("regexString", "RegexString", (properties.RegexString != null ? cfn_parse.FromCloudFormation.getString(properties.RegexString) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}