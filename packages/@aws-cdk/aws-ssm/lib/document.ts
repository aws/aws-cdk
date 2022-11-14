import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDocument } from '.';

const DocumentNameReservedPrefixes = ['aws', 'amazon', 'amzn'];

/**
 * An SSM Document reference.
 */
export interface IDocument extends cdk.IResource {
  /**
   * The ARN of the document.
   *
   * @attribute
   */
  readonly documentArn: string;

  /**
   * The name of the document.
   *
   * @attribute
   */
  readonly documentName: string;

  /**
   * The type of the document.
   */
  readonly type: DocumentType;

  /**
   * The version of the document.
   */
  readonly version?: string;

  /**
   * Grants read permissions to the document.
   *
   * @param grantee the principal being granted permission.
   */
  grandRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grants execute permissions for the `grantee` on this SSM Document.
   *
   * @param grantee the role to be granted execute access for the document.
   */
  grantExecute(grantee: iam.IGrantable): iam.Grant;
}

/**
 * Basic features shared across all types of SSM Documents.
 */
export abstract class DocumentBase extends cdk.Resource implements IDocument {
  public abstract readonly documentArn: string;
  public abstract readonly documentName: string;
  public abstract readonly type: DocumentType;
  public abstract readonly version?: string;

  public grandRead(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: [
        'ssm:GetDocument',
        'ssm:DescribeDocument',
        'ssm:ListDocument',
        'ssm:ListDocumentVersions',
        'ssm:GetDocumentVersion',
        'ssm:GetAutomationExecution',
        'ssm:DescribeAutomationExecutions',
        'ssm:CancelCommand',
        'ssm:ListCommands',
        'ssm:ListCommandInvocations',
        'ssm:DescribeInstanceInformation',
        'ssm:DescribeDocumentParameters',
        'ssm:DescribeInstanceProperties',
      ],
      resourceArns: [this.documentArn],
    });
  }

  public grantExecute(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['ssm:StartAutomationExecution', 'ssm:StopAutomationExecution', 'ssm:SendCommand'],
      resourceArns: [this.documentArn],
    });
  }
}

/**
 * SSM Document type
 */
export enum DocumentType {
  /**
   * Automation Document
   */
  AUTOMATION = 'Automation',

  /**
   * Commmand Document
   */
  COMMAND = 'Command',
}

/**
 * Attributes for an SSM Document.
 */
export interface CommonDocumentAttributes {
  /**
   * The name of the document.
   */
  readonly documentName: string;

  /**
   * The version of the document to lookup.
   *
   * @default - no version is specified
   */
  readonly version?: string;
}

/**
 * Attributes describing an existing SSM Automation Document.
 */
export interface AutomationDocumentAttributes extends CommonDocumentAttributes {}

/**
 * Attributes describing an existing SSM Command Document.
 */
export interface CommandDocumentAttributes extends CommonDocumentAttributes {}

/**
 * UpdateMethod determines how the document is updated.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-document.html#cfn-ssm-document-updatemethod
 */
export enum UpdateMethod {
  /**
   * Any existing document with the same name is replaced.
   */
  REPLACE = 'Replace',

  /**
   * If you specify a new parameter, and the Name of the document
   * does not match an existing resource, a new document is created.
   * If the Name of the document matches an existing resource, the
   * existing document is updated, and the default version is changed
   * to the new version.
   */
  NEW_VERSION = 'NewVersion',
}

/**
 * Properties for defining a SSM Document.
 */
export interface DocumentBaseProps {
  /**
   * A name for the SSM document. The following strings as document name prefixes.
   * These are reserved by AWS for use as document name prefixes: `aws`, `amazon`, `amzn`.
   *
   * @default - AWS CloudFormation generates a unique physical ID and uses that ID
   * for the document name.
   */
  readonly documentName?: string;

  /**
   * The content of the SSM document.
   */
  readonly content: any;

  /**
   * If the document resource you specify in your template already exists, this parameter
   * determines whether a new version of the existing document is created, or the existing document
   * is replaced. If you specify  `UpdateMethod.NEW_VERSION`, a new parameter, and the Name of the document
   * does not match an existing resource, a new document is created. When you specify `UpdateMethod.NEW_VERSION`,
   * the default version of the document is changed to the newly created version. `UpdateMethod.NEW_VERSION` is
   * the default value.
   *
   * @default UpdateMethod.NEW_VERSION
   */
  readonly updateMethod?: UpdateMethod;

  /**
   * An optional field specifying the name version of the artifact you are creating
   * with the document. For example, `Release12.1`. This value is unique across all
   * versions of a document, and can't be changed.
   *
   * @default - the version is automatically generated.
   */
  readonly versionName?: string;
}

/**
 * Properties for a new SSM Automation Document.
 */
export interface AutomationDocumentProps extends DocumentBaseProps {}

/**
 * A SSM Automation document.
 *
 * @resource AWS::SSM::Document
 */
