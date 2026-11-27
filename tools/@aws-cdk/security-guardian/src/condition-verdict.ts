// Judges, on a template as JSON.parse reads it, whether the Condition of an Allow statement
// in a resource policy limits the statement to fixed values of a listed condition key.

/** The most strings one Condition value may produce before it counts as not fixed */
export const MAX_CONDITION_VALUES = 256;

/**
 * The most work judging one template may take. One unit is charged for each statement; each
 * intrinsic function or value read, and each key of an object read as one; each string produced
 * (every result of Fn::If, Fn::FindInMap, Fn::Select, Fn::Split, a list or a join step); each
 * joined text built or walked; each mapping entry and mapping string read; each parameter value a
 * Ref checks; and each character Fn::Split reads. Each string read also costs one unit and one
 * more per 64 characters: literals, Condition operators and keys, logical IDs and resource types,
 * names in Ref and Fn::GetAtt, mapping names and keys, Fn::Sub strings, and the Fn::Split
 * delimiter at each search. A value judged after the work is spent counts as not fixed, so judging
 * stays bounded in time and memory whatever the template's values expand to.
 */
export const MAX_JUDGING_WORK = 1_000_000;

/** The longest string a value may produce and still be fixed; no policy these resource types accept is this long */
export const MAX_CONDITION_TEXT_LENGTH = 65_536;

/**
 * Literals longer than this are read without the cache. The engine hashes long strings by their
 * length alone, so many long literals of one length would make each lookup compare them all.
 */
const MAX_CACHED_LITERAL_LENGTH = 1024;

/** The resource types whose `Properties.PolicyDocument` statements are judged */
const POLICY_TYPES = new Set([
  'AWS::S3::BucketPolicy',
  'AWS::SNS::TopicPolicy',
  'AWS::SNS::TopicInlinePolicy',
  'AWS::SQS::QueuePolicy',
  'AWS::SQS::QueueInlinePolicy',
]);

/** Operators that compare a key with the listed values, without a set prefix or with `ForAnyValue:` */
const OPERATORS = new Set(['StringEquals', 'StringEqualsIgnoreCase', 'StringLike', 'ArnEquals', 'ArnLike']);

/**
 * Condition keys whose fixed value S3 counts as non-public, in lower case.
 * See "The meaning of public" in https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html
 */
const KEYS = new Set([
  'aws:principalorgid',
  'aws:sourcearn',
  'aws:sourcevpc',
  'aws:sourcevpce',
  'aws:sourceowner',
  'aws:sourceaccount',
  'aws:userid',
  's3:dataaccesspointarn',
  's3:dataaccesspointaccount',
]);

/** Pseudo parameters whose values are taken as fixed */
const PSEUDO_PARAMETERS = new Set(['AWS::AccountId', 'AWS::Partition', 'AWS::Region', 'AWS::StackId', 'AWS::StackName', 'AWS::URLSuffix']);

/** The statements of one policy resource whose Condition limits them to fixed values */
export interface PolicyVerdict {
  /** Whether the committed template writes `Statement` as a list rather than as one object */
  readonly statementIsList: boolean;
  /** Indexes of the limited statements; a `Statement` that is one object has index 0 */
  readonly limitedStatements: ReadonlySet<number>;
}

/** Verdicts of one template, by logical ID of its policy resources that have a limited statement */
export type TemplateVerdicts = ReadonlyMap<string, PolicyVerdict>;

/** Stands for a value CloudFormation supplies at deploy time, taken as text with none of `*`, `?` or `${` */
const DEPLOY_TIME_VALUE = Symbol('deploy-time value');

/**
 * The length a deploy-time value counts as toward MAX_CONDITION_TEXT_LENGTH: the largest a
 * parameter value or a custom resource response may be, 4,096 bytes
 */
export const DEPLOY_TIME_VALUE_LENGTH = 4096;

/** The most characters at each end of a text that the checks below need to see across a join */
const EDGE = 9;

