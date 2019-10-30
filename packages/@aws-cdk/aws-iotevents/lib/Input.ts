import { ArnPrincipal, Grant, IGrantable, IPrincipal } from "@aws-cdk/aws-iam";
import {
  Arn,
  Construct,
  IResource,
  Lazy,
  Resource,
  Stack,
} from "@aws-cdk/core";
import { CfnInput } from "./iotevents.generated";

/**
 * Input specification
 *
 * @export
 * @interface IInput
 * @extends {IResource}
 * @extends {IGrantable}
 */
export interface IInput extends IResource {
  /**
   * The name of the input
   *
   * @type {string}
   * @memberof IInput
   * @attribute
   */
  readonly inputName: string;

  /**
   * Arn for input
   *
   * @type {string}
   * @memberof IInput
   * @attribute
   */
  readonly inputArn: string;

  /**
   * Add attribute to Input
   *
   * @param {string} attr
   * @memberof IInput
   */
  addAttribute(attr: string): void;

  /**
   * Add multiple attributes to Input
   *
   * @param {...string[]} attrs
   * @memberof IInput
   */
  addAttributes(...attrs: string[]): void;
}

/**
 * Import attributes for an Input
 *
 * @export
 * @interface InputAttributes
 */
export interface InputAttributes {
  /**
   * Arn of the input
   *
   * @type {string}
   * @memberof InputAttributes
   */
  readonly inputArn: string;
  /**
   * Name of the input
   *
   * @type {string}
   * @memberof InputAttributes
   * @default - generated from the Arn
   */
  readonly inputName?: string;
}

/**
 * Input properties
 *
 * @export
 * @interface InputProps
 */
export interface InputProps {
  /**
   * The Input name
   *
   * @type {string}
   * @memberof InputProps
   */
  readonly inputName: string;
  /**
   * An optional description of the input
   *
   * @type {string}
   * @memberof InputProps
   * @default - No description
   */
  readonly description?: string;
}

/**
 * Input base
 *
 * @export
 * @abstract
 * @class InputBase
 * @extends {Resource}
 * @implements {IInput}
 */
abstract class InputBase extends Resource implements IInput {
  public abstract readonly inputArn: string;
  public abstract readonly inputName: string;
  protected abstract readonly autoCreatePolicy: boolean;

  /**
   * Grant permission to resource
   *
   * @param {IGrantable} grantee
   * @param {...string[]} actions
   * @returns {Grant}
   * @memberof InputBase
   */
  public grant(grantee: IGrantable, ...actions: string[]): Grant {
    return Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.inputArn],
    });
  }
  /**
   * Grant push permission to resource
   *
   * @param {IGrantable} grantee
   * @returns {Grant}
   * @memberof InputBase
   */
  public grantPush(grantee: IGrantable): Grant {
    return this.grant(
      grantee,
      "iotevents:BatchPutMessage",
      "iotevents:BatchUpdateDetector",
      "iotevents:DescribeDetector",
      "iotevents:ListDetectors"
    );
  }
  public abstract addAttribute(attr: string): void;
  public abstract addAttributes(...attrs: string[]): void;
}

/**
 * IoTEvents Input
 *
 * @export
 * @class Input
 * @extends {InputBase}
 */
export class Input extends InputBase {
  /**
   * The grant principal
   *
   * @type {IPrincipal}
   * @memberof Input
   */
  public readonly grantPrincipal?: IPrincipal;
  public readonly inputArn: string;
  public readonly inputName: string;
  protected readonly autoCreatePolicy = true;
  private cfnAttributes: CfnInput.AttributeProperty[];

  public constructor(scope: Construct, id: string, props: InputProps) {
    super(scope, id);
    this.inputName = props.inputName;
    this.cfnAttributes = [];

    new CfnInput(this, "Resource", {
      inputDescription: props.description,
      inputName: props.inputName,
      inputDefinition: {
        attributes: Lazy.anyValue({ produce: () => this.cfnAttributes }),
      },
    });
    this.inputArn = Arn.format(
      {
        service: "iotevents",
        resource: `input/${this.inputName}`,
      },
      Stack.of(this)
    );
    this.grantPrincipal = new ArnPrincipal(this.inputArn);
  }

  /**
   * Import from Arn
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {string} inputArn
   * @returns {IInput}
   * @memberof Input
   */
  public fromInputArn(scope: Construct, id: string, inputArn: string): IInput {
    return this.fromInputAttributes(scope, id, { inputArn });
  }

  /**
   * Import from Attributes
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {InputAttributes} attrs
   * @returns {IInput}
   * @memberof Input
   */
  public fromInputAttributes(
    scope: Construct,
    id: string,
    attrs: InputAttributes
  ): IInput {
    const stack = Stack.of(scope);
    const inputName =
      attrs.inputName || stack.parseArn(attrs.inputArn).resource;

    class Import extends InputBase {
      public readonly inputArn = attrs.inputArn;
      public readonly inputName = inputName;
      protected readonly autoCreatePolicy = false;

      public addAttribute(_attr: string): void {
        throw new Error("Cannot add attribute to imported resource");
      }
      public addAttributes(..._attrs: string[]): void {
        throw new Error("Cannot add attributes to imported resource");
      }
    }

    return new Import(stack, id);
  }

  public addAttribute(attr: string): void {
    this.cfnAttributes.push({ jsonPath: attr });
  }

  public addAttributes(...attrs: string[]): void {
    attrs.forEach(attr => this.addAttribute(attr));
  }
}
