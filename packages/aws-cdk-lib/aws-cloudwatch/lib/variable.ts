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
 * Search components for use with {@link Values.fromSearchComponents}
 */
export interface SearchComponents {
  /**
   * The namespace to be used in the search expression
   */
  readonly namespace: string;

  /**
   * The list of dimensions to be used in the search expression
   */
  readonly dimensions: string[];

  /**
   * The metric name to be used in the search expression
   */
  readonly metricName: string;

  /**
   * The dimension name, that the search expression retrieves, whose values will be used to populate the values to choose from
   */
  readonly populateFrom: string;
}

/**
 * A class for providing values for use with {@link VariableInputType.SELECT} and {@link VariableInputType.RADIO} dashboard variables
 */
export abstract class Values {
  /**
   * Create values from the components of search expression
   */
  public static fromSearchComponents(components: SearchComponents): Values {
    if (components.dimensions.length === 0) {
      throw new Error('Empty dimensions provided. Please specify one dimension at least');
    }
    if (!components.dimensions.includes(components.populateFrom)) {
      throw new Error(`populateFrom (${components.populateFrom}) is not present in dimensions`);
    }
    const metricSchema = [components.namespace, ...components.dimensions];
    return Values.fromSearch(`{${metricSchema.join(',')}} MetricName=\"${components.metricName}\"`, components.populateFrom);
  }

  /**
   * Create values from a search expression
   *
   * @param expression search expression that specifies a namespace, dimension name(s) and a metric name. For example `{AWS/EC2,InstanceId} MetricName=\"CPUUtilization\"`
   * @param populateFrom dimension the dimension name, that the search expression retrieves, whose values will be used to populate the values to choose from. For example `InstanceId`
   */
  public static fromSearch(expression: string, populateFrom: string): Values {
    return new SearchValues(expression, populateFrom);
  }

  /**
   * Create values from an array of possible variable values
   */
  public static fromValues(...values: VariableValue[]): Values {
    if (values.length == 0) {
      throw new Error('Empty values is not allowed');
    }
    return new StaticValues(values);
  }

  public abstract toJson(): any;
}

class StaticValues extends Values {
  constructor(private readonly values: VariableValue[]) {
    super();
  }

  toJson(): any {
    return {
      values: this.values.map(value => ({ label: value.label, value: value.value })),
    };
  }
}

class SearchValues extends Values {
  /**
   * Create a search expression for use
   *
   * @param expression search expression that specifies a namespace, dimension name(s) and a metric name. For example `{AWS/EC2,InstanceId} MetricName=\"CPUUtilization\"`
   * @param populateFrom dimension the dimension name, that the search expression retrieves, whose values will be used to populate the values to choose from. For example `InstanceId`
   */
  public constructor(public readonly expression: string, public readonly populateFrom: string) {
    super();
  }

  toJson(): any {
    return {
      search: this.expression,
      populateFrom: this.populateFrom,
    };
  }
}

/**
 * Default value for use in {@link DashboardVariableOptions}
 */
export class DefaultValue {
  /**
   * A special value for use with search expressions to have the default value be the first value returned from search
   */
  public static readonly FIRST = new DefaultValue('__FIRST');

  /**
   * Create a default value
   * @param value the value to be used as default
   */
  public static value(value: any) {
    return new DefaultValue(value);
  }

  private constructor(public readonly val: any) { }
}

/**
 * Options for {@link DashboardVariable}
 */
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
   * Optional values (required for {@link VariableInputType.RADIO} and {@link VariableInputType.SELECT} dashboard variables).
   *
   * @default - no values
   */
  readonly values?: Values;

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

/**
 * Dashboard Variable
 */
export class DashboardVariable implements IVariable {
  public constructor(private readonly options: DashboardVariableOptions) {
    if (options.inputType !== VariableInputType.INPUT && !options.values) {
      throw new Error(`Variable with inputType (${options.inputType}) requires values to be set`);
    }
    if (options.inputType == VariableInputType.INPUT && options.values) {
      throw new Error('inputType INPUT cannot be combined with values. Please choose either SELECT or RADIO or remove \'values\' from options.');
    }
  }

  toJson(): any {
    return {
      [this.options.type]: this.options.value,
      type: this.options.type,
      inputType: this.options.inputType,
      id: this.options.id,
      defaultValue: this.options.defaultValue?.val,
      visible: this.options.visible,
      label: this.options.label,
      ...this.options.values?.toJson(),
    };
  }
}
