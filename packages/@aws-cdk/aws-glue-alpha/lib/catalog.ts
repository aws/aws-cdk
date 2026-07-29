import type { CatalogReference, ICatalogRef } from 'aws-cdk-lib/aws-glue';
import { CfnCatalog, CfnDataCatalogEncryptionSettings } from 'aws-cdk-lib/aws-glue';
import type * as iam from 'aws-cdk-lib/aws-iam';
import type * as kms from 'aws-cdk-lib/aws-kms';
import { KeyGrants } from 'aws-cdk-lib/aws-kms';
import type { IResource } from 'aws-cdk-lib/core';
import { Annotations, ArnFormat, Resource, Stack, Token } from 'aws-cdk-lib/core';
import type { IBox } from 'aws-cdk-lib/core/lib/helpers-internal';
import { Box, noBoxStackTraces } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';

/**
 * The encryption-at-rest mode for a Glue Data Catalog.
 *
 * @see https://docs.aws.amazon.com/glue/latest/webapi/API_EncryptionAtRest.html#Glue-Type-EncryptionAtRest-CatalogEncryptionMode
 */
export enum CatalogEncryptionMode {
  /**
   * Encryption at rest is disabled.
   */
  DISABLED = 'DISABLED',

  /**
   * Server-side encryption (SSE) with an AWS KMS key.
   */
  SSE_KMS = 'SSE-KMS',

  /**
   * Server-side encryption (SSE) with an AWS KMS key, using a service role that
   * AWS Glue assumes to access the key on your behalf.
   */
  SSE_KMS_WITH_SERVICE_ROLE = 'SSE-KMS-WITH-SERVICE-ROLE',
}

/**
 * Encryption-at-rest configuration for a Glue Data Catalog.
 *
 * The Data Catalog encryption at rest and the connection password encryption
 * are independent: enabling one does not require the other, and each may use a
 * different KMS key.
 *
 * @see https://docs.aws.amazon.com/glue/latest/webapi/API_EncryptionAtRest.html
 */
export class DataCatalogEncryptionAtRest {
  /**
   * Disable encryption at rest for the Data Catalog.
   */
  public static disabled(): DataCatalogEncryptionAtRest {
    return new DataCatalogEncryptionAtRest(CatalogEncryptionMode.DISABLED);
  }

  /**
   * Encrypt the Data Catalog at rest with an AWS KMS key.
   *
   * @param key the KMS key to use. If omitted, an AWS-managed key is used and
   * the key is not exposed as a grantable resource.
   */
  public static kms(key?: kms.IKey): DataCatalogEncryptionAtRest {
    return new DataCatalogEncryptionAtRest(CatalogEncryptionMode.SSE_KMS, key);
  }

  /**
   * Encrypt the Data Catalog at rest with an AWS KMS key, accessed through a
   * service role that AWS Glue assumes on your behalf.
   *
   * When a customer-managed `key` is provided, the `role` is automatically
   * granted `kms:Encrypt`/`kms:Decrypt`/`kms:GenerateDataKey*` on it.
   *
   * @param role the service role that AWS Glue assumes to access the key.
   * @param key the KMS key to use. If omitted, an AWS-managed key is used and
   * the key is not exposed as a grantable resource.
   */
  public static kmsWithServiceRole(role: iam.IRole, key?: kms.IKey): DataCatalogEncryptionAtRest {
    return new DataCatalogEncryptionAtRest(CatalogEncryptionMode.SSE_KMS_WITH_SERVICE_ROLE, key, role);
  }

  /**
   * The encryption mode.
   */
  public readonly mode: CatalogEncryptionMode;

  /**
   * The customer-managed KMS key used for encryption at rest, if any.
   */
  public readonly kmsKey?: kms.IKeyRef;

  /**
   * The service role that AWS Glue assumes to access the KMS key, if any.
   */
  public readonly serviceRole?: iam.IRole;

  private constructor(mode: CatalogEncryptionMode, kmsKey?: kms.IKeyRef, serviceRole?: iam.IRole) {
    this.mode = mode;
    this.kmsKey = kmsKey;
    this.serviceRole = serviceRole;
  }
}

/**
 * Connection-password encryption configuration for a Glue Data Catalog.
 *
 * When enabled, the Data Catalog encrypts the password as part of
 * `CreateConnection` or `UpdateConnection` and stores it in the
 * `ENCRYPTED_PASSWORD` field of the connection properties. This is independent
 * from catalog encryption at rest, and may use a different KMS key.
 *
 * @see https://docs.aws.amazon.com/glue/latest/webapi/API_ConnectionPasswordEncryption.html
 */
export interface ConnectionPasswordEncryption {
  /**
   * The KMS key used to encrypt connection passwords.
   *
   * @default - an AWS-managed key is used and the key is not exposed as a grantable resource.
   */
  readonly kmsKey?: kms.IKeyRef;

  /**
   * Whether passwords remain encrypted in the responses of `GetConnection` and
   * `GetConnections`. This takes effect independently from catalog encryption.
   *
   * @default true
   */
  readonly returnConnectionPasswordEncrypted?: boolean;
}

