/**
 * Properties for a Y-Axis
 */
export interface YAxisProps {
  /**
   * The min value
   *
   * @default 0
   */
  readonly min?: number;

  /**
   * The max value
   *
   * @default No maximum value
   */
  readonly max?: number;

  /**
   * The label
   *
   * @default No label
   */
  readonly label?: string;

  /**
   * Whether to show units
   *
   * @default None (means true)
   */
  readonly showUnits?: boolean;
}

/**
 * An Y-Axis on a CloudWatch dashboard widget
 */
export class YAxis {
  public readonly min?: number;
  public readonly max?: number;
  public readonly label?: string;
  public readonly showUnits?: boolean;

  constructor(props: YAxisProps) {
    this.min = props.min || 0;
    this.max = props.max;
    this.label = props.label;
    this.showUnits = props.showUnits;
  }
}
