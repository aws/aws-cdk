import { objLit, litVal } from "../value";
import { jsVal, arrayVal, splitSelect } from "../well-known-values";
import { ARN_FORMAT, FN, withMembers, ARN } from "../well-known-types";
import { IRenderable } from "../cm2";

export function analyzeArnFormat(arnFormat: string): ArnFormat {
  const parts = arnFormat.split(':');

  if (parts[0] !== 'arn') {
    throw new Error(`Does not look like an ARN: ${arnFormat}`);
  }
  if (parts[1] !== '${Partition}') {
    throw new Error(`Second ARN element must be \${Partition}: ${arnFormat}`);
  }
  const service = parts[2];

  if (!['', '${Region}'].includes(parts[3])) {
    throw new Error(`Fourth ARN element must be empty string or \${Region}: ${arnFormat}`);
  }
  const hasRegion = parts[3] === '${Region}';

  if (!['', '${Account}'].includes(parts[4])) {
    throw new Error(`Fifth ARN element must be empty string or \${Account}: ${arnFormat}`);
  }
  const hasAccount = parts[4] === '${Account}';

  // FIXME: Support ARNs with more `:`es than this

  const resourceParts = parts[5].split('/').map((p): ResourcePart => {
    // Very naive parsing right now.
    if (p.startsWith('${')) {
      if (!p.endsWith('}')) {
        throw new Error(`Does not look like placeholder: ${p}`);
      }
      return { type: 'attr', attr: p.substr(2, p.length - 3)} ;
    }
    if (p.includes('${')) {
      throw new Error(`Placeholder must be entire slashpart, not start halfway in the middle: ${p}`);
    }
    return { type: 'literal', literal: p };
  });

  return {
    service,
    hasRegion,
    hasAccount,
    resourceParts,
  };
}

export interface ArnFormat {
  readonly service: string;
  readonly hasRegion: boolean;
  readonly hasAccount: boolean;
  readonly resourceParts: ResourcePart[];
}

export type ResourcePart =
  | { readonly type: 'literal'; readonly literal: string }
  | { readonly type: 'attr'; readonly attr: string };


export function formatArnExpression(format: ArnFormat, stackVariable: IRenderable, fields: Record<string, IRenderable>) {
  return withMembers(stackVariable).callExp('formatArn')(objLit({
    service: jsVal(format.service),
    // Explicitly set to nothing if missing, otherwise default is to take from stack
    ...!format.hasRegion ? { region: jsVal('') } : {},
    ...!format.hasAccount ? { account: jsVal('') } : {},
    // We put everything into the 'resource' field.
    arnFormat: ARN_FORMAT.propExp('NO_RESOURCE_NAME'),
    resource: FN.callExp('join')(jsVal('/'),  arrayVal(format.resourceParts.map((rsPart): IRenderable => {
      switch (rsPart.type) {
        case 'literal':
          return jsVal(rsPart.literal);
        case 'attr':
          if (!fields[rsPart.attr]) {
            throw new Error(`Field in ARN string missing from arguments: ${rsPart.attr}`);
          }
          return fields[rsPart.attr];
      }
    }))),
  }));
}

export function splitArnExpression(format: ArnFormat, arnVariable: IRenderable, parsedVarName: IRenderable) {
  const splitExpression = litVal(ARN.callExp('split')(arnVariable, ARN_FORMAT.propExp('NO_RESOURCE_NAME')));

  const fieldAndIndex = format.resourceParts
    .flatMap((part, i) => part.type === 'attr' ? [[part.attr, i] as const] : []);

  const splitFields = Object.fromEntries(fieldAndIndex.map(([field, ix]) =>
    [field, splitSelect('/', ix, withMembers(parsedVarName).propExp('resource'))] as const));

  return { splitExpression, splitFields };
}

