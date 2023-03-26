import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnAllowList`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html
 */
export interface CfnAllowListProps {
    /**
     * The criteria that specify the text or text pattern to ignore. The criteria can be the location and name of an Amazon S3 object that lists specific text to ignore ( `S3WordsList` ), or a regular expression ( `Regex` ) that defines a text pattern to ignore.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html#cfn-macie-allowlist-criteria
     */
    readonly criteria: CfnAllowList.CriteriaProperty | cdk.IResolvable;
    /**
     * A custom name for the allow list. The name can contain 1-128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html#cfn-macie-allowlist-name
     */
    readonly name: string;
    /**
     * A custom description of the allow list. The description can contain 1-512 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html#cfn-macie-allowlist-description
     */
    readonly description?: string;
    /**
     * An array of key-value pairs to apply to the allow list.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html#cfn-macie-allowlist-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::Macie::AllowList`
 *
 * The `AWS::Macie::AllowList` resource specifies an allow list. In Amazon Macie , an allow list defines specific text or a text pattern for Macie to ignore when it inspects data sources for sensitive data. If data matches text or a text pattern in an allow list, Macie doesn’t report the data in sensitive data findings or sensitive data discovery results, even if the data matches the criteria of a custom data identifier or a managed data identifier. You can create and use allow lists in all the AWS Regions where Macie is currently available except the Asia Pacific (Osaka) Region.
 *
 * Macie supports two types of allow lists:
 *
 * - *Predefined text* - For this type of list ( `S3WordsList` ), you create a line-delimited plaintext file that lists specific text to ignore, and you store the file in an Amazon Simple Storage Service ( Amazon S3 ) bucket. You then configure settings for Macie to access the list in the bucket.
 *
 * This type of list typically contains specific words, phrases, and other kinds of character sequences that aren’t sensitive, aren't likely to change, and don’t necessarily adhere to a common pattern. If you use this type of list, Macie doesn't report occurrences of text that exactly match a complete entry in the list. Macie treats each entry in the list as a string literal value. Matches aren't case sensitive.
 * - *Regular expression* - For this type of list ( `Regex` ), you specify a regular expression that defines a text pattern to ignore. Unlike an allow list with predefined text, you store the regex and all other list settings in Macie .
 *
 * This type of list is helpful if you want to specify text that isn’t sensitive but varies or is likely to change while also adhering to a common pattern. If you use this type of list, Macie doesn't report occurrences of text that completely match the pattern defined by the list.
 *
 * For more information, see [Defining sensitive data exceptions with allow lists](https://docs.aws.amazon.com/macie/latest/user/allow-lists.html) in the *Amazon Macie User Guide* .
 *
 * An `AWS::Macie::Session` resource must exist for an AWS account before you can create an `AWS::Macie::AllowList` resource for the account. Use a [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to ensure that an `AWS::Macie::Session` resource is created before other Macie resources are created for an account. For example, `"DependsOn": "Session"` .
 *
 * @cloudformationResource AWS::Macie::AllowList
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html
 */
export declare class CfnAllowList extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Macie::AllowList";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAllowList;
    /**
     * The Amazon Resource Name (ARN) of the allow list.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The unique identifier for the allow list.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The current status of the allow list, which indicates whether Amazon Macie can access and use the list's criteria. If the list's criteria specify a regular expression ( `Regex` ), this value is typically `OK` . Macie can compile the expression. If the list's criteria specify an Amazon S3 object ( `S3WordsList` ), possible values are:
     *
     * - `OK` - Macie can retrieve and parse the contents of the object.
     * - `S3_OBJECT_ACCESS_DENIED` - Macie isn't allowed to access the object or the object is encrypted with a customer managed AWS KMS key that Macie isn't allowed to use. Check the bucket policy and other permissions settings for the bucket and the object. If the object is encrypted, also ensure that it's encrypted with a key that Macie is allowed to use.
     * - `S3_OBJECT_EMPTY` - Macie can retrieve the object but the object doesn't contain any content. Ensure that the object contains the correct entries. Also ensure that the list's criteria specify the correct bucket and object names.
     * - `S3_OBJECT_NOT_FOUND` - The object doesn't exist in Amazon S3 . Ensure that the list's criteria specify the correct bucket and object names.
     * - `S3_OBJECT_OVERSIZE` - Macie can retrieve the object. However, the object contains too many entries or its storage size exceeds the quota for an allow list. Try breaking the list into multiple files and ensure that each file doesn't exceed any quotas. Then configure list settings in Macie for each file.
     * - `S3_THROTTLED` - Amazon S3 throttled the request to retrieve the object. Wait a few minutes and then try again.
     * - `S3_USER_ACCESS_DENIED` - Amazon S3 denied the request to retrieve the object. If the specified object exists, you're not allowed to access it or it's encrypted with an AWS KMS key that you're not allowed to use. Work with your AWS administrator to ensure that the list's criteria specify the correct bucket and object names, and you have read access to the bucket and the object. If the object is encrypted, also ensure that it's encrypted with a key that you're allowed to use.
     * - `UNKNOWN_ERROR` - A transient or internal error occurred when Macie attempted to retrieve or parse the object. Wait a few minutes and then try again. A list can also have this status if it's encrypted with a key that Amazon S3 and Macie can't access or use.
     *
     * For more information, see [Allow list options and requirements](https://docs.aws.amazon.com/macie/latest/user/allow-lists-options.html) in the *Amazon Macie User Guide* .
     * @cloudformationAttribute Status
     */
    readonly attrStatus: string;
    /**
     * The criteria that specify the text or text pattern to ignore. The criteria can be the location and name of an Amazon S3 object that lists specific text to ignore ( `S3WordsList` ), or a regular expression ( `Regex` ) that defines a text pattern to ignore.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html#cfn-macie-allowlist-criteria
     */
    criteria: CfnAllowList.CriteriaProperty | cdk.IResolvable;
    /**
     * A custom name for the allow list. The name can contain 1-128 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html#cfn-macie-allowlist-name
     */
    name: string;
    /**
     * A custom description of the allow list. The description can contain 1-512 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html#cfn-macie-allowlist-description
     */
    description: string | undefined;
    /**
     * An array of key-value pairs to apply to the allow list.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html#cfn-macie-allowlist-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Macie::AllowList`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAllowListProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnAllowList {
    /**
     * Specifies the criteria for an allow list, which is a list that defines specific text or a text pattern to ignore when inspecting data sources for sensitive data. The criteria can be:
     *
     * - The location and name of an Amazon Simple Storage Service ( Amazon S3 ) object that lists specific, predefined text to ignore ( `S3WordsList` ), or
     * - A regular expression ( `Regex` ) that defines a text pattern to ignore.
     *
     * The criteria must specify either an S3 object or a regular expression. It can't specify both.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-allowlist-criteria.html
     */
    interface CriteriaProperty {
        /**
         * The regular expression ( *regex* ) that defines the text pattern to ignore. The expression can contain 1-512 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-allowlist-criteria.html#cfn-macie-allowlist-criteria-regex
         */
        readonly regex?: string;
        /**
         * The location and name of an Amazon S3 object that lists specific text to ignore.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-allowlist-criteria.html#cfn-macie-allowlist-criteria-s3wordslist
         */
        readonly s3WordsList?: CfnAllowList.S3WordsListProperty | cdk.IResolvable;
    }
}
export declare namespace CfnAllowList {
    /**
     * Specifies the location and name of an Amazon Simple Storage Service ( Amazon S3 ) object that lists specific, predefined text to ignore when inspecting data sources for sensitive data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-allowlist-s3wordslist.html
     */
    interface S3WordsListProperty {
        /**
         * The full name of the S3 bucket that contains the object. This value correlates to the `Name` field of a bucket's properties in Amazon S3 .
         *
         * This value is case sensitive. In addition, don't use wildcard characters or specify partial values for the name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-allowlist-s3wordslist.html#cfn-macie-allowlist-s3wordslist-bucketname
         */
        readonly bucketName: string;
        /**
         * The full name of the S3 object. This value correlates to the `Key` field of an object's properties in Amazon S3 . If the name includes a path, include the complete path. For example, `AllowLists/Macie/MyList.txt` .
         *
         * This value is case sensitive. In addition, don't use wildcard characters or specify partial values for the name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-allowlist-s3wordslist.html#cfn-macie-allowlist-s3wordslist-objectkey
         */
        readonly objectKey: string;
    }
}
/**
 * Properties for defining a `CfnCustomDataIdentifier`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html
 */
export interface CfnCustomDataIdentifierProps {
    /**
     * A custom name for the custom data identifier. The name can contain 1-128 characters.
     *
     * Avoid including sensitive data in the name of a custom data identifier. Users of the account might be able to see the name, depending on the actions that they're allowed to perform in Amazon Macie .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-name
     */
    readonly name: string;
    /**
     * The regular expression ( *regex* ) that defines the text pattern to match. The expression can contain 1-512 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-regex
     */
    readonly regex: string;
    /**
     * A custom description of the custom data identifier. The description can contain 1-512 characters.
     *
     * Avoid including sensitive data in the description. Users of the account might be able to see the description, depending on the actions that they're allowed to perform in Amazon Macie .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-description
     */
    readonly description?: string;
    /**
     * An array of character sequences ( *ignore words* ) to exclude from the results. If text matches the regular expression ( `Regex` ) but it contains a string in this array, Amazon Macie ignores the text and doesn't include it in the results.
     *
     * The array can contain 1-10 ignore words. Each ignore word can contain 4-90 UTF-8 characters. Ignore words are case sensitive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-ignorewords
     */
    readonly ignoreWords?: string[];
    /**
     * An array of character sequences ( *keywords* ), one of which must precede and be in proximity ( `MaximumMatchDistance` ) of the regular expression ( `Regex` ) to match.
     *
     * The array can contain 1-50 keywords. Each keyword can contain 3-90 UTF-8 characters. Keywords aren't case sensitive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-keywords
     */
    readonly keywords?: string[];
    /**
     * The maximum number of characters that can exist between the end of at least one complete character sequence specified by the `Keywords` array and the end of text that matches the regular expression ( `Regex` ). If a complete keyword precedes all the text that matches the regular expression and the keyword is within the specified distance, Amazon Macie includes the result.
     *
     * The distance can be 1-300 characters. The default value is 50.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-maximummatchdistance
     */
    readonly maximumMatchDistance?: number;
}
/**
 * A CloudFormation `AWS::Macie::CustomDataIdentifier`
 *
 * The `AWS::Macie::CustomDataIdentifier` resource specifies a custom data identifier. A *custom data identifier* is a set of custom criteria for Amazon Macie to use when it inspects data sources for sensitive data. The criteria consist of a regular expression ( *regex* ) that defines a text pattern to match and, optionally, character sequences and a proximity rule that refine the results. The character sequences can be:
 *
 * - *Keywords* , which are words or phrases that must be in proximity of text that matches the regex, or
 * - *Ignore words* , which are words or phrases to exclude from the results.
 *
 * By using custom data identifiers, you can supplement the managed data identifiers that Macie provides and detect sensitive data that reflects your particular scenarios, intellectual property, or proprietary data. For more information, see [Building custom data identifiers](https://docs.aws.amazon.com/macie/latest/user/custom-data-identifiers.html) in the *Amazon Macie User Guide* .
 *
 * An `AWS::Macie::Session` resource must exist for an AWS account before you can create an `AWS::Macie::CustomDataIdentifier` resource for the account. Use a [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to ensure that an `AWS::Macie::Session` resource is created before other Macie resources are created for an account. For example, `"DependsOn": "Session"` .
 *
 * @cloudformationResource AWS::Macie::CustomDataIdentifier
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html
 */
export declare class CfnCustomDataIdentifier extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Macie::CustomDataIdentifier";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomDataIdentifier;
    /**
     * The Amazon Resource Name (ARN) of the custom data identifier.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The unique identifier for the custom data identifier.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * A custom name for the custom data identifier. The name can contain 1-128 characters.
     *
     * Avoid including sensitive data in the name of a custom data identifier. Users of the account might be able to see the name, depending on the actions that they're allowed to perform in Amazon Macie .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-name
     */
    name: string;
    /**
     * The regular expression ( *regex* ) that defines the text pattern to match. The expression can contain 1-512 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-regex
     */
    regex: string;
    /**
     * A custom description of the custom data identifier. The description can contain 1-512 characters.
     *
     * Avoid including sensitive data in the description. Users of the account might be able to see the description, depending on the actions that they're allowed to perform in Amazon Macie .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-description
     */
    description: string | undefined;
    /**
     * An array of character sequences ( *ignore words* ) to exclude from the results. If text matches the regular expression ( `Regex` ) but it contains a string in this array, Amazon Macie ignores the text and doesn't include it in the results.
     *
     * The array can contain 1-10 ignore words. Each ignore word can contain 4-90 UTF-8 characters. Ignore words are case sensitive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-ignorewords
     */
    ignoreWords: string[] | undefined;
    /**
     * An array of character sequences ( *keywords* ), one of which must precede and be in proximity ( `MaximumMatchDistance` ) of the regular expression ( `Regex` ) to match.
     *
     * The array can contain 1-50 keywords. Each keyword can contain 3-90 UTF-8 characters. Keywords aren't case sensitive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-keywords
     */
    keywords: string[] | undefined;
    /**
     * The maximum number of characters that can exist between the end of at least one complete character sequence specified by the `Keywords` array and the end of text that matches the regular expression ( `Regex` ). If a complete keyword precedes all the text that matches the regular expression and the keyword is within the specified distance, Amazon Macie includes the result.
     *
     * The distance can be 1-300 characters. The default value is 50.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-maximummatchdistance
     */
    maximumMatchDistance: number | undefined;
    /**
     * Create a new `AWS::Macie::CustomDataIdentifier`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCustomDataIdentifierProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
/**
 * Properties for defining a `CfnFindingsFilter`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html
 */
export interface CfnFindingsFilterProps {
    /**
     * The criteria to use to filter findings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-findingcriteria
     */
    readonly findingCriteria: CfnFindingsFilter.FindingCriteriaProperty | cdk.IResolvable;
    /**
     * A custom name for the findings filter. The name can contain 3-64 characters.
     *
     * Avoid including sensitive data in the name. Users of the account might be able to see the name, depending on the actions that they're allowed to perform in Amazon Macie .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-name
     */
    readonly name: string;
    /**
     * The action to perform on findings that match the filter criteria ( `FindingCriteria` ). Valid values are:
     *
     * - `ARCHIVE` - Suppress (automatically archive) the findings.
     * - `NOOP` - Don't perform any action on the findings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-action
     */
    readonly action?: string;
    /**
     * A custom description of the findings filter. The description can contain 1-512 characters.
     *
     * Avoid including sensitive data in the description. Users of the account might be able to see the description, depending on the actions that they're allowed to perform in Amazon Macie .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-description
     */
    readonly description?: string;
    /**
     * The position of the findings filter in the list of saved filters on the Amazon Macie console. This value also determines the order in which the filter is applied to findings, relative to other filters that are also applied to findings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-position
     */
    readonly position?: number;
}
/**
 * A CloudFormation `AWS::Macie::FindingsFilter`
 *
 * The `AWS::Macie::FindingsFilter` resource specifies a findings filter. In Amazon Macie , a *findings filter* , also referred to as a *filter rule* , is a set of custom criteria that specifies which findings to include or exclude from the results of a query for findings. The criteria can help you identify and focus on findings that have specific characteristics, such as severity, type, or the name of an affected AWS resource. You can also configure a findings filter to suppress (automatically archive) findings that match the filter's criteria. For more information, see [Filtering findings](https://docs.aws.amazon.com/macie/latest/user/findings-filter-overview.html) in the *Amazon Macie User Guide* .
 *
 * An `AWS::Macie::Session` resource must exist for an AWS account before you can create an `AWS::Macie::FindingsFilter` resource for the account. Use a [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to ensure that an `AWS::Macie::Session` resource is created before other Macie resources are created for an account. For example, `"DependsOn": "Session"` .
 *
 * @cloudformationResource AWS::Macie::FindingsFilter
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html
 */
export declare class CfnFindingsFilter extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Macie::FindingsFilter";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFindingsFilter;
    /**
     * The Amazon Resource Name (ARN) of the findings filter.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * An array of `FindingsFilterListItem` objects, one for each findings filter that's associated with the account.
     * @cloudformationAttribute FindingsFilterListItems
     */
    readonly attrFindingsFilterListItems: cdk.IResolvable;
    /**
     * The unique identifier for the findings filter.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The criteria to use to filter findings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-findingcriteria
     */
    findingCriteria: CfnFindingsFilter.FindingCriteriaProperty | cdk.IResolvable;
    /**
     * A custom name for the findings filter. The name can contain 3-64 characters.
     *
     * Avoid including sensitive data in the name. Users of the account might be able to see the name, depending on the actions that they're allowed to perform in Amazon Macie .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-name
     */
    name: string;
    /**
     * The action to perform on findings that match the filter criteria ( `FindingCriteria` ). Valid values are:
     *
     * - `ARCHIVE` - Suppress (automatically archive) the findings.
     * - `NOOP` - Don't perform any action on the findings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-action
     */
    action: string | undefined;
    /**
     * A custom description of the findings filter. The description can contain 1-512 characters.
     *
     * Avoid including sensitive data in the description. Users of the account might be able to see the description, depending on the actions that they're allowed to perform in Amazon Macie .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-description
     */
    description: string | undefined;
    /**
     * The position of the findings filter in the list of saved filters on the Amazon Macie console. This value also determines the order in which the filter is applied to findings, relative to other filters that are also applied to findings.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-position
     */
    position: number | undefined;
    /**
     * Create a new `AWS::Macie::FindingsFilter`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFindingsFilterProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnFindingsFilter {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-criterionadditionalproperties.html
     */
    interface CriterionAdditionalPropertiesProperty {
        /**
         * `CfnFindingsFilter.CriterionAdditionalPropertiesProperty.eq`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-criterionadditionalproperties.html#cfn-macie-findingsfilter-criterionadditionalproperties-eq
         */
        readonly eq?: string[];
        /**
         * `CfnFindingsFilter.CriterionAdditionalPropertiesProperty.gt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-criterionadditionalproperties.html#cfn-macie-findingsfilter-criterionadditionalproperties-gt
         */
        readonly gt?: number;
        /**
         * `CfnFindingsFilter.CriterionAdditionalPropertiesProperty.gte`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-criterionadditionalproperties.html#cfn-macie-findingsfilter-criterionadditionalproperties-gte
         */
        readonly gte?: number;
        /**
         * `CfnFindingsFilter.CriterionAdditionalPropertiesProperty.lt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-criterionadditionalproperties.html#cfn-macie-findingsfilter-criterionadditionalproperties-lt
         */
        readonly lt?: number;
        /**
         * `CfnFindingsFilter.CriterionAdditionalPropertiesProperty.lte`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-criterionadditionalproperties.html#cfn-macie-findingsfilter-criterionadditionalproperties-lte
         */
        readonly lte?: number;
        /**
         * `CfnFindingsFilter.CriterionAdditionalPropertiesProperty.neq`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-criterionadditionalproperties.html#cfn-macie-findingsfilter-criterionadditionalproperties-neq
         */
        readonly neq?: string[];
    }
}
export declare namespace CfnFindingsFilter {
    /**
     * Specifies, as a map, one or more property-based conditions that filter the results of a query for findings. For more information, see [Filtering findings](https://docs.aws.amazon.com/macie/latest/user/findings-filter-overview.html) in the *Amazon Macie User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-findingcriteria.html
     */
    interface FindingCriteriaProperty {
        /**
         * Specifies a condition that defines the property, operator, and one or more values to use to filter the results.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-findingcriteria.html#cfn-macie-findingsfilter-findingcriteria-criterion
         */
        readonly criterion?: {
            [key: string]: (CfnFindingsFilter.CriterionAdditionalPropertiesProperty | cdk.IResolvable);
        } | cdk.IResolvable;
    }
}
export declare namespace CfnFindingsFilter {
    /**
     * Specifies the unique identifier and custom name of a findings filter.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-findingsfilterlistitem.html
     */
    interface FindingsFilterListItemProperty {
        /**
         * The unique identifier for the findings filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-findingsfilterlistitem.html#cfn-macie-findingsfilter-findingsfilterlistitem-id
         */
        readonly id?: string;
        /**
         * The custom name of the findings filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-findingsfilterlistitem.html#cfn-macie-findingsfilter-findingsfilterlistitem-name
         */
        readonly name?: string;
    }
}
/**
 * Properties for defining a `CfnSession`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-session.html
 */