export class AutomationDocument extends DocumentBase implements IDocument {
  /**
   * Imports an existing Automation Document into the Stack from its name.
   *
   * @param scope the parent Construct.
   * @param id the id of the imported Automation Document.
   * @param documentName the name of the imported Automation Document.
   */
  public static fromAutomationDocumentName(
    scope: Construct,
    id: string,
    documentName: string,
  ): IDocument {
    return AutomationDocument.fromAutomationDocumentAttributes(scope, id, {
      documentName,
    });
  }

  /**
   * Import an existing Automation Document into the Stack from its ARN.
   *
   * @param scope the parent Construct.
   * @param id the id of the imported Automation Document.
   * @param documentArn the ARN of the imported Automation Document.
   */
  public static fromAutomationDocumentArn(
    scope: Construct,
    id: string,
    documentArn: string,
  ): IDocument {
    const parts = arnParts(documentArn);

    // must be an automation document
    if (parts.resource !== DocumentResourceIdentifier.Automation) {
      throw new Error(`Invalid SSM Automation Document ARN: ${documentArn}. Automation Document ARN must have resource type '${DocumentResourceIdentifier.Automation}'`);
    }

    if (!parts.resourceName) {
      throw new Error(`Invalid Automation SSM Document ARN: ${documentArn}, resource name is missing`);
    }

    // extract version if exists
    if (parts.resourceName.includes(':')) {
      const [documentName, version] = parts.resourceName.split(':');
      class Import extends DocumentBase {
        public readonly documentName = documentName;
        public readonly version = version;
        public readonly type = DocumentType.AUTOMATION;
        public readonly documentArn = documentArn;
      }

      return new Import(scope, id);
    } else {
      class Import extends DocumentBase {
        public readonly documentName = parts.resourceName!;
        public readonly version = undefined;
        public readonly type = DocumentType.AUTOMATION;
        public readonly documentArn = documentArn;
      }

      return new Import(scope, id);
    }
  }

  /**
   * Imports an existing Automation Document into the Stack from its attributes.
   *
   * @param scope the parent Construct.
   * @param id the id of the imported Automation Document.
   * @param attrs the attributes of the imported Automation Document.
   */
  public static fromAutomationDocumentAttributes(
    scope: Construct,
    id: string,
    attrs: AutomationDocumentAttributes,
  ): IDocument {
    class Import extends DocumentBase {
      public readonly documentName = attrs.documentName;
      public readonly version = attrs.version;
      public readonly type = DocumentType.AUTOMATION;
      public readonly documentArn = makeDocumentArn(this, attrs.documentName);
    }

    return new Import(scope, id);
  }

  public readonly documentArn: string;
  public readonly documentName: string;
  public readonly type: DocumentType = DocumentType.AUTOMATION;
  public readonly version?: string;

  constructor(scope: Construct, id: string, props: AutomationDocumentProps) {
    super(scope, id, {
      physicalName: props.documentName,
    });

    // validate document name
    validateDocumentName(this.physicalName);
    validateVersionName(props.versionName);
    this.validateSchemaVersion(props.content);

    const resource = new CfnDocument(this, 'Resource', {
      content: props.content,
      name: this.physicalName,
      documentType: this.type,
      updateMethod: props.updateMethod ?? UpdateMethod.NEW_VERSION,
      versionName: props.versionName,
    });

    this.documentName = resource.ref;
    this.documentArn = makeDocumentArn(this, this.physicalName);
  }

  private validateSchemaVersion(content: AutomationDocumentProps['content']) {
    // throw if missing schemaVersion
    if (!content.schemaVersion) {
      throw new Error(
        'Invalid SSM Automation Document Content: schemaVersion is required',
      );
    }

    /**
     * Documents of type Automation must use schema version 0.3.
     *
     * @see https://docs.aws.amazon.com/systems-manager/latest/userguide/document-schemas-features.html
     */
    if (content.schemaVersion !== '0.3') {
      throw new Error(`Invalid schema version: ${content.schemaVersion}. Documents of type Automation must use schema version 0.3.`);
    }
  }
}

/**
 * Properties for a new SSM Command Document.
 */
export interface CommandDocumentProps extends DocumentBaseProps {}

/**
 * A SSM Command document.
 *
 * @resource AWS::SSM::Document
 */
export class CommandDocument extends DocumentBase implements IDocument {
  /**
   * Creates a Command document from a document name.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param documentName The name of the document.
   */
  public static fromCommandDocumentName(
    scope: Construct,
    id: string,
    documentName: string,
  ): IDocument {
    return CommandDocument.fromCommandDocumentAttributes(scope, id, {
      documentName,
    });
  }

  /**
   * Creates a CommandDocument construct that represents an external document.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param documentArn The ARN of the document.
   */
  public static fromCommandDocumentArn(
    scope: Construct,
    id: string,
    documentArn: string,
  ): IDocument {
    const parts = arnParts(documentArn);

    // must be an command document
    if (parts.resource !== DocumentResourceIdentifier.Command) {
      throw new Error(
        `Invalid SSM Command Document ARN: ${documentArn}. Command Document ARN must have resource type of '${DocumentResourceIdentifier.Command}'`,
      );
    }

    if (!parts.resourceName) {
      throw new Error(
        `Invalid Command SSM Document ARN: ${documentArn}, resource name is missing`,
      );
    }

    if (parts.resourceName.includes(':')) {
      const [documentName, version] = parts.resourceName.split(':');
      class Import extends DocumentBase {
        public readonly documentName = documentName;
        public readonly version = version;
        public readonly type = DocumentType.COMMAND;
        public readonly documentArn = documentArn;
      }

      return new Import(scope, id);
    } else {
      class Import extends DocumentBase {
        public readonly documentName = parts.resourceName!;
        public readonly version = undefined;
        public readonly type = DocumentType.COMMAND;
        public readonly documentArn = documentArn;
      }

      return new Import(scope, id);
    }
  }

