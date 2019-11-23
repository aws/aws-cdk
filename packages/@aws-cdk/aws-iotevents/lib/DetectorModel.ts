import {
  IPrincipal,
  IRole,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "@aws-cdk/aws-iam";
import {
  Arn,
  Construct,
  IResource,
  Lazy,
  PhysicalName,
  Resource,
  Stack,
} from "@aws-cdk/core";
import { CfnDetectorModel } from "./iotevents.generated";
import { IState } from "./State";

/**
 * DetectorModel specification
 *
 * @export
 * @interface IDetectorModel
 * @extends {IResource}
 * @extends {IGrantable}
 */
export interface IDetectorModel extends IResource {
  /**
   * ARN for the {@link DetectorModel}
   *
   * @type {string}
   * @memberof IDetectorModel
   * @attribute
   */
  readonly detectorModelArn: string;
  /**
   * Name for the {@link DetectorModel}
   *
   * @type {string}
   * @memberof IDetectorModel
   * @attribute
   */
  readonly detectorModelName?: string;

  /**
   * The IAM service Role associated with this detector model.
   * This role is used as argument for {@link CfnDetectorModel} to
   * "grant permission to AWS IoT Events to perform its operations".
   *
   * @type {IRole}
   * @memberof IDetectorModel
   */
  readonly role?: IRole;
  /**
   * The grant principal for this Detector Model
   *
   * @type {IPrincipal}
   * @memberof IDetectorModel
   */
  readonly grantPrincipal?: IPrincipal;
  /**
   * Adds a statement to the IAM role assumed by the detector model
   *
   * @param {PolicyStatement} policyStatement
   * @memberof IDetectorModel
   */
  addToRolePolicy(policyStatement: PolicyStatement): void;
}

/**
 * Detector model attributes for import
 *
 * @export
 * @interface DetectorModelAttributes
 */
export interface DetectorModelAttributes {
  /**
   * Arn for the model
   *
   * @type {string}
   * @memberof DetectorModelAttributes
   */
  readonly detectorModelArn: string;

  /**
   * Name of the model
   *
   * @type {string}
   * @memberof DetectorModelAttributes
   * @default - generated from Arn
   */
  readonly detectorModelName?: string;

  /**
   * Arn for the role of the model
   *
   * @type {string}
   * @memberof DetectorModelAttributes
   * @default - no role
   */
  readonly roleArn?: string;
}
/**
 * Base class for an {@link DetectorModel}
 *
 * @export
 * @abstract
 * @class DetectorModelBase
 * @extends {Resource}
 * @implements {IDetectorModel}
 */
abstract class DetectorModelBase extends Resource
  implements IDetectorModel {
  public abstract readonly detectorModelArn: string;

  public abstract readonly detectorModelName?: string;
  public abstract readonly grantPrincipal?: IPrincipal;
  public abstract readonly role?: IRole;

  public addToRolePolicy(policyStatement: PolicyStatement): void {
    if (this.role) {
      this.role.addToPolicy(policyStatement);
    }
  }
}
/**
 * Props for Detector Model
 *
 * @export
 * @interface DetectorModelProps
 */
export interface DetectorModelProps {
  /**
   * Human readable description for the model
   *
   * @type {string}
   * @memberof DetectorModelProps
   * @default - no description
   */
  readonly description?: string;
  /**
   * Optional name for the model
   *
   * @type {string}
   * @memberof DetectorModelProps
   * @default - generated name
   */
  readonly detectorModelName?: string;
  /**
   * Service Role to assume while running the build.
   *
   * @default - A role will be created.
   */
  readonly role?: IRole;
  /**
   * The initial state
   *
   * @type {IState}
   * @memberof DetectorModelProps
   * @default - empty model
   */
  readonly entryPoint?: IState;

  /**
   * The key separating detectors
   *
   * @type {string}
   * @memberof DetectorModelProps
   * @default id
   */
  readonly key?: string;
}
/**
 * IoTEvents Detector Model
 *
 * @export
 * @class DetectorModel
 * @extends {DetectorModelBase}
 */
export class DetectorModel extends DetectorModelBase {
  public readonly detectorModelArn: string;
  public readonly detectorModelName?: string;
  public readonly grantPrincipal?: IPrincipal;
  public readonly role?: IRole;
  private initialState!: IState;
  public constructor(scope: Construct, id: string, props?: DetectorModelProps) {
    super(scope, id);
    this.role =
      (props && props.role) ||
      new Role(this, "Role", {
        roleName: PhysicalName.GENERATE_IF_NEEDED,
        assumedBy: new ServicePrincipal("iotevents.amazonaws.com"),
      });
    this.grantPrincipal = this.role;

    if (props && props.entryPoint) {
      this.initialState = props.entryPoint;
    }
    const resource = new CfnDetectorModel(this, "Resource", {
      detectorModelDescription: props && props.description,
      detectorModelName: props && props.detectorModelName,
      detectorModelDefinition: {
        initialStateName: Lazy.stringValue({
          produce: () =>
            this.initialState ? this.initialState.name : undefined,
        }),
        states: Lazy.anyValue({
          produce: () => {
            // Need a valid role to be able to process states and events
            if (this.role && this.initialState) {
              const visited: Set<IState> = new Set([this.initialState]);
              function visitor(state: IState) {
                state._relatedStates().forEach(nextState => {
                  if (!visited.has(nextState)) {
                    visited.add(nextState);
                    visitor(nextState);
                  }
                });
              }
              visitor(this.initialState);
              return [...visited].map(e => e._cfn(this.role!));
            } else {
              return [];
            }
          },
        }),
      },
      key: (props && props.key) || "id",
      roleArn: this.role ? this.role.roleArn : undefined,
    });
    this.detectorModelName = resource.detectorModelName || resource.ref;
    this.detectorModelArn = Arn.format(
      {
        service: "iotevents",
        resource: `detectorModel/${this.detectorModelName}`,
      },
      Stack.of(this)
    );
  }

  /**
   * Set the initial state for the state machine
   *
   * @param {IState} state
   * @memberof DetectorModel
   */
  public entryPoint(state: IState): void {
    this.initialState = state;
  }

  /**
   * Import detector model from Arn
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {string} detectorModelArn
   * @returns {IDetectorModel}
   * @memberof DetectorModel
   */
  public fromDetectorModelArn(
    scope: Construct,
    id: string,
    detectorModelArn: string
  ): IDetectorModel {
    return this.fromDetectorModelAttributes(scope, id, { detectorModelArn });
  }

  /**
   * Import detector model
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {DetectorModelAttributes} attrs
   * @returns {IDetectorModel}
   * @memberof DetectorModel
   */
  public fromDetectorModelAttributes(
    scope: Construct,
    id: string,
    attrs: DetectorModelAttributes
  ): IDetectorModel {
    const stack = Stack.of(scope);
    const detectorModelName =
      attrs.detectorModelName ||
      stack.parseArn(attrs.detectorModelArn).resource;

    const role = attrs.roleArn
      ? Role.fromRoleArn(stack, `${id}Role`, attrs.roleArn)
      : undefined;

    class Import extends DetectorModelBase {
      public readonly grantPrincipal = role;
      public readonly role = role;
      public readonly detectorModelArn = attrs.detectorModelArn;
      public readonly detectorModelName = detectorModelName;
    }

    return new Import(stack, id);
  }

  protected validate(): string[] {
    return [...this.validateInitialState()];
  }

  private validateInitialState(): string[] {
    if (!this.initialState) {
      return ["Missing initial state"];
    }
    return [];
  }
}