/**
 * A Glue Data Catalog, either the implicit account-wide catalog or one created
 * as an `AWS::Glue::Catalog` resource.
 */
export interface ICatalog extends IResource, ICatalogRef {
  /**
   * The id of the catalog (for the account-wide catalog, the AWS account id).
   * @attribute
   */
  readonly catalogId: string;

  /**
   * The ARN of the catalog.
   * @attribute
   */
  readonly catalogArn: string;

  /**
   * The customer-managed KMS key used for the catalog's encryption at rest, if
   * one was configured.
   *
   * Undefined when encryption is disabled or an AWS-managed key is used. Grant
   * access to it directly, e.g. `catalog.encryptionKey?.grantEncrypt(grantee)`.
   */
  readonly encryptionKey?: kms.IKeyRef;

  /**
   * The customer-managed KMS key used to encrypt connection passwords, if one
   * was configured.
   *
   * Undefined when password encryption uses an AWS-managed key or is not
   * configured. Grant access to it directly, e.g.
   * `catalog.connectionPasswordKey?.grantEncrypt(grantee)`.
   */
  readonly connectionPasswordKey?: kms.IKeyRef;

  /**
   * Configure encryption at rest for this catalog.
   *
   * Calling this again overwrites the previous encryption-at-rest configuration.
   */
  encryptAtRest(encryption: DataCatalogEncryptionAtRest): void;

  /**
   * Configure connection-password encryption for this catalog.
   *
   * Calling this again overwrites the previous connection-password configuration.
   */
  encryptConnectionPasswords(encryption: ConnectionPasswordEncryption): void;
}

/**
 * Tracks, per stack, the catalog ids for which a
 * `CfnDataCatalogEncryptionSettings` resource has already been emitted, so we
 * can warn when two catalogs would race to overwrite the same catalog's
 * settings via `PutDataCatalogEncryptionSettings`.
 */
const emittedEncryptionSettings = new WeakMap<Stack, Set<string>>();

/**
 * Base class for all `ICatalog` implementations. Owns the shared, deferred
 * `CfnDataCatalogEncryptionSettings` wiring so that a single instance only ever
 * emits one settings resource, targeting its own `catalogId`.
 */
@noBoxStackTraces
abstract class CatalogBase extends Resource implements ICatalog {
  public abstract readonly catalogId: string;
  public abstract readonly catalogArn: string;

  private _encryptionKey?: kms.IKeyRef;
  private _connectionPasswordKey?: kms.IKeyRef;

  private readonly _encryptionAtRest: IBox<CfnDataCatalogEncryptionSettings.EncryptionAtRestProperty | undefined> =
    Box.fromValue(undefined);
  private readonly _connectionPassword: IBox<CfnDataCatalogEncryptionSettings.ConnectionPasswordEncryptionProperty | undefined> =
    Box.fromValue(undefined);

  private encryptionSettingsResource?: CfnDataCatalogEncryptionSettings;

  public get encryptionKey(): kms.IKeyRef | undefined {
    return this._encryptionKey;
  }

  public get connectionPasswordKey(): kms.IKeyRef | undefined {
    return this._connectionPasswordKey;
  }

  public get catalogRef(): CatalogReference {
    return {
      resourceArn: this.catalogArn,
    };
  }

  public encryptAtRest(encryption: DataCatalogEncryptionAtRest): void {
    this._encryptionKey = encryption.kmsKey;

    // Auto-grant the service role access to the customer-managed key it needs
    // to encrypt and decrypt catalog data. Nothing to grant for an AWS-managed
    // key (we don't own its key policy).
    if (encryption.serviceRole && encryption.kmsKey) {
      KeyGrants.fromKey(encryption.kmsKey).encryptDecrypt(encryption.serviceRole);
    }

    this._encryptionAtRest.set({
      catalogEncryptionMode: encryption.mode,
      sseAwsKmsKeyId: encryption.kmsKey?.keyRef.keyArn,
      catalogEncryptionServiceRole: encryption.serviceRole?.roleArn,
    });
    this.ensureEncryptionSettings();
  }

  public encryptConnectionPasswords(encryption: ConnectionPasswordEncryption): void {
    this._connectionPasswordKey = encryption.kmsKey;

    this._connectionPassword.set({
      kmsKeyId: encryption.kmsKey?.keyRef.keyArn,
      returnConnectionPasswordEncrypted: encryption.returnConnectionPasswordEncrypted ?? true,
    });
    this.ensureEncryptionSettings();
  }

  /**
   * Create the single, deferred `CfnDataCatalogEncryptionSettings` resource on
   * first configuration. Subsequent mutations reuse it, so one catalog instance
   * never emits more than one settings resource. When no block is configured no
   * resource is created, avoiding an empty settings resource that would reset
   * the catalog on deploy.
   */
  private ensureEncryptionSettings(): void {
    if (this.encryptionSettingsResource) {
      return;
    }

    const settings = Box.combine(
      { encryptionAtRest: this._encryptionAtRest, connectionPasswordEncryption: this._connectionPassword },
      ({ encryptionAtRest, connectionPasswordEncryption }) => ({
        encryptionAtRest,
        connectionPasswordEncryption,
      }),
    );

    this.encryptionSettingsResource = new CfnDataCatalogEncryptionSettings(this, 'EncryptionSettings', {
      catalogId: this.catalogId,
      dataCatalogEncryptionSettings: Token.asAny(settings),
    });

    this.warnOnDuplicateSettings();
  }

