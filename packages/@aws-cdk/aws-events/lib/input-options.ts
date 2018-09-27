/**
 * Specifies settings that provide custom input to an Amazon CloudWatch Events
 * rule target based on certain event data.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatchEvents/latest/APIReference/API_InputTransformer.html
 */
export interface TargetInputTemplate {
  /**
   * Input template where you can use the values of the keys from
   * inputPathsMap to customize the data sent to the target. Enclose each
   * InputPathsMaps value in brackets: <value>
   *
   * The value passed here will be double-quoted to indicate it's a string value.
   * This option is mutually exclusive with `jsonTemplate`.
   *
   * @example
   *
   *    {
   *    textTemplate: 'Build <buildid> started',
   *    pathsMap: {
   *      buildid: '$.detail.id'
   *    }
   *    }
   */
  textTemplate?: any;

  /**
   * Input template where you can use the values of the keys from
   * inputPathsMap to customize the data sent to the target. Enclose each
   * InputPathsMaps value in brackets: <value>
   *
   * This option is mutually exclusive with `textTemplate`.
   *
   * @example
   *
   *   {
   *     jsonTemplate: '{ "commands": <commandsToRun> }' ,
   *     pathsMap: {
   *     commandsToRun: '$.detail.commands'
   *     }
   *   }
   *
   */
  jsonTemplate?: any;

  /**
   * Map of JSON paths to be extracted from the event. These are key-value
   * pairs, where each value is a JSON path. You must use JSON dot notation,
   * not bracket notation.
   */
  pathsMap?: { [key: string]: string };
}
