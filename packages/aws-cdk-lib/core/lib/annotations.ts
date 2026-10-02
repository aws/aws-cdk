import type { IConstruct, MetadataEntry } from 'constructs';
import { UnscopedValidationError } from './errors';
import * as cxschema from '../../cloud-assembly-schema';
import * as cxapi from '../../cx-api';
import { appOf } from './private/core-construct-finders';
import { lit, type LiteralString } from './private/literal-string';
import type { IWarningContextFilter } from './validation/warning-context-filter';

/**
 * Includes API for attaching annotations such as warning messages to constructs.
 */
export class Annotations {
  /**
   * Returns the annotations API for a construct scope.
   * @param scope The scope
   */
  public static of(scope: IConstruct) {
    return new Annotations(scope);
  }

  private readonly stackTraces: boolean;

  private constructor(private readonly scope: IConstruct) {
    const disableTrace =
      scope.node.tryGetContext(cxapi.DISABLE_METADATA_STACK_TRACE) ||
      process.env.CDK_DISABLE_STACK_TRACE;

    this.stackTraces = !disableTrace;
  }

  /**
   * Acknowledge a warning. When a warning is acknowledged for a scope
   * all warnings that match the id will be ignored.
   *
   * The acknowledgement will apply to all child scopes
   *
   * @example
   * declare const myConstruct: Construct;
   * Annotations.of(myConstruct).acknowledgeWarning('SomeWarningId', 'This warning can be ignored because...');
   *
   * @param id - the id of the warning message to acknowledge
   * @param message optional message to explain the reason for acknowledgement
   */
  public acknowledgeWarning(id: string, message?: string): void {
    this._acknowledgeWarning(id, undefined, message);
  }

  /**
   * Acknowledge a warning, optionally only the occurrences whose call-site
   * context matches every provided filter.
   *
   * When `filters` is omitted (or empty), all warnings with the id are
   * acknowledged (the behavior of the public `acknowledgeWarning`). When
   * filters are provided, only occurrences whose context matches are
   * suppressed; other occurrences of the same id continue to warn.
   *
   * @internal
   */
  public _acknowledgeWarning(id: string, filters?: IWarningContextFilter[], message?: string): void {
    Acknowledgements.of(this.scope).add(this.scope, id, filters);

    // We don't use message currently, but encouraging people to supply it is good for documentation
    // purposes, and we can always add a report on it in the future.
    void(message);

    // Iterate over the construct and remove any existing instances of this warning
    // (addWarningV2 will prevent future instances of it)
    removeWarningDeep(this.scope, id, filters);
  }

  /**
   * Adds an acknowledgeable warning metadata entry to this construct.
   *
   * The CLI will display the warning when an app is synthesized, or fail if run
   * in `--strict` mode.
   *
   * If the warning is acknowledged using `acknowledgeWarning()`, it will not be shown by
   * the CLI, and will not cause `--strict` mode to fail synthesis.
   *
   * Prefer using `Validations.of(scope).addWarning()` instead.
   *
   * @example
   * declare const myConstruct: Construct;
   * Annotations.of(myConstruct).addWarningV2('my-library:Construct.someWarning', 'Some message explaining the warning');
   *
   * @param id the unique identifier for the warning. This can be used to acknowledge the warning
   * @param message The warning message.
   * @param context Optional structured key/value context describing this specific
   * occurrence (e.g. `{ service: 'aiops' }`). A `Validations.acknowledge({ where })`
   * filter matches against this context to selectively suppress a subset of the id.
   */
  public addWarningV2(id: string, message: string, context?: { [key: string]: string }) {
    if (!Acknowledgements.of(this.scope).has(this.scope, id, context)) {
      const data = `${message} ${ackTag(id)}`;
      this.addMessage(cxschema.ArtifactMetadataEntryType.WARN, data);
      if (context && Object.keys(context).length > 0) {
        WarningContexts.of(this.scope).record(this.scope, data, context);
      }
    }
  }