/** Text that makes a value not fixed; none is longer than EDGE + 1 characters */
const PATTERNS = ['*', '?', '${', '{{resolve:'];

/**
 * One string a Condition value can produce, as literal text and deploy-time values in order.
 *
 * Joining two texts makes a node over both, and each node keeps what the fixed-value check needs,
 * so that a join costs the same however long its parts are. A deploy-time value counts as
 * DEPLOY_TIME_VALUE_LENGTH characters in `length`, and as one character `x` in `head` and `tail`,
 * which no pattern can cross.
 */
interface Text {
  readonly length: number;
  readonly hasDeployTimeValue: boolean;
  /** Whether the text holds one of PATTERNS */
  readonly hasPattern: boolean;
  /** The first and last EDGE characters, or the whole text when it is shorter; each stops after a deploy-time value's `x` */
  readonly head: string;
  readonly tail: string;
  /** A literal, a deploy-time value, or two joined texts */
  readonly content: string | typeof DEPLOY_TIME_VALUE | readonly [Text, Text];
}

function hasPattern(value: string): boolean {
  return PATTERNS.some(pattern => value.includes(pattern));
}

function literalText(value: string): Text {
  return { length: value.length, hasDeployTimeValue: false, hasPattern: hasPattern(value), head: value.slice(0, EDGE), tail: value.slice(-EDGE), content: value };
}

const EMPTY = literalText('');
const DEPLOY_TIME: Text = { length: DEPLOY_TIME_VALUE_LENGTH, hasDeployTimeValue: true, hasPattern: false, head: 'x', tail: 'x', content: DEPLOY_TIME_VALUE };

function concat(first: Text, second: Text, context: TemplateContext): Text {
  if (first.length === 0) {
    return second;
  }
  if (second.length === 0) {
    return first;
  }
  spend(context, 1);
  return {
    length: first.length + second.length,
    hasDeployTimeValue: first.hasDeployTimeValue || second.hasDeployTimeValue,
    // A pattern across the join has at most EDGE characters on each side
    hasPattern: first.hasPattern || second.hasPattern || hasPattern(first.tail + second.head),
    head: first.length >= EDGE ? first.head : (first.head + second.head).slice(0, EDGE),
    tail: second.length >= EDGE ? second.tail : (first.tail + second.tail).slice(-EDGE),
    content: [first, second],
  };
}

/** The literals and deploy-time values of a text, in order */
function piecesOf(text: Text, context: TemplateContext): Array<string | typeof DEPLOY_TIME_VALUE> {
  const pieces: Array<string | typeof DEPLOY_TIME_VALUE> = [];
  const pending: Text[] = [text];
  while (pending.length > 0) {
    // A text that refers to one variable many times shares its nodes, so walking it can cost far more than building it
    spend(context, 1);
    const next = pending.pop()!;
    if (Array.isArray(next.content)) {
      pending.push(next.content[1], next.content[0]);
    } else {
      pieces.push(next.content as string | typeof DEPLOY_TIME_VALUE);
    }
  }
  return pieces;
}

/** Thrown while reading a value that is not fixed */
class NotFixed extends Error {}

