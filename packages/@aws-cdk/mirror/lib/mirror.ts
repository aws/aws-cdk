import cdk = require('@aws-cdk/cdk');
import fs = require('fs');
import { Link, Node, NodeLinks, NodeMetadata } from './model';

// tslint:disable-next-line:no-empty-interface
export interface MirrorProps {
}

/**
 * @experimental
 */
export class Mirror extends cdk.Construct {
  public static readonly FileName = 'mirror.json';

  constructor(scope: cdk.Construct, id: string, props: MirrorProps = {}) {
    super(scope, id);

    // tslint:disable-next-line:no-console
    console.error(props);
  }

  protected synthesize(session: cdk.ISynthesisSession) {
    const root = this.node.ancestors()[0];

    const visit = (construct: cdk.IConstruct): Node => {
      const children = construct.node.children.map(visit);
      const links = this.renderLinks(construct);
      const metadata = this.renderMetadata(construct);

      return {
        id: construct.node.id || 'App',
        path: construct.node.path,
        children: children.length === 0 ? undefined : children,
        metadata: Object.keys(metadata).length === 0 ? undefined : metadata,
        links: Object.keys(links).length === 0 ? undefined : links
      };
    };

    const model = visit(root);
    fs.writeFileSync('app.json', JSON.stringify(model, undefined, 2));

    session.store.writeJson(Mirror.FileName, model);
  }

  private renderMetadata(construct: cdk.IConstruct): NodeMetadata {
    if (cdk.Resource.isResource(construct)) {
      return {
        resourceType: construct.resourceType,
        logicalId: construct.node.resolve(construct.logicalId)
      };
    }

    return {};
  }

  private renderLinks(construct: cdk.IConstruct): NodeLinks {
    const links = new Array<Link>();

    for (const prop of Object.getOwnPropertyNames(construct)) {
      if (prop.startsWith('_')) {
        continue;
      }
      const value = (construct as any)[prop];
      if (typeof(value) !== 'string') {
        continue;
      }
      const resolvedValue = construct.node.resolve(value);
      const refs = findReferences(resolvedValue);

      for (const ref of refs) {

        const target = this.findResource(construct.node.stack, ref.logicalId);
        if (!target) {
          this.node.addWarning(`cannot find resource with logical ID ${ref.logicalId}`);
          continue;
        }

        links.push({
          sourcePath: construct.node.path,
          targetPath: target.node.path,
          attribute: ref.attribute
        });
      }
    }

    return links;
  }

  private findResource(stack: cdk.Stack, logicalId: string): cdk.Resource | undefined {
    return stack.node.findAll()
      .find(c => cdk.Resource.isResource(c) && stack.node.resolve(c.logicalId) === logicalId) as cdk.Resource;
  }
}

interface CloudFormationReference {
  logicalId: string;
  attribute?: string;
}

function findReferences(obj: any): CloudFormationReference[] {
  if (typeof(obj) !== 'object') {
    return [];
  }

  const result = new Array<CloudFormationReference>();
  if (Array.isArray(obj)) {
    for (const item of obj) {
      result.push(...findReferences(item));
    }

    return result;
  } else {
    const asRef = obj.Ref;
    if (asRef) {
      return [{ logicalId: asRef }];
    }

    const asGetAtt = obj['Fn::GetAtt'];
    if (asGetAtt) {
      return [{ logicalId: asGetAtt[0], attribute: asGetAtt[1] }];
    }

    // this is an object
    for (const v of Object.values(obj)) {
      result.push(...findReferences(v));
    }

    return result;
  }
}
