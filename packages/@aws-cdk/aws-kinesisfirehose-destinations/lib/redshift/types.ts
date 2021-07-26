/**
 * A column in a Redshift table.
 */
export interface RedshiftColumn {
  /**
   * The name of the column.
   */
  readonly name: string;

  /**
   * The data type of the column.
   */
  readonly dataType: string;
}
