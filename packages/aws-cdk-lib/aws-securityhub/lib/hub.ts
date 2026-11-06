import type { Construct } from 'constructs';
import { HubEvents } from './hub-events';
import { CfnHub } from './securityhub.generated';
import type { IResource } from '../../core';
import { RemovalPolicy, Resource } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { HubReference, IHubRef } from '../../interfaces/generated/aws-securityhub-interfaces.generated';

/** How Security Hub CSPM groups findings for controls shared by multiple standards. */
export enum ControlFindingGenerator {
  /** One finding per security control. */
  SECURITY_CONTROL = 'SECURITY_CONTROL',
  /** A separate finding for each standard's control. */
  STANDARD_CONTROL = 'STANDARD_CONTROL',
}

/** A Security Hub CSPM hub in one account and Region. */
export interface IHub extends IResource, IHubRef {
  /**
   * The hub ARN.
   * @attribute
   */
  readonly hubArn: string;
  /**
   * When Security Hub CSPM was enabled.
   * @attribute
   * @default - unknown for imported hubs
   */
  readonly hubSubscribedAt?: string;
  /** EventBridge rule factories for this hub. */
  readonly events: HubEvents;
}

/** Properties for enabling Security Hub CSPM in the stack's account and Region. */
export interface HubProps {
  /**
   * Automatically enable newly released controls in enabled standards.
   * @default true
   */
  readonly autoEnableControls?: boolean;
  /**
   * How to group control findings.
   * @default - Security Hub's default (SECURITY_CONTROL for newly enabled standalone accounts)
   */
  readonly controlFindingGenerator?: ControlFindingGenerator;
  /**
   * Enable Security Hub's designated default security standards.
   *
   * Security checks can require AWS Config recording and incur additional charges.
   * @default true
   */
  readonly enableDefaultStandards?: boolean;
  /**
   * Tags applied through the underlying CloudFormation resource.
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
  /**
   * What happens when the hub is removed from the stack.
   *
   * DESTROY disables Security Hub CSPM in this account and Region.
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}

abstract class HubBase extends Resource implements IHub {
  public abstract readonly hubArn: string;
  public readonly events: HubEvents = HubEvents.fromHub(this);

  public get hubRef(): HubReference {
    return { hubArn: this.hubArn };
  }
}

const HUB_SYMBOL = Symbol.for('@aws-cdk/aws-securityhub.Hub');

/**
 * Enable Security Hub CSPM in one AWS account and Region.
 *
 * Only one hub can exist per account and Region. Import an existing hub instead
 * of creating a second one. This construct does not configure Organizations.
 * @stateful
 */
@propertyInjectable
export class Hub extends HubBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-securityhub.Hub';

  /** Whether the object is a Hub. */
  public static isHub(x: any): x is Hub {
    return x !== null && typeof x === 'object' && HUB_SYMBOL in x;
  }

  /** Reference an existing hub without enabling or taking ownership of it. */
  public static fromHubArn(scope: Construct, id: string, hubArn: string): IHub {
    class Import extends HubBase {
      public readonly hubArn = hubArn;
    }
    return new Import(scope, id, { environmentFromArn: hubArn });
  }

  /** The underlying L1 resource for escape hatches. */
  public readonly resource: CfnHub;
  public readonly hubArn: string;
  /**
   * When Security Hub CSPM was enabled.
   * @attribute
   */
  public readonly hubSubscribedAt?: string;

  constructor(scope: Construct, id: string, props: HubProps = {}) {
    super(scope, id);
    addConstructMetadata(this, props);
    this.resource = new CfnHub(this, 'Resource', {
      autoEnableControls: props.autoEnableControls,
      controlFindingGenerator: props.controlFindingGenerator,
      enableDefaultStandards: props.enableDefaultStandards,
      tags: props.tags,
    });
    this.resource.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.RETAIN);
    this.hubArn = this.resource.attrArn;
    this.hubSubscribedAt = this.resource.attrSubscribedAt;
  }
}

Object.defineProperty(Hub.prototype, HUB_SYMBOL, { value: true });
