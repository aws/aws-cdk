
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

export interface IDashboardVariable {

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
   */
  readonly label?: string;

  /**
   * Optional default value
   */
  readonly defaultValue: any;

  /**
   * Whether the variable is visible
   */
  readonly visible?: boolean;
}

export abstract class DashboardVariable implements IVariable {
  private readonly baseProps: IDashboardVariable;

  protected constructor(props: IDashboardVariable) {
    this.baseProps = props;
  }

  toJson(): any {
    return {
      [this.baseProps.type]: this.baseProps.value,
      type: this.baseProps.type,
      inputType: this.baseProps.inputType,
      id: this.baseProps.id,
      defaultValue: this.baseProps.defaultValue,
      visible: this.baseProps.visible,
      label: this.baseProps.label,
    };
  }

}

export interface IVariableValue {

  /**
   * Optional label for the selected item
   *
   * @default - value
   */
  readonly label?: string;

  /**
   * Value of the selected item
   */
  readonly value: string;
}

export interface IValueDashboardVariable extends IDashboardVariable {

  /**
   * List of custom values for the variable
   *
   * @default - No values
   */
  readonly values?: IVariableValue[];
}

/**
 * The variable populated from the custom values
 */
export class ValueDashboardVariable extends DashboardVariable {
  private readonly props: IValueDashboardVariable;

  constructor(props: IValueDashboardVariable) {
    super(props);
    this.props = props;
  }

  toJson(): any {
    const base = super.toJson();
    return {
      ...base,
      values: this.props.values ? this.props.values.map(value => ({ label: value.label, value: value.value })) : undefined,
    };
  }

}

/**
 * The variable populated from the metric search
 */
export interface ISearchDashboardVariable extends IDashboardVariable {

  /**
     * Search expression
     */
  readonly searchExpression: string;

  /**
     * Optional dimension name from the search
     */
  readonly populateFrom?: string;
}

export class SearchDashboardVariable extends DashboardVariable {
  private readonly props: ISearchDashboardVariable;

  constructor(props: ISearchDashboardVariable) {
    super(props);
    this.props = props;
  }

  toJson(): any {
    const base = super.toJson();
    return {
      ...base,
      search: this.props.searchExpression,
      populateFrom: this.props.populateFrom,
    };
  }

}