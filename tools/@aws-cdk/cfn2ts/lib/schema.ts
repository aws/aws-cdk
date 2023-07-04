/**
 * A Schema is a JSON document that describes the CloudFormation resource
 * constructs included in a library, for use with the `noctilucent` tool to
 * improve the quality of translations from CloudFormation remplates to AWS CDK
 * applications using the L1 constructs.
 */
export interface Schema {
  /**
   * For each supported CloudFormation Resource Type Name (e.g:
   * `AWS::S3::Bucket`), a `CfnResource` object describes the construct present
   * in the `aws-cdk-lib` library.
   */
  readonly resources: Map<string, CfnResource>,

  /**
   * For each non-construct type referenced by a property or attribute of a
   * `CfnResource`, a `LibraryType` object provides additional information about
   * the specified type's structure.
   */
  readonly types: Map<string, DataType>,

  /**
   * The version of the `aws-cdk-lib` package that this schema corresponds to.
   */
  readonly version?: string;
}

/**
 * Information about a CfnResource construct.
 */
export interface CfnResource {
  /**
   * The language-specific names of the construct class.
   */
  readonly construct: TypeName;

  /**
   * The list of properties accepted by the construct's constructor, indexed on
   * their CloudFormation name.
   */
  readonly properties: Map<string, Property>;

  /**
   * The list of attributes exposed by the construct, indexed on their
   * CloudFormation name.
   */
  readonly attributes: Map<string, Property>;
}

/**
 * A language-aware type name.
 */
export interface TypeName {
  /**
   * The TypeScript type name.
   */
  readonly ts: {
    /** The module from which the type is exported */
    readonly module: string;
    /** The name of the type in the module */
    readonly name: string;
  };

  /**
   * The .NET type name.
   */
  readonly dotnet: {
    /** The namespace from which the type is exported */
    readonly ns: string;
    /** The name of the type in the namespace */
    readonly name: string;
  };

  /**
   * The Go type name.
   */
  readonly go: {
    /** The name of the module from which the type is exported */
    readonly module: string;
    /** The name of the package found in the module */
    readonly package: string;
    /** The name of the type in the package */
    readonly name: string;
  };

  /**
   * The Java type name.
   */
  readonly java: {
    /** The name of the package from which the type is exported. */
    readonly package: string;
    /** The name of the type in the package */
    readonly name: string;
  };

  /**
   * The Python type name.
   */
  readonly python: {
    /** The name of the module from which the type is exported */
    readonly module: string;
    /** The name of the type in the module */
    readonly name: string;
  };
}

/**
 * A struct type.
 */
export interface DataType {
  /**
   * The name of the type.
   */
  readonly name: TypeName;

  /**
   * The properties exposed by this struct type, indexed on their CloudFormation
   * name.
   */
  readonly properties: Map<string, Property>;
}

/**
 * Information about a property as exposed by a construct or struct.
 */
export interface Property {
  /**
   * The name of the property in the TypeScript interface.
   */
  readonly name: string;

  /**
   * Whether the property may be null/undefined.
   *
   * @default false
   */
  readonly nullable?: boolean;

  /**
   * The type of the value exposed or accepted by this property.
   */
  readonly valueType: TypeReference;
}

/**
 * A schema value type.
 */
export type TypeReference = Primitive | ListOf | MapOf | Named | Union;
export interface Primitive {
  readonly primitive: 'boolean' | 'date' | 'json' | 'number' | 'string' | 'unknown';
}
export interface ListOf {
  readonly listOf: TypeReference;
}
export interface MapOf {
  readonly mapOf: TypeReference;
}
export interface Named {
  readonly named: string;
}
export interface Union {
  readonly union: TypeReference[];
}
