import { Construct } from '../core/construct';
import { capitalizePropertyNames, ignoreEmpty } from '../core/util';
import { CloudFormationToken } from './cloudformation-token';
import { Condition } from './condition';
import { CreationPolicy, DeletionPolicy, UpdatePolicy } from './resource-policy';
import { IDependable, Referenceable, StackElement } from './stack';

export interface ResourceProps {
  /**
   * CloudFormation resource type.
   */
  type: string;

  /**
   * CloudFormation properties.
   */
  properties?: any;
}

/**
 * Represents a CloudFormation resource.
 */
export class Resource extends Referenceable {
  /**
   * A decoration used to create a CloudFormation attribute property.
   * @param customName Custom name for the attribute (default is the name of the property)
   * NOTE: we return "any" here to satistfy jsii, which doesn't support lambdas.
   */
  public static attribute(customName?: string): any {
    return (prototype: any, key: string) => {
      const name = customName || key;
      Object.defineProperty(prototype, key, {
        get() {
          return (this as any).getAtt(name);
        }
      });
    };
  }

  /**
   * Options for this resource, such as condition, update policy etc.
   */
  public readonly options: ResourceOptions = {};

  /**
   * AWS resource type.
   */
  public readonly resourceType: string;

  /**
   * AWS resource properties
   */
  protected readonly properties: any;

  private dependsOn = new Array<IDependable>();

  /**
   * Creates a resource construct.
   * @param resourceType The CloudFormation type of this resource (e.g. AWS::DynamoDB::Table)
   */
  constructor(parent: Construct, name: string, props: ResourceProps) {
    super(parent, name);

    if (!props.type) {
      throw new Error('The `type` property is required');
    }

    this.resourceType = props.type;
    this.properties = props.properties || { };

    // 'name' is a special property included for resource constructs and passed
    // as 'name', but we don't want it to be serialized into the template.
    if (this.properties.name) {
      delete this.properties.name;
    }
  }

  /**
   * Returns a token for an runtime attribute of this resource.
   * Ideally, use generated attribute accessors (e.g. `resource.arn`), but this can be used for future compatibility
   * in case there is no generated attribute.
   * @param attributeName The name of the attribute.
   */
  public getAtt(attributeName: string) {
    return new CloudFormationToken({ 'Fn::GetAtt': [this.logicalId, attributeName] }, `${this.logicalId}.${attributeName}`);
  }

  /**
   * Adds a dependency on another resource.
   * @param other The other resource.
   */
  public addDependency(...other: IDependable[]) {
    this.dependsOn.push(...other);
  }

  /**
   * Emits CloudFormation for this resource.
   */
  public toCloudFormation(): object {
    try {
      return {
        Resources: {
          [this.logicalId]: {
            Type: this.resourceType,
            Properties: ignoreEmpty(this.renderProperties()),
            DependsOn: ignoreEmpty(this.renderDependsOn()),
            CreationPolicy:  capitalizePropertyNames(this.options.creationPolicy),
            UpdatePolicy: capitalizePropertyNames(this.options.updatePolicy),
            DeletionPolicy: capitalizePropertyNames(this.options.deletionPolicy),
            Metadata: ignoreEmpty(this.options.metadata),
            Condition: this.options.condition && this.options.condition.logicalId
          }
        }
      };
    } catch (e) {
      // Change message
      e.message = `While synthesizing ${this.path}: ${e.message}`;
      // Adjust stack trace (make it look like node built it, too...)
      const creationStack = ['--- resource created at ---', ...this.creationStackTrace].join('\n  at ');
      const problemTrace = e.stack.substr(e.stack.indexOf(e.message) + e.message.length);
      e.stack = `${e.message}\n  ${creationStack}\n  --- problem discovered at ---${problemTrace}`;
      // Re-throw
      throw e;
    }
  }

  protected renderProperties(): { [key: string]: any } {
    // FIXME: default implementation is not great, it should throw, but it avoids breaking all unit tests for now.
    return this.properties;
  }

  private renderDependsOn() {
    const logicalIDs = new Set<string>();
    for (const d of this.dependsOn) {
      addDependency(d);
    }

    return Array.from(logicalIDs);

    function addDependency(d: IDependable) {
      d.dependencyElements.forEach(dep => {
        const logicalId = (dep as StackElement).logicalId;
        if (logicalId) {
          logicalIDs.add(logicalId);
        }
      });

      // break if dependencyElements include only 'd', which means we reached a terminal.
      if (d.dependencyElements.length === 1 && d.dependencyElements[0] === d) {
        return;
      } else {
        d.dependencyElements.forEach(dep => addDependency(dep));
      }
    }
  }
}

export interface ResourceOptions {
  /**
   * A condition to associate with this resource. This means that only if the condition evaluates to 'true' when the stack
   * is deployed, the resource will be included. This is provided to allow CDK projects to produce legacy templates, but noramlly
   * there is no need to use it in CDK projects.
   */
  condition?: Condition;

  /**
   * Associate the CreationPolicy attribute with a resource to prevent its status from reaching create complete until
   * AWS CloudFormation receives a specified number of success signals or the timeout period is exceeded. To signal a
   * resource, you can use the cfn-signal helper script or SignalResource API. AWS CloudFormation publishes valid signals
   * to the stack events so that you track the number of signals sent.
   */
  creationPolicy?: CreationPolicy;

  /**
   * With the DeletionPolicy attribute you can preserve or (in some cases) backup a resource when its stack is deleted.
   * You specify a DeletionPolicy attribute for each resource that you want to control. If a resource has no DeletionPolicy
   * attribute, AWS CloudFormation deletes the resource by default. Note that this capability also applies to update operations
   * that lead to resources being removed.
   */
  deletionPolicy?: DeletionPolicy;

  /**
   * Use the UpdatePolicy attribute to specify how AWS CloudFormation handles updates to the AWS::AutoScaling::AutoScalingGroup
   * resource. AWS CloudFormation invokes one of three update policies depending on the type of change you make or whether a
   * scheduled action is associated with the Auto Scaling group.
   */
  updatePolicy?: UpdatePolicy;

  /**
   * Metadata associated with the CloudFormation resource. This is not the same as the construct metadata which can be added
   * using construct.addMetadata(), but would not appear in the CloudFormation template automatically.
   */
  metadata?: { [key: string]: any };
}