  private warnOnDuplicateSettings(): void {
    const stack = Stack.of(this);
    let ids = emittedEncryptionSettings.get(stack);
    if (!ids) {
      ids = new Set();
      emittedEncryptionSettings.set(stack, ids);
    }
    if (ids.has(this.catalogId)) {
      Annotations.of(this).addWarningV2(
        '@aws-cdk/aws-glue-alpha:duplicateCatalogEncryptionSettings',
        `multiple Data Catalog encryption settings target catalog "${this.catalogId}" in this stack; ` +
        'they overwrite one another via PutDataCatalogEncryptionSettings and the result is order-dependent. ' +
        'Configure encryption on a single catalog (e.g. Catalog.forAccount(this)) instead.',
      );
    } else {
      ids.add(this.catalogId);
    }
  }
}

/**
 * Construction properties for a `Catalog`.
 */
export interface CatalogProps {
  /**
   * The name of the catalog.
   */
  readonly catalogName: string;

  /**
   * A description of the catalog.
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * Encryption-at-rest configuration for the catalog.
   *
   * @default - encryption at rest is not managed by CDK (the catalog default applies)
   */
  readonly encryptionAtRest?: DataCatalogEncryptionAtRest;

  /**
   * Connection-password encryption configuration for the catalog.
   *
   * @default - connection-password encryption is not managed by CDK
   */
  readonly connectionPasswordEncryption?: ConnectionPasswordEncryption;
}

/**
 * A Glue Data Catalog.
 *
 * Use `Catalog.forAccount(scope)` to obtain the implicit account-wide catalog
 * (for example, to configure Data Catalog encryption), or `new Catalog(...)` to
 * create an `AWS::Glue::Catalog` resource.
 */
@propertyInjectable
export class Catalog extends CatalogBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-glue-alpha.Catalog';

  /**
   * Obtain the implicit, account-wide Data Catalog.
   *
   * The account catalog is not a CloudFormation resource; it always exists. This
   * returns a stack-scoped singleton, so repeated calls within the same stack
   * return the same instance and share a single encryption-settings resource,
   * avoiding competing `PutDataCatalogEncryptionSettings` calls.
   */
  public static forAccount(scope: Construct): ICatalog {
    const stack = Stack.of(scope);
    const uid = '@aws-cdk.aws-glue-alpha.AccountCatalog';
    const existing = stack.node.tryFindChild(uid);
    return (existing as AccountCatalog) ?? new AccountCatalog(stack, uid);
  }

  /**
   * Import an existing catalog by its ARN.
   */
  public static fromCatalogArn(scope: Construct, id: string, catalogArn: string): ICatalog {
    const stack = Stack.of(scope);
    const catalogId = stack.splitArn(catalogArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName ?? stack.account;
    return new ImportedCatalog(scope, id, catalogId, catalogArn);
  }

  /**
   * Import an existing catalog by its id.
   */
  public static fromCatalogId(scope: Construct, id: string, catalogId: string): ICatalog {
    const stack = Stack.of(scope);
    const catalogArn = stack.formatArn({ service: 'glue', resource: 'catalog', resourceName: catalogId });
    return new ImportedCatalog(scope, id, catalogId, catalogArn);
  }

  public readonly catalogId: string;
  public readonly catalogArn: string;

  private readonly resource: CfnCatalog;

  constructor(scope: Construct, id: string, props: CatalogProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.resource = new CfnCatalog(this, 'Resource', {
      name: props.catalogName,
      description: props.description,
    });

    this.catalogId = this.resource.attrCatalogId;
    this.catalogArn = this.resource.attrResourceArn;

    if (props.encryptionAtRest) {
      this.encryptAtRest(props.encryptionAtRest);
    }
    if (props.connectionPasswordEncryption) {
      this.encryptConnectionPasswords(props.connectionPasswordEncryption);
    }
  }
}

/**
 * The implicit, account-wide Data Catalog. Not a CloudFormation resource; only
 * the encryption settings it carries are synthesized.
 */
class AccountCatalog extends CatalogBase {
  public readonly catalogId: string;
  public readonly catalogArn: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    const stack = Stack.of(this);
    this.catalogId = stack.account;
    // The account catalog's id is implicitly the account id, so the ARN has no resource name.
    this.catalogArn = stack.formatArn({ service: 'glue', resource: 'catalog' });
  }
}

/**
 * An imported catalog. Encryption settings attached here are emitted as a
 * sibling `CfnDataCatalogEncryptionSettings` targeting the imported catalog id.
 */
class ImportedCatalog extends CatalogBase {
  public readonly catalogId: string;
  public readonly catalogArn: string;

  constructor(scope: Construct, id: string, catalogId: string, catalogArn: string) {
    super(scope, id);
    this.catalogId = catalogId;
    this.catalogArn = catalogArn;
  }
}
