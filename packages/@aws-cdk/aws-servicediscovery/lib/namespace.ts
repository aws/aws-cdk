import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { BaseServiceProps, Service } from './service';
import { CfnHttpNamespace, CfnPrivateDnsNamespace, CfnPublicDnsNamespace } from './servicediscovery.generated';

/**
 * A Service Discovery Namespace reference.
 */
export interface INamespace extends cdk.IConstruct {
  /**
   * The id of the namespace resource.
   */
  readonly namespaceId: string;

  /**
   * The ARN of the namespace resource.
   */
  readonly namespaceArn: string;

  /**
   * The name of the namespace resource.
   */
  readonly namespaceName: string;

  /**
   * Whether the namespace is an HTTP only namespace.
   */
  readonly httpOnly: boolean;

  /**
   * Creates a new service in this namespace.
   */
  createService(id: string, props: BaseServiceProps): Service;

  /**
   * Exports this namespace from the stack.
   */
  export(): NamespaceImportProps;
}

export interface NamespaceProps {
  /**
   * The name to assign to the namespace
   */
  name: string;

  /**
   * The description for the namespace
   *
   * @default No description
   */
  description?: string;

  /**
   * Whether the namespace should be HTTP only
   *
   * @default false
   */
  httpOnly?: boolean;

  /**
   * The vpc network to associate the namespace with. If vpc is
   * specified a private DNS namspace is created.
   *
   * @default No VPC
   */
  vpc?: ec2.IVpcNetwork;
}

export interface NamespaceImportProps {
  /**
   * The id of the namespace. At least one of namespaceId or namespaceArn must be
   * defined in order to initialize a namespace ref.
   */
  namespaceId?: string;

  /**
   * The ARN of the namespace. The id of the namespace will be parsed from the ARN.
   */
  namespaceArn?: string;

  /**
   * The name of the namespace.
   */
  namespaceName?: string;

  /**
   * Whether the namespace is an HTTP only namespace.
   */
  httpOnly: boolean;
}

export abstract class NamespaceBase extends cdk.Construct implements INamespace {
  public abstract readonly namespaceId: string;
  public abstract readonly namespaceArn: string;
  public abstract readonly namespaceName: string;
  public abstract readonly httpOnly: boolean;
  public abstract export(): NamespaceImportProps;

  /**
   * Creates a new service in this namespace
   */
  public createService(id: string, props: BaseServiceProps): Service {
    return new Service(this, id, {
      namespace: this,
      ...props,
    });
  }
}

export class Namespace extends NamespaceBase {
  /**
   * Creates a Namespace construct that represents an external namespace.
   *
   * @param parent The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param props A `NamespaceAttributes` object. Can be obtained from a call to
   * `namespace.export()` or manually created.
   */
  public static import(scope: cdk.Construct, id: string, props: NamespaceImportProps): INamespace {
    return new ImportedNamespace(scope, id, props);
  }

  public readonly namespaceId: string;
  public readonly namespaceArn: string;
  public readonly namespaceName: string;
  public readonly httpOnly: boolean;

  constructor(scope: cdk.Construct, id: string, props: NamespaceProps) {
    super(scope, id);

    this.httpOnly = props.httpOnly === undefined ? false : props.httpOnly;

    if (this.httpOnly && props.vpc) {
      throw new Error('Cannot combine `httpOnly` with `vpc`');
    }

    const resource = this.httpOnly
      ? new CfnHttpNamespace(this, 'Resource', {
          description: props.description,
          name: props.name
        })
      : props.vpc
        ? new CfnPrivateDnsNamespace(this, 'Resource', {
            description: props.description,
            name: props.name,
            vpc: props.vpc.vpcId,
          })
        : new CfnPublicDnsNamespace(this, 'Resource', {
            description: props.description,
            name: props.name
          });

    this.namespaceId = resource.ref;
    this.namespaceArn = resource.getAtt('Arn').toString();
    this.namespaceName = props.name;
  }

  /**
   * Exports this namespace from the stack.
   */
  public export(): NamespaceImportProps {
    return {
      namespaceId: new cdk.Output(this, 'NamespaceId', { value: this.namespaceId }).makeImportValue().toString(),
      namespaceArn: new cdk.Output(this, 'NamespaceArn', { value: this.namespaceArn }).makeImportValue().toString(),
      namespaceName: new cdk.Output(this, 'NamespaceName', { value: this.namespaceName }).makeImportValue().toString(),
      httpOnly: new cdk.Output(this, 'NamespaceHttpOnly', { value: this.httpOnly }).makeImportValue().toString()
    };
  }
}

export class ImportedNamespace extends NamespaceBase {
  public readonly namespaceId: string;
  public readonly namespaceArn: string;
  public readonly namespaceName: string;
  public readonly httpOnly: boolean;

  constructor(scope: cdk.Construct, id: string, private readonly props: NamespaceImportProps) {
    super(scope, id);

    const namespaceId = parseNamespaceId(this, props);
    if (!namespaceId) {
      throw new Error('`namespaceId` is required');
    }

    this.namespaceId = namespaceId;
    this.namespaceArn = parseNamespaceArn(this, props);
    this.namespaceName = props.namespaceName || '';
    this.httpOnly = props.httpOnly;
  }

  /**
   * Exports this namespace from the stack.
   */
  public export() {
    return this.props;
  }
}

function parseNamespaceArn(construct: cdk.IConstruct, props: NamespaceImportProps): string {
  if (props.namespaceArn) {
    return props.namespaceArn;
  }

  if (props.namespaceId) {
    return cdk.Stack.find(construct).formatArn({
      service: 'servicediscovery',
      resource: 'namespace',
      resourceName: props.namespaceId
    });
  }

  throw new Error('Cannot determine namespace ARN. At least `namespaceArn` or `namespaceId` is needed.');
}

export function parseNamespaceId(construct: cdk.IConstruct, props: NamespaceImportProps): string | undefined {
  if (props.namespaceId) {
    return props.namespaceId;
  }

  if (props.namespaceArn) {
    const resolved = construct.node.resolve(props.namespaceArn);
    if (typeof(resolved) === 'string') {
      const components = cdk.Stack.find(construct).parseArn(resolved);
      if (components.service !== 'servicediscovery') {
        throw new Error('Invalid ARN. Expecting `servicediscovery` service:' + resolved);
      }
      if (!components.resourceName) {
        throw new Error(`Namespace ARN must contain a resource name`);
      }
      return components.resourceName;
    }
  }

  return undefined;
}
