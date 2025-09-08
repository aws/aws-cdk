import { IResource, Resource } from 'aws-cdk-lib';
import { CfnGuardrailVersion } from 'aws-cdk-lib/aws-bedrock';
import { md5hash } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
// Internal Libs
import { Guardrail, IGuardrail } from './guardrails';

/******************************************************************************
 *                              COMMON
 *****************************************************************************/
/**
 * Represents a Guardrail Version, either created with CDK or imported.
 */
export interface IGuardrailVersion extends IResource {
  /**
   * The Guardrail to which this version belongs.
   */
  readonly guardrail: IGuardrail;

  /**
   * The ID of the guardrail version.
   * @example "1"
   */
  readonly guardrailVersion: string;
}

/******************************************************************************
 *                        ABSTRACT BASE CLASS
 *****************************************************************************/

/**
 * Abstract base class for a Guardrail Version.
 * Contains methods and attributes valid for Guardrail Versions either created
 * with CDK or imported.
 */
export abstract class GuardrailVersionBase extends Resource implements IGuardrailVersion {
  public abstract readonly guardrail: IGuardrail;
  public abstract readonly guardrailVersion: string;
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating a CDK-Managed Guardrail Version.
 */

/**
 * Properties for creating a Guardrail Version.
 */
export interface GuardrailVersionProps {
  /**
   * The guardrail to create a version for.
   */
  readonly guardrail: IGuardrail;
  /**
   * The description of the guardrail version.
   *
   * @example "This is a description of the guardrail version."
   * @default - No description is provided.
   */
  readonly description?: string;
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Attributes needed to create an import
 */
export interface GuardrailVersionAttributes {
  /**
   * The ARN of the guardrail.
   */
  readonly guardrailArn: string;
  /**
   * The ID of the guardrail version.
   * @example "1"
   */
  readonly guardrailVersion: string;
}
/******************************************************************************
 *                        NEW CONSTRUCT DEFINITION
 *****************************************************************************/
/**
 * Class to create a Guardrail Version with CDK.
 * @cloudformationResource AWS::Bedrock::GuardrailVersion
 */
@propertyInjectable
export class GuardrailVersion extends GuardrailVersionBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-alpha.GuardrailVersion';

  /**
   * Import a Guardrail Version from its attributes.
   */
  public static fromGuardrailVersionAttributes(
    scope: Construct,
    id: string,
    attrs: GuardrailVersionAttributes,
  ): IGuardrailVersion {
    class Import extends GuardrailVersionBase {
      public readonly guardrail = Guardrail.fromGuardrailAttributes(scope, `Guardrail-${id}`, {
        guardrailArn: attrs.guardrailArn,
        guardrailVersion: attrs.guardrailVersion,
      });
      public readonly guardrailVersion = attrs.guardrailVersion;
    }
    return new Import(scope, id);
  }

  public readonly guardrail: IGuardrail;
  public readonly guardrailVersion: string;
  /**
   * The underlying CfnGuardrailVersion resource.
   */
  private readonly _resource: CfnGuardrailVersion;

  /**
   *
   */
  constructor(scope: Construct, id: string, props: GuardrailVersionProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
    this.guardrail = props.guardrail;

    // Compute hash from guardrail, to recreate the resource when guardrail has changed
    const hash = md5hash(props.guardrail.lastUpdated ?? 'Default');

    this._resource = new CfnGuardrailVersion(this, `GuardrailVersion-${hash.slice(0, 16)}`, {
      guardrailIdentifier: this.guardrail.guardrailId,
      description: props.description,
    });

    this.guardrailVersion = this._resource.attrVersion;
  }
}
