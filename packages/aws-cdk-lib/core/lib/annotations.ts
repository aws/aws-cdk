import { IConstruct, MetadataEntry } from 'constructs';
import { App } from './app';
import * as cxschema from '../../cloud-assembly-schema';
import * as cxapi from '../../cx-api';

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
    Acknowledgements.of(this.scope).add(this.scope, id);

    // We don't use message currently, but encouraging people to supply it is good for documentation
    // purposes, and we can always add a report on it in the future.
    void(message);

    // Iterate over the construct and remove any existing instances of this warning
    // (addWarningV2 will prevent future instances of it)
    removeWarningDeep(this.scope, id);
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
   * @example
   * declare const myConstruct: Construct;
   * Annotations.of(myConstruct).addWarningV2('my-library:Construct.someWarning', 'Some message explaining the warning');
   *
   * @param id the unique identifier for the warning. This can be used to acknowledge the warning
   * @param message The warning message.
   */
  public addWarningV2(id: string, message: string) {
    if (!Acknowledgements.of(this.scope).has(this.scope, id)) {
      this.addMessage(cxschema.ArtifactMetadataEntryType.WARN, `${message} ${ackTag(id)}`);
    }
  }

  /**
   * Adds a warning metadata entry to this construct. Prefer using `addWarningV2`.
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
   * @param message The error message.
   */
  public addError(message: string) {
    this.addMessage(cxschema.ArtifactMetadataEntryType.ERROR, message);
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
      throw new Error(`${this.scope.node.path}: ${text}`);
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
      let normalizedMessage = typeof message === "string" ? message : JSON.stringify(message);
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
    const app = App.of(scope);
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

  private readonly acks = new Map<string, Set<string>>();

  private constructor() {}

  public add(node: string | IConstruct, ack: string) {
    const nodePath = this.nodePath(node);

    let arr = this.acks.get(nodePath);
    if (!arr) {
      arr = new Set();
      this.acks.set(nodePath, arr);
    }
    arr.add(ack);
  }

  public has(node: string | IConstruct, ack: string): boolean {
    for (const candidate of this.searchPaths(this.nodePath(node))) {
      if (this.acks.get(candidate)?.has(ack)) {
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
    return ret.reverse();
  }
}

/**
 * Remove warning metadata from all constructs in a given scope
 *
 * No recursion to avoid blowing out the stack.
 */
function removeWarningDeep(construct: IConstruct, id: string) {
  const stack = [construct];

  while (stack.length > 0) {
    const next = stack.pop()!;
    removeWarning(next, id);
    stack.push(...next.node.children);
  }
}

/**
 * Remove metadata from a construct node.
 *
 * This uses private APIs for now; we could consider adding this functionality
 * to the constructs library itself.
 */
function removeWarning(construct: IConstruct, id: string) {
  const meta: MetadataEntry[] | undefined = (construct.node as any)._metadata;
  if (!meta) { return; }

  let i = 0;
  while (i < meta.length) {
    const m = meta[i];
    if (m.type === cxschema.ArtifactMetadataEntryType.WARN && (m.data as string).includes(ackTag(id))) {
      meta.splice(i, 1);
    } else {
      i += 1;
    }
  }
}

function ackTag(id: string) {
  return `[ack: ${id}]`;
}