  /**
   * Imports an existing Command Document into the Stack from its attributes.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs The attributes of the imported document.
   */
  public static fromCommandDocumentAttributes(
    scope: Construct,
    id: string,
    attrs: CommandDocumentAttributes,
  ): IDocument {
    class Import extends DocumentBase {
      public readonly documentName = attrs.documentName;
      public readonly version = attrs.version;
      public readonly type = DocumentType.COMMAND;
      public readonly documentArn = makeDocumentArn(this, attrs.documentName);
    }

    return new Import(scope, id);
  }

  public readonly documentArn: string;
  public readonly documentName: string;
  public readonly type: DocumentType = DocumentType.COMMAND;
  public readonly version?: string;

  constructor(scope: Construct, id: string, props: CommandDocumentProps) {
    super(scope, id, {
      physicalName: props.documentName,
    });

    // validate document name
    validateDocumentName(this.physicalName);
    validateVersionName(props.versionName);
    this.validateSchemaVersion(props.content);

    const resource = new CfnDocument(this, 'Resource', {
      content: props.content,
      name: this.physicalName,
      documentType: this.type,
      updateMethod: props.updateMethod ?? UpdateMethod.NEW_VERSION,
      versionName: props.versionName,
    });

    this.documentName = resource.ref;
    this.documentArn = makeDocumentArn(this, this.physicalName);
  }

  private validateSchemaVersion(content: CommandDocumentProps['content']) {
    // throw if missing schemaVersion
    if (!content.schemaVersion) {
      throw new Error(
        'Invalid SSM Command Document Content: schemaVersion is required',
      );
    }

    /**
     * Documents of type Command can use schema version 1.2, 2.0, or 2.2. We recommend that you create documents that use
     * schema version 2.2.
     *
     * @see https://docs.aws.amazon.com/systems-manager/latest/userguide/document-schemas-features.html
     */
    if (
      content.schemaVersion !== '1.2' &&
      content.schemaVersion !== '2.0' &&
      content.schemaVersion !== '2.2'
    ) {
      throw new Error(`Invalid schema version: ${content.schemaVersion}. Documents of type Command can use schema version 1.2, 2.0, or 2.2.`);
    }
  }
}

const DocumentResourceIdentifier = {
  [DocumentType.AUTOMATION]: 'automation-definition',
  [DocumentType.COMMAND]: 'document',
};

function arnParts(documentArn: string): cdk.ArnComponents {
  return cdk.Arn.split(documentArn, cdk.ArnFormat.SLASH_RESOURCE_NAME);
}

function makeDocumentArn(construct: IDocument, documentName: string): string {
  return cdk.Arn.format(
    {
      service: 'ssm',
      resource: DocumentResourceIdentifier[construct.type as keyof typeof DocumentResourceIdentifier],
      resourceName: `${documentName}${construct.version ? `:${construct.version}` : ''}`,
      account: containsReservedPrefix(documentName) ? '' : undefined,
    },
    cdk.Stack.of(construct),
  );
}

function validateDocumentName(documentName: string) {
  if (cdk.Token.isUnresolved(documentName)) {
    return;
  } // validation is not possible
  if (documentName.length < 3 || documentName.length > 128) {
    throw new Error(
      `Document name must be between 3 and 128 characters. Received name: ${documentName} with length: ${documentName.length}`,
    );
  }

  if (containsReservedPrefix(documentName)) {
    throw new Error(
      `Document name ${documentName} is not allowed. Document name prefixes aws, amazon, amzn are reserved by AWS.`,
    );
  }

  if (!documentName.match(/^[a-zA-Z0-9_\-\.]{3,128}$/)) {
    throw new Error(
      `Document name must only contain letters, numbers, and the following 3 symbols _-.; got ${documentName}`,
    );
  }
}

function containsReservedPrefix(name: string) {
  return DocumentNameReservedPrefixes.some(prefix => name.toLowerCase().startsWith(prefix));
}

function validateVersionName(versionName?: string) {
  if (!versionName || cdk.Token.isUnresolved(versionName)) {
    return;
  } // versionName is optional
  if (versionName.length < 1 || versionName.length > 128) {
    throw new Error(
      `Version Name must be between 1 and 128 characters. Received versionName: ${versionName} with length: ${versionName.length}`,
    );
  }

  if (!versionName.match(/^[a-zA-Z0-9_\-\.]{1,128}$/)) {
    throw new Error(
      `Version Name must only contain letters, numbers, and the following 3 symbols _-.; got ${versionName}`,
    );
  }
}