  /**
   * Adds a warning metadata entry to this construct. Prefer using `Validations.of(scope).addWarning()`.
   *
   * The CLI will display the warning when an app is synthesized, or fail if run
   * in `--strict` mode.
   *
   * Warnings added by this call cannot be acknowledged. This will block users from
   * running in `--strict` mode until the deal with the warning, which makes it
   * effectively not very different from `addError`. Prefer using `addWarningV2` instead.
   *
   * @param message The warning message.
   */
  public addWarning(message: string) {
    this.addMessage(cxschema.ArtifactMetadataEntryType.WARN, message);
  }

  /**
   * Acknowledge a info. When a info is acknowledged for a scope
   * all infos that match the id will be ignored.
   *
   * The acknowledgement will apply to all child scopes
   *
   * @example
   * declare const myConstruct: Construct;
   * Annotations.of(myConstruct).acknowledgeInfo('SomeInfoId', 'This info can be ignored because...');
   *
   * @param id - the id of the info message to acknowledge
   * @param message optional message to explain the reason for acknowledgement
   */
  public acknowledgeInfo(id: string, message?: string): void {
    Acknowledgements.of(this.scope).add(this.scope, id);

    // We don't use message currently, but encouraging people to supply it is good for documentation
    // purposes, and we can always add a report on it in the future.
    void(message);

    // Iterate over the construct and remove any existing instances of this info
    // (addInfoV2 will prevent future instances of it)
    removeInfoDeep(this.scope, id);
  }

  /**
   * Adds an acknowledgeable info metadata entry to this construct.
   *
   * The CLI will display the info when an app is synthesized.
   *
   * If the info is acknowledged using `acknowledgeInfo()`, it will not be shown by the CLI.
   *
   * @example
   * declare const myConstruct: Construct;
   * Annotations.of(myConstruct).addInfoV2('my-library:Construct.someInfo', 'Some message explaining the info');
   *
   * @param id the unique identifier for the info. This can be used to acknowledge the info
   * @param message The info message.
   */
  public addInfoV2(id: string, message: string) {
    if (!Acknowledgements.of(this.scope).has(this.scope, id)) {
      this.addMessage(cxschema.ArtifactMetadataEntryType.INFO, `${message} ${ackTag(id)}`);
    }
  }

  /**
   * Adds an info metadata entry to this construct.
   *
   * The CLI will display the info message when apps are synthesized.
   *
   * @param message The info message.
   */
  public addInfo(message: string): void {
    this.addMessage(cxschema.ArtifactMetadataEntryType.INFO, message);
  }

  /**
   * Adds an { "error": <message> } metadata entry to this construct.
   * The toolkit will fail deployment of any stack that has errors reported against it.
   * Prefer using `Validations.of(scope).addError()` instead.
   * @param message The error message.
   */
  public addError(message: string) {
    this.addMessage(cxschema.ArtifactMetadataEntryType.ERROR, message);
  }

  /**
   * Add an error annotation to this construct, along with a tracking ID
   *
   * The toolkit will fail deployment of any stack that has errors reported against it.
   *
   * The error code will be tracked by telemetry; this method should only be used
   * by CDK source code.
   *
   * @param id The error ID.
   * @param message The error message.
   * @internal
   */
  public _addTrackableError(id: LiteralString, message: string) {
    this.addError(message);

    const type = 'aws:cdk:error-code';

    const isNew = !this.scope.node.metadata.find((x) => x.type === type && x.data === id);
    if (isNew) {
      this.scope.node.addMetadata(type, id);
    }
  }

  /**
   * Adds a deprecation warning for a specific API.
   *
   * Deprecations will be added only once per construct as a warning and will be
   * deduplicated based on the `api`.
   *
   * If the environment variable `CDK_BLOCK_DEPRECATIONS` is set, this method
   * will throw an error instead with the deprecation message.
   *
   * @param api The API being deprecated in the format `module.Class.property`
   * (e.g. `@aws-cdk/core.Construct.node`).
   * @param message The deprecation message to display, with information about
   * alternatives.
   */
  public addDeprecation(api: string, message: string) {
    const text = `The API ${api} is deprecated: ${message}. This API will be removed in the next major release`;

    // throw if CDK_BLOCK_DEPRECATIONS is set
    if (process.env.CDK_BLOCK_DEPRECATIONS) {
      throw new UnscopedValidationError(lit`ValidationError`, `${this.scope.node.path}: ${text}`);
    }

    this.addWarningV2(`Deprecated:${api}`, text);
  }

