import { BuildOptions, CloudAssembly, CloudAssemblyBuilder } from '@aws-cdk/cx-api';
import { ConstructOrder, IConstruct } from './construct';

export interface ISynthesizable {
  synthesize(session: CloudAssemblyBuilder): void;
}

export interface SynthesisOptions extends BuildOptions {
  /**
   * The file store used for this session.
   * @default - creates a temporary directory
   */
  readonly outdir?: string;

  /**
   * Whether synthesis should skip the validation phase.
   * @default false
   */
  readonly skipValidation?: boolean;
}

export class Synthesizer {
  public synthesize(root: IConstruct, options: SynthesisOptions = { }): CloudAssembly {
    const session = new CloudAssemblyBuilder(options.outdir);

    // the three holy phases of synthesis: prepare, validate and synthesize

    // prepare
    root.node.prepareTree();

    // validate
    const validate = options.skipValidation === undefined ? true : !options.skipValidation;
    if (validate) {
      const errors = root.node.validateTree();
      if (errors.length > 0) {
        const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
        throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
      }
    }

    // synthesize (leaves first)
    for (const c of root.node.findAll(ConstructOrder.PostOrder)) {
      if (isSynthesizable(c)) {
        c.synthesize(session);
      }
    }

    // write session manifest and lock store
    return session.build(options);
  }
}

/**
 * @returns true if `obj` implements `ISynthesizable`.
 */
function isSynthesizable(obj: any): obj is ISynthesizable {
  return 'synthesize' in obj;
}
