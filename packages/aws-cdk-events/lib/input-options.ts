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
     * The value will be serialized as a JSON object (JSON.stringify).
     */
    template?: any;

    /**
     * Map of JSON paths to be extracted from the event. These are key-value
     * pairs, where each value is a JSON path. You must use JSON dot notation,
     * not bracket notation.
     */
    pathsMap?: { [key: string]: string };
}