  /**
   * Adds a message metadata entry to the construct node, to be displayed by the CDK CLI.
   *
   * Records the message once per construct.
   * @param level The message level
   * @param message The message itself
   */
  private addMessage(level: string, message: string) {
    const isNew = !this.scope.node.metadata.find((x) => x.data === message);
    if (isNew) {
      let normalizedMessage = typeof message === 'string' ? message : JSON.stringify(message);
      this.scope.node.addMetadata(level, normalizedMessage, { stackTrace: this.stackTraces });
    }
  }
}

/**
 * Class to keep track of acknowledgements
 *
 * There is a singleton instance for every `App` instance, which can be obtained by
 * calling `Acknowledgements.of(...)`.
 */
class Acknowledgements {
  public static of(scope: IConstruct): Acknowledgements {
    const app = appOf(scope);
    if (!app) {
      return new Acknowledgements();
    }

    const existing = (app as any)[Acknowledgements.ACKNOWLEDGEMENTS_SYM];
    if (existing) {
      return existing as Acknowledgements;
    }

    const fresh = new Acknowledgements();
    (app as any)[Acknowledgements.ACKNOWLEDGEMENTS_SYM] = fresh;
    return fresh;
  }

  private static ACKNOWLEDGEMENTS_SYM = Symbol.for('@aws-cdk/core.Acknowledgements');

  // path -> ack id -> list of acknowledgement records (one per acknowledge call).
  // An undefined/empty `filters` means "suppress all occurrences of this id"
  // (backwards-compatible behavior). Filters are combined with AND, and a warning
  // is suppressed if ANY record for the id matches.
  private readonly acks = new Map<string, Map<string, AckRecord[]>>();

  private constructor() {}

  public add(node: string | IConstruct, ack: string, filters?: IWarningContextFilter[]) {
    const nodePath = this.nodePath(node);

    let byId = this.acks.get(nodePath);
    if (!byId) {
      byId = new Map();
      this.acks.set(nodePath, byId);
    }
    let records = byId.get(ack);
    if (!records) {
      records = [];
      byId.set(ack, records);
    }
    records.push({ filters });
  }

  public has(node: string | IConstruct, ack: string, context?: { [key: string]: string }): boolean {
    const ctx = context ?? {};
    for (const candidate of this.searchPaths(this.nodePath(node))) {
      const records = this.acks.get(candidate)?.get(ack);
      if (records && records.some((r) => ackRecordMatches(r, ctx))) {
        return true;
      }
    }
    return false;
  }

