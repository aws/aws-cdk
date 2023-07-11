export enum VariableInputType {
  /**
   * Freeform text input box
   */
  INPUT = 'input',

  /**
   * A dropdown of pre-defined values, or values filled in from a metric search query
   */
  RADIO = 'radio',

  /**
   * A set of pre-defined radio buttons, which can also be defined from a metric search query
   */
  SELECT = 'select',
}

export enum VariableType {
  /**
   * A property variable changes the values of all instances of a property in the list of widgets in the dashboard.
   */
  PROPERTY = 'property',

  /**
   * A pattern variable is one that changes a regex pattern across the dashboard JSON
   */
  PATTERN = 'pattern',
}

/**
 * A single dashboard variable
 */
export interface IVariable {
  /**
   * Return the variable JSON for use in the dashboard
   */
  toJson(): any;
}

/**
 * Default value for use with dashboard variables
 */
export class DefaultValue {

  /**
   * A special value for use with {@link SearchDashboardVariable} to have the default value be the first value returned from search
   */
  public static readonly FIRST = new DefaultValue('__FIRST');

  /**
   * Create a default value
   * @param value the value to be used as default
   */
  public static of(value: any) {
    return new DefaultValue(value);
  }

  private constructor(public readonly value: any) { }
}

export interface DashboardVariableOptions {
  /**
   * Type of the variable
   */
  readonly type: VariableType;

  /**
   * The way the variable value is selected
   */
  readonly inputType: VariableInputType;

  /**
   * Pattern or property value to replace
   */
  readonly value: string;

  /**
   * Unique id
   */
  readonly id: string;

  /**
   * Optional label in the toolbar
   *
   * @default - the variable's value
   */
  readonly label?: string;

  /**
   * Optional default value
   *
   * @default - no default value is set
   */
  readonly defaultValue?: DefaultValue;

  /**
   * Whether the variable is visible
   *
   * @default - true
   */
  readonly visible?: boolean;
}

export abstract class DashboardVariable implements IVariable {
  private readonly baseOptions: DashboardVariableOptions;

  protected constructor(options: DashboardVariableOptions) {
    this.baseOptions = options;
  }

  toJson(): any {
    return {
      [this.baseOptions.type]: this.baseOptions.value,
      type: this.baseOptions.type,
      inputType: this.baseOptions.inputType,
      id: this.baseOptions.id,
      defaultValue: this.baseOptions.defaultValue?.value,
      visible: this.baseOptions.visible,
      label: this.baseOptions.label,
    };
  }
}

export interface VariableValue {
  /**
   * Optional label for the selected item
   *
   * @default - the variable's value
   */
  readonly label?: string;

  /**
   * Value of the selected item
   */
  readonly value: string;
}

/**
 * Options for {@link ValueDashboardVariable}
 */
export interface ValueDashboardVariableOptions extends DashboardVariableOptions {
  /**
   * List of custom values for the variable.
   * It is required for variables of types {@link VariableInputType.RADIO} and {@link VariableInputType.SELECT}
   *
   * @default - no values
   */
  readonly values?: VariableValue[];
}

/**
 * A dashboard variable supporting all {@link VariableInputType}.
 */
export class ValueDashboardVariable extends DashboardVariable {
  private readonly options: ValueDashboardVariableOptions;

  constructor(options: ValueDashboardVariableOptions) {
    super(options);
    if (options.inputType != VariableInputType.INPUT && (options.values || []).length == 0) {
      throw new Error(`Variable with input type ${options.inputType} requires values to be provided.`);
    }
    this.options = options;
  }

  toJson(): any {
    const base = super.toJson();
    return {
      ...base,
      values: this.options.values ? this.options.values.map(value => ({ label: value.label, value: value.value })) : undefined,
    };
  }
}

/**
 * A helper class to build the necessary search expression for populating values for use with {@link SearchDashboardVariable}
 */
export class SearchValues {
  /**
   * Create values from the dimension specified by populateFrom, that is used in the search expression built using namespace, dimensions and metricName, and populate value
   */
  public static from(namespace: string, dimensions: string[], metricName: string, populateFrom: string) {
    if (dimensions.length === 0) {
      throw new Error('Empty dimensions provided. Please specify one dimension at least');
    }
    if (!dimensions.includes(populateFrom)) {
      throw new Error(`populateFrom (${populateFrom}) is not present in dimensions`);
    }
    const components = [namespace, ...dimensions];
    return new SearchValues(`{${components.join(',')}} MetricName=\"${metricName}\"`, populateFrom);
  }

  /**
   * Create a search expression for use
   *
   * @param expression search expression that specifies a namespace, dimension name(s) and a metric name. For example `{AWS/EC2,InstanceId} MetricName=\"CPUUtilization\"`
   * @param populateFrom dimension the dimension name, that the search expression retrieves, whose values will be used to populate the values to choose from. For example `InstanceId`
   */
  public constructor(public readonly expression: string, public readonly populateFrom: string) { }
}

/**
 * Options for {@link SearchDashboardVariable}
 */
export interface SearchDashboardVariableOptions extends DashboardVariableOptions {
  /**
   * Values to populate {@link SearchDashboardVariable}
   */
  readonly values: SearchValues;
}

/**
 * A dashboard variable with inputType {@link VariableInputType.SELECT} or {@link VariableInputType.RADIO} that populates
 * the list of choices from a specific dimension in the given search expression
 */
export class SearchDashboardVariable extends DashboardVariable {
  private readonly options: SearchDashboardVariableOptions;

  constructor(options: SearchDashboardVariableOptions) {
    super(options);
    if (options.inputType === VariableInputType.INPUT) {
      throw new Error('Unsupported inputType INPUT. Please choose either SELECT or RADIO');
    }
    this.options = options;
  }

  toJson(): any {
    const base = super.toJson();
    return {
      ...base,
      search: this.options.values.expression,
      populateFrom: this.options.values.populateFrom,
    };
  }
}