function notFixed(): never {
  throw new NotFixed();
}

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOwn(object: JsonObject, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function section(template: unknown, name: string): JsonObject {
  const value = isObject(template) ? template[name] : undefined;
  return isObject(value) ? value : {};
}

/** The parts of the template that Condition values can refer to */
interface TemplateContext {
  readonly resources: JsonObject;
  readonly parameters: JsonObject;
  readonly mappings: JsonObject;
  /** The text of each literal read so far, so that a literal the template refers to many times is read once */
  readonly literals: Map<string, Text>;
  /** The work left of MAX_JUDGING_WORK for the whole template */
  readonly work: { remaining: number };
}

/** Takes `units` of work from the template's budget, or NotFixed once it is spent */
function spend(context: TemplateContext, units: number): void {
  context.work.remaining -= units;
  if (context.work.remaining < 0) {
    notFixed();
  }
}

/** Takes the work of reading a string: one unit, and one more per 64 characters */
function spendOnString(context: TemplateContext, value: string): void {
  spend(context, 1 + Math.floor(value.length / 64));
}

function literal(value: string, context: TemplateContext): Text {
  // Hashing and comparing a literal costs its length, whether or not the cache holds it
  spendOnString(context, value);
  if (value.length > MAX_CACHED_LITERAL_LENGTH) {
    return literalText(value);
  }
  let text = context.literals.get(value);
  if (!text) {
    text = literalText(value);
    context.literals.set(value, text);
  }
  return text;
}

function bounded(texts: Text[], context: TemplateContext): Text[] {
  spend(context, texts.length);
  if (texts.length === 0 || texts.length > MAX_CONDITION_VALUES) {
    notFixed();
  }
  return texts;
}

/** Every string each of `pieces` can produce, joined in order with `delimiter` */
function joinAll(pieces: Text[][], delimiter: Text, context: TemplateContext): Text[] {
  let joined: Text[] = [EMPTY];
  pieces.forEach((alternatives, index) => {
    // Stop before building more strings than the bound
    if (joined.length * alternatives.length > MAX_CONDITION_VALUES) {
      notFixed();
    }
    joined = bounded(joined.flatMap(prefix => {
      const start = index === 0 ? prefix : concat(prefix, delimiter, context);
      return alternatives.map(text => concat(start, text, context));
    }), context);
  });
  return joined;
}

/** A value that may be a list of values, such as a Condition value or a mapping entry */
function listOrValue(value: unknown, context: TemplateContext): Text[] {
  if (!Array.isArray(value)) {
    return texts(value, context);
  }
  return bounded(value.flatMap(element => {
    if (Array.isArray(element)) {
      notFixed();
    }
    return texts(element, context);
  }), context);
}

/** Every string `value` can produce, or NotFixed when one of them is not known from the template */
function texts(value: unknown, context: TemplateContext): Text[] {
  spend(context, 1);
  if (typeof value === 'string') {
    return [literal(value, context)];
  }
  if (!isObject(value)) {
    notFixed();
  }
  const keys = Object.keys(value);
  spend(context, keys.length);
  if (keys.length !== 1) {
    notFixed();
  }
  const [name] = keys;
  const argument = value[name];
  switch (name) {
    case 'Ref':
      return typeof argument === 'string' ? reference(argument, context) : notFixed();
    case 'Fn::GetAtt':
      return attribute(argument, context);
    case 'Fn::ImportValue':
      return [DEPLOY_TIME];
    case 'Fn::If':
      if (!Array.isArray(argument) || argument.length !== 3) {
        notFixed();
      }
      return bounded([...texts(argument[1], context), ...texts(argument[2], context)], context);
    case 'Fn::FindInMap':
      return findInMap(argument, context);
    case 'Fn::Select':
      return select(argument, context);
    case 'Fn::Split':
      return split(argument, context);
    case 'Fn::Join':
      return join(argument, context);
    case 'Fn::Sub':
      return substitute(argument, context);
    default:
      return notFixed();
  }
}

function reference(name: string, context: TemplateContext): Text[] {
  spendOnString(context, name);
  if (PSEUDO_PARAMETERS.has(name)) {
    return [DEPLOY_TIME];
  }
  if (hasOwn(context.parameters, name)) {
    const parameter = context.parameters[name];
    // CloudFormation fills a Systems Manager parameter type from Parameter Store at deploy time
    if (!isObject(parameter) || (typeof parameter.Type === 'string' && parameter.Type.startsWith('AWS::SSM::Parameter::'))) {
      notFixed();
    }
    // A Default does not bound the value a stack is deployed with
    if (!Array.isArray(parameter.AllowedValues)) {
      notFixed();
    }
    // Every Ref to the parameter checks its values again
    spend(context, parameter.AllowedValues.length);
    if (parameter.AllowedValues.some(allowed => typeof allowed !== 'string')) {
      notFixed();
    }
    return listOrValue(parameter.AllowedValues, context);
  }
  if (hasOwn(context.resources, name)) {
    return [DEPLOY_TIME];
  }
  return notFixed();
}

/** Fn::GetAtt of a resource of the template, as [logical ID, attribute] or "LogicalId.Attribute" */
function attribute(argument: unknown, context: TemplateContext): Text[] {
  if (typeof argument === 'string') {
    spendOnString(context, argument);
  }
  const dot = typeof argument === 'string' ? argument.indexOf('.') : -1;
  const [logicalId, name] = typeof argument === 'string'
    ? (dot > 0 ? [argument.slice(0, dot), argument.slice(dot + 1)] : [])
    : Array.isArray(argument) && argument.length === 2 ? argument : [];
  if (typeof logicalId !== 'string' || typeof name !== 'string' || name === '') {
    notFixed();
  }
  spendOnString(context, logicalId);
  if (!hasOwn(context.resources, logicalId)) {
    notFixed();
  }
  return [DEPLOY_TIME];
}

/** The entries a FindInMap key can select: one for a literal key, all of them for any other key */
function selectEntries(entries: unknown[], key: unknown, context: TemplateContext): unknown[] {
  return entries.flatMap(entry => {
    if (!isObject(entry)) {
      return [];
    }
    if (typeof key === 'string') {
      spendOnString(context, key);
      return hasOwn(entry, key) ? [entry[key]] : [];
    }
    // Every Fn::FindInMap with such a key reads the whole map again
    const values = Object.values(entry);
    spend(context, values.length);
    return values;
  });
}

function findInMap(argument: unknown, context: TemplateContext): Text[] {
  if (!Array.isArray(argument) || (argument.length !== 3 && argument.length !== 4)) {
    notFixed();
  }
  const [mapName, topKey, secondKey, options] = argument;
  if (typeof mapName !== 'string') {
    notFixed();
  }
  spendOnString(context, mapName);
  if (!hasOwn(context.mappings, mapName)) {
    notFixed();
  }
  // A mapping holds only strings and lists of strings
  const entries = selectEntries(selectEntries([context.mappings[mapName]], topKey, context), secondKey, context).flatMap((entry): Text[] => {
    const strings = Array.isArray(entry) ? entry : [entry];
    spend(context, strings.length);
    return strings.map(value => (typeof value === 'string' ? literal(value, context) : notFixed()));
  });
  if (options !== undefined) {
    if (!isObject(options) || !hasOwn(options, 'DefaultValue')) {
      notFixed();
    }
    entries.push(...listOrValue(options.DefaultValue, context));
  }
  return bounded(entries, context);
}

function select(argument: unknown, context: TemplateContext): Text[] {
  if (!Array.isArray(argument) || argument.length !== 2) {
    notFixed();
  }
  // Every element counts, whatever the index
  const list = argument[1];
  if (isObject(list)) {
    const keys = Object.keys(list);
    spend(context, keys.length);
    if (keys.length === 1 && hasOwn(list, 'Fn::Split')) {
      return split(list['Fn::Split'], context);
    }
  }
  return Array.isArray(list) ? listOrValue(list, context) : notFixed();
}

function split(argument: unknown, context: TemplateContext): Text[] {
  if (!Array.isArray(argument) || argument.length !== 2 || typeof argument[0] !== 'string' || argument[0] === '') {
    notFixed();
  }
  const delimiter: string = argument[0];
  const parts: Text[] = [];
  // A deploy-time value in the source stays whole in its part
  for (const text of texts(argument[1], context)) {
    let part = EMPTY;
    // Literal text between deploy-time values is split as one string, since a delimiter can span two joined literals
    let run = '';
    const splitRun = () => {
      // Each search of the run reads the delimiter
      spendOnString(context, delimiter);
      run.split(delimiter).forEach((segment, index) => {
        if (index > 0) {
          parts.push(part);
          if (parts.length > MAX_CONDITION_VALUES) {
            notFixed();
          }
          part = EMPTY;
        }
        part = concat(part, literal(segment, context), context);
      });
      run = '';
    };
    for (const piece of piecesOf(text, context)) {
      if (piece === DEPLOY_TIME_VALUE) {
        splitRun();
        part = concat(part, DEPLOY_TIME, context);
      } else {
        spend(context, piece.length);
        run += piece;
      }
    }
    splitRun();
    parts.push(part);
  }
  return bounded(parts, context);
}

function join(argument: unknown, context: TemplateContext): Text[] {
  if (!Array.isArray(argument) || argument.length !== 2 || typeof argument[0] !== 'string' || !Array.isArray(argument[1])) {
    notFixed();
  }
  return joinAll(argument[1].map(part => texts(part, context)), literal(argument[0], context), context);
}

function substitute(argument: unknown, context: TemplateContext): Text[] {
  const [source, variables] = typeof argument === 'string' ? [argument, {}] : Array.isArray(argument) && argument.length === 2 ? argument : [];
  if (typeof source !== 'string' || !isObject(variables)) {
    notFixed();
  }
  spendOnString(context, source);
  const pieces: Text[][] = [];
  // Each variable is read once, however often the string refers to it
  const values = new Map<string, Text[]>();
  let text = '';
  let position = 0;
  while (position < source.length) {
    const start = source.indexOf('${', position);
    if (start < 0) {
      text += source.slice(position);
      break;
    }
    text += source.slice(position, start);
    // ${!Name} writes the literal text ${Name}
    if (source[start + 2] === '!') {
      text += '${';
      position = start + 3;
      continue;
    }
    const end = source.indexOf('}', start + 2);
    if (end < 0) {
      text += source.slice(start);
      break;
    }
    const name = source.slice(start + 2, end);
    if (!values.has(name)) {
      values.set(name, variable(name, variables, context));
    }
    pieces.push([literal(text, context)], values.get(name)!);
    text = '';
    position = end + 1;
  }
  pieces.push([literal(text, context)]);
  return joinAll(pieces, EMPTY, context);
}

function variable(name: string, variables: JsonObject, context: TemplateContext): Text[] {
  if (hasOwn(variables, name)) {
    return texts(variables[name], context);
  }
  const dot = name.indexOf('.');
  if (dot < 0) {
    return reference(name, context);
  }
  return attribute([name.slice(0, dot), name.slice(dot + 1)], context);
}

/** Whether a short value equals "anonymous" in some letter case */
function isAnonymous(value: string): boolean {
  return value.toLowerCase() === 'anonymous' || value.toUpperCase() === 'ANONYMOUS';
}

function isFixedText(text: Text, key: string): boolean {
  if (text.length === 0 || text.length > MAX_CONDITION_TEXT_LENGTH || text.hasPattern) {
    return false;
  }
  if (key !== 'aws:userid') {
    return true;
  }
  // Every anonymous request carries aws:userid "anonymous", and a deploy-time value could form it.
  // Case mapping never shortens a string, so only a text of at most EDGE characters can equal it,
  // and then `head` is the whole text.
  return !text.hasDeployTimeValue && !(text.length <= EDGE && isAnonymous(text.head));
}

function isFixedValue(value: unknown, key: string, context: TemplateContext): boolean {
  try {
    return listOrValue(value, context).every(text => isFixedText(text, key));
  } catch (err) {
    if (err instanceof NotFixed) {
      return false;
    }
    throw err;
  }
}

function countsAsOperator(operator: string): boolean {
  const colon = operator.indexOf(':');
  const prefix = colon < 0 ? undefined : operator.slice(0, colon);
  const base = colon < 0 ? operator : operator.slice(colon + 1);
  return (prefix === undefined || prefix === 'ForAnyValue') && OPERATORS.has(base);
}

function contextOf(template: unknown): TemplateContext {
  return {
    resources: section(template, 'Resources'),
    parameters: section(template, 'Parameters'),
    mappings: section(template, 'Mappings'),
    literals: new Map(),
    work: { remaining: MAX_JUDGING_WORK },
  };
}

function isLimited(statement: unknown, context: TemplateContext): boolean {
  if (!isObject(statement) || statement.Effect !== 'Allow' || !hasOwn(statement, 'Principal') || hasOwn(statement, 'NotPrincipal')) {
    return false;
  }
  const condition = statement.Condition;
  if (!isObject(condition)) {
    return false;
  }
  // IAM combines operators and keys with AND, so one limiting entry is enough
  return Object.entries(condition).some(([operator, entries]) => {
    spendOnString(context, operator);
    return countsAsOperator(operator) && isObject(entries) && Object.entries(entries).some(([key, value]) => {
      spendOnString(context, key);
      return KEYS.has(key.toLowerCase()) && isFixedValue(value, key.toLowerCase(), context);
    });
  });
}

/** Whether a statement is limited; not once the template's work is spent */
function isLimitedWithinBudget(statement: unknown, context: TemplateContext): boolean {
  try {
    spend(context, 1);
    return isLimited(statement, context);
  } catch (err) {
    if (err instanceof NotFixed) {
      return false;
    }
    throw err;
  }
}

/**
 * Whether an Allow statement with a Principal and no NotPrincipal has a Condition entry that
 * limits it to fixed values: a counted operator, a listed key and a value whose every string is fixed.
 *
 * `template` is the template that holds the statement, for the resources, parameters and
 * mappings its Condition values refer to.
 */
export function isLimitedStatement(statement: unknown, template: unknown): boolean {
  return isLimitedWithinBudget(statement, contextOf(template));
}

/** The limited statements of each policy resource of the judged types in a template; none when a logical ID is not alphanumeric */
export function judgeTemplate(template: unknown): TemplateVerdicts {
  const context = contextOf(template);
  const verdicts = new Map<string, PolicyVerdict>();
  // cfn-guard writes keys into check locations as they are, so a logical ID with any other
  // character could make the location of one resource's statement read as another's.
  // CloudFormation logical IDs are alphanumeric.
  const logicalIds = Object.keys(context.resources);
  // Reading the template is work too: once the budget is spent, the resources not yet read get no verdicts
  try {
    logicalIds.forEach(logicalId => spendOnString(context, logicalId));
    if (!logicalIds.every(logicalId => /^[A-Za-z0-9]+$/.test(logicalId))) {
      return verdicts;
    }
    for (const [logicalId, resource] of Object.entries(context.resources)) {
      if (!isObject(resource) || typeof resource.Type !== 'string') {
        continue;
      }
      spendOnString(context, resource.Type);
      if (!POLICY_TYPES.has(resource.Type) || !isObject(resource.Properties)) {
        continue;
      }
      const document = resource.Properties.PolicyDocument;
      if (!isObject(document) || !hasOwn(document, 'Statement')) {
        continue;
      }
      const statementIsList = Array.isArray(document.Statement);
      const statements: unknown[] = statementIsList ? document.Statement as unknown[] : [document.Statement];
      const limitedStatements = new Set<number>();
      // Judging stops once the budget is spent; the statements judged so far keep their verdicts
      for (let index = 0; index < statements.length && context.work.remaining >= 0; index++) {
        if (isLimitedWithinBudget(statements[index], context)) {
          limitedStatements.add(index);
        }
      }
      if (limitedStatements.size > 0) {
        verdicts.set(logicalId, { statementIsList, limitedStatements });
      }
      if (context.work.remaining < 0) {
        break;
      }
    }
  } catch (err) {
    if (!(err instanceof NotFixed)) {
      throw err;
    }
  }
  return verdicts;
}
