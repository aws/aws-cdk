import { PipeVariable } from './pipeVariable';

// enrich the pipe variable values with quotes so that the regex match includes the quotes, otherwise the replace function will not find the quotes
const pipeVariableValuesWithQuotes = Object.values(PipeVariable).map(value => `"${value}"`);

// build a regex that matches the pipe variable values with quotes like "<aws.pipes.pipe-name>"
const pipeVariableRegex = new RegExp(`(${pipeVariableValuesWithQuotes.join('|')})`, 'g');

// A regex that matches the event path expressions values with quotes like "<$.foo.bar>"
const eventPathRegex = new RegExp('"(<\\$.+?>)"', 'g');

/**
 * Removes the quotes from a string
 * @param match a string that eventually contains quotes
 * @returns a string without quotes
 */
const removeQuotes = (match: string): string => match.replace(/^"|"$/g, '');

/**
 * Removes the quotes from the matched pipe variable values
 * @param stringWithQuotes a string that eventually contains pipe variable values with quotes
 * @param replacer a function that replaces the matched pipe variable values with quotes
 * @returns a string without quotes
 */
const removeQuotesFromVariables = (stringWithQuotes: string, replacer: (match: string) => string) =>
  stringWithQuotes.replace(pipeVariableRegex, replacer);

const removeQuotesFromEventPathExpression = (stringWithQuotes: string, replacer: (match: string) => string) =>
  stringWithQuotes.replace(eventPathRegex, replacer);

/**
 * Removes the quotes from PipeVariables and EventPathExpressions
 * @param stringWithQuotes a string that eventually contains pipe variable or event path expression values with quotes
 * @returns a string were pipe variables and event path expressions don't have quotes
 */
export const unquote = (stringWithQuotes: string) => {
  const stringWithoutVariablesQuotes = removeQuotesFromVariables(stringWithQuotes, removeQuotes);
  const stringWithoutEventPathQuotes = removeQuotesFromEventPathExpression(stringWithoutVariablesQuotes, removeQuotes);
  return stringWithoutEventPathQuotes;
};