  private nodePath(node: string | IConstruct) {
    // Normalize, remove leading / if it exists
    return (typeof node === 'string' ? node : node.node.path).replace(/^\//, '');
  }

  /**
   * Given 'a/b/c', return ['a/b/c', 'a/b', 'a']
   */
  private searchPaths(path: string) {
    const ret = new Array<string>();
    let start = 0;
    while (start < path.length) {
      let i = path.indexOf('/', start);
      if (i !== -1) {
        ret.push(path.substring(0, i));
        start = i + 1;
      } else {
        start = path.length;
      }
    }
    // Include the node's own full path, not just its ancestor prefixes. Without
    // this, an acknowledgement recorded on a construct is not found by has() when
    // a warning with the same id is later emitted on that same construct (the ack
    // is stored under the exact path, but searchPaths only yielded ancestors).
    ret.push(path);
    return ret.reverse();
  }
}

/**
 * Remove warning metadata from all constructs in a given scope
 *
 * No recursion to avoid blowing out the stack.
 */
function removeWarningDeep(construct: IConstruct, id: string, filters?: IWarningContextFilter[]) {
  const stack = [construct];

  while (stack.length > 0) {
    const next = stack.pop()!;
    removeWarning(next, id, filters);
    stack.push(...next.node.children);
  }
}

/**
 * Remove metadata from a construct node.
 *
 * This uses private APIs for now; we could consider adding this functionality
 * to the constructs library itself.
 */
function removeWarning(construct: IConstruct, id: string, filters?: IWarningContextFilter[]) {
  const meta: MetadataEntry[] | undefined = (construct.node as any)._metadata;
  if (!meta) { return; }

  const hasFilters = filters !== undefined && filters.length > 0;

  let i = 0;
  while (i < meta.length) {
    const m = meta[i];
    if (m.type === cxschema.ArtifactMetadataEntryType.WARN && (m.data as string).includes(ackTag(id))) {
      // Unfiltered acknowledgement removes every occurrence of the id (backwards compatible).
      // A filtered acknowledgement only removes occurrences whose recorded context matches.
      const remove = !hasFilters
        || filters!.every((f) => f.matches(WarningContexts.of(construct).get(construct, m.data as string) ?? {}));
      if (remove) {
        meta.splice(i, 1);
        continue;
      }
    }
    i += 1;
  }
}

/**
 * Remove info metadata from all constructs in a given scope
 *
 * No recursion to avoid blowing out the stack.
 */
function removeInfoDeep(construct: IConstruct, id: string) {
  const stack = [construct];

  while (stack.length > 0) {
    const next = stack.pop()!;
    removeInfo(next, id);
    stack.push(...next.node.children);
  }
}

/**
 * Remove metadata from a construct node.
 *
 * This uses private APIs for now; we could consider adding this functionality
 * to the constructs library itself.
 */
function removeInfo(construct: IConstruct, id: string) {
  const meta: MetadataEntry[] | undefined = (construct.node as any)._metadata;
  if (!meta) { return; }

  let i = 0;
  while (i < meta.length) {
    const m = meta[i];
    if (m.type === cxschema.ArtifactMetadataEntryType.INFO && (m.data as string).includes(ackTag(id))) {
      meta.splice(i, 1);
    } else {
      i += 1;
    }
  }
}

function ackTag(id: string) {
  return `[ack: ${id}]`;
}

/**
 * A single acknowledgement of a warning id, optionally narrowed to occurrences
 * whose call-site context matches every filter.
 */
interface AckRecord {
  readonly filters?: IWarningContextFilter[];
}

function ackRecordMatches(record: AckRecord, context: { [key: string]: string }): boolean {
  // No filters => suppress all occurrences of the id (backwards compatible).
  if (!record.filters || record.filters.length === 0) {
    return true;
  }
  // Filters are combined with AND.
  return record.filters.every((f) => f.matches(context));
}

/**
 * Tracks the structured context attached to emitted warnings, so a later
 * filtered acknowledgement can selectively purge only the matching occurrences.
 *
 * Keyed by (construct path, full warning message) — the same string stored as
 * the WARN metadata `data` — so multiple occurrences of one id with different
 * context on the same construct are disambiguated. There is a singleton
 * instance per `App`, mirroring `Acknowledgements`.
 */
class WarningContexts {
  public static of(scope: IConstruct): WarningContexts {
    const app = appOf(scope);
    if (!app) {
      return new WarningContexts();
    }

    const existing = (app as any)[WarningContexts.WARNING_CONTEXTS_SYM];
    if (existing) {
      return existing as WarningContexts;
    }

    const fresh = new WarningContexts();
    (app as any)[WarningContexts.WARNING_CONTEXTS_SYM] = fresh;
    return fresh;
  }

  private static WARNING_CONTEXTS_SYM = Symbol.for('@aws-cdk/core.WarningContexts');

  // construct path -> full warning message -> context
  private readonly contexts = new Map<string, Map<string, { [key: string]: string }>>();

  private constructor() {}

  public record(node: IConstruct, data: string, context: { [key: string]: string }) {
    const nodePath = this.nodePath(node);
    let byData = this.contexts.get(nodePath);
    if (!byData) {
      byData = new Map();
      this.contexts.set(nodePath, byData);
    }
    byData.set(data, context);
  }

  public get(node: IConstruct, data: string): { [key: string]: string } | undefined {
    return this.contexts.get(this.nodePath(node))?.get(data);
  }

  private nodePath(node: IConstruct) {
    return node.node.path.replace(/^\//, '');
  }
}
