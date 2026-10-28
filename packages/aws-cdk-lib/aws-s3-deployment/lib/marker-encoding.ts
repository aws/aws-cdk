/**
 * Encoding strategies for source content substitution.
 */
export enum MarkerEncoding {
  /**
   * Perform a literal text substitution for the marker value.
   *
   * - Scalars are plain-text substituted. Non-string scalars (numbers, booleans) are converted to strings
   *   and then substituted.
   * - Non-scalars (lists, objects) are rejected at run time.
   */
  LITERAL = 'LITERAL',

  /**
   * Unquoted JSON escaping
   *
   * This encoding encodes values, and strips quotes that may be present in the
   * encoding. This assumes that the surrounding file is a skeleton JSON
   * document that has been seeded with quotes as appropriate to accept values
   * of the types that will be substituted at deploy-time.
   *
   * - Strings expect to go into a pre-quoted JSON string context (e.g., `Source.data('{"arn": "' + snsTopic.topicArn + '"}')`).
   * - Non-string scalars expect to go into a non-quoted JSON context (e.g., `Source.data('{"port": ' + cluster.port + '}')`).
   * - Non-scalars are JSON-encoded and then fully substituted. They expect to go into a non-quoted JSON
   *   context in the input string (e.g., `Source.data('{"ports": ' + Token.asString(cluster.allPorts) + '}')`).
   *
   * Note that scalars inside compound values will be changed to strings, by
   * CloudFormation's property stringification behavior. E.g., the JSON document
   * example from `cluster.allPorts` will end up as `{ "ports": ["80", "443"] }`
   * even if the original port values were numbers.
   */
  UNQUOTED_JSON_VALUE = 'UNQUOTED_JSON_VALUE',

  /**
   * Regular JSON escaping
   *
   * This encoding encodes values as regular JSON value, including any quoting
   * or bracing that may be necessary. These values can be used in a context where
   * an arbitrary JSON value is accepted.
   *
   * - Strings are JSON-encoded and substituted with their surrounding quotes.
   * - Non-string scalars will be forced to string values by CloudFormation's
   *   stringification behavior.
   * - Non-scalars are JSON-encoded and fully substituted. Scalars inside
   *   compound values will be changed to strings by CloudFormation's property
   *   stringification behavior.
   */
  JSON_VALUE = 'JSON_VALUE',

  /**
   * An unquoted YAML string substitution.
   *
   * If the value is not a string, it will be rejected at run time.
   *
   * Otherwise, if the string renders safely as an unquoted YAML string, it will be substituted as-is.
   * If not, it will be quoted or escaped as necessary to form a valid YAML string.
   */
  YAML_STRING = 'YAML_STRING',
}