export interface CfnSessionProps {
    /**
     * Specifies how often Amazon Macie publishes updates to policy findings for the account. This includes publishing updates to AWS Security Hub and Amazon EventBridge (formerly Amazon CloudWatch Events ). Valid values are:
     *
     * - FIFTEEN_MINUTES
     * - ONE_HOUR
     * - SIX_HOURS
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-session.html#cfn-macie-session-findingpublishingfrequency
     */
    readonly findingPublishingFrequency?: string;
    /**
     * The status of Amazon Macie for the account. Valid values are: `ENABLED` , start or resume all Macie activities for the account; and, `PAUSED` , suspend all Macie activities for the account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-session.html#cfn-macie-session-status
     */
    readonly status?: string;
}
/**
 * A CloudFormation `AWS::Macie::Session`
 *
 * The `AWS::Macie::Session` resource represents the Amazon Macie service and certain configuration settings for an Amazon Macie account in a specific AWS Region . It enables Macie to become operational for a specific account in a specific Region. An account can have only one session in each Region.
 *
 * You must create an `AWS::Macie::Session` resource for an account before you can create other types of resources for the account. Use a [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to ensure that an `AWS::Macie::Session` resource is created before other Macie resources are created for an account. For example, `"DependsOn": "Session"` .
 *
 * @cloudformationResource AWS::Macie::Session
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-session.html
 */
export declare class CfnSession extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Macie::Session";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSession;
    /**
     * The account ID for the AWS account in which the Amazon Macie session is created.
     * @cloudformationAttribute AwsAccountId
     */
    readonly attrAwsAccountId: string;
    /**
     * The Amazon Resource Name (ARN) of the service-linked role that allows Amazon Macie to monitor and analyze data in AWS resources for the account.
     * @cloudformationAttribute ServiceRole
     */
    readonly attrServiceRole: string;
    /**
     * Specifies how often Amazon Macie publishes updates to policy findings for the account. This includes publishing updates to AWS Security Hub and Amazon EventBridge (formerly Amazon CloudWatch Events ). Valid values are:
     *
     * - FIFTEEN_MINUTES
     * - ONE_HOUR
     * - SIX_HOURS
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-session.html#cfn-macie-session-findingpublishingfrequency
     */
    findingPublishingFrequency: string | undefined;
    /**
     * The status of Amazon Macie for the account. Valid values are: `ENABLED` , start or resume all Macie activities for the account; and, `PAUSED` , suspend all Macie activities for the account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-session.html#cfn-macie-session-status
     */
    status: string | undefined;
    /**
     * Create a new `AWS::Macie::Session`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnSessionProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
