import { CloudFormationJSON, Construct, Stack, Token } from "@aws-cdk/cdk";
import { cloudformation } from './cloudwatch.generated';
import { Column, Row } from "./layout";
import { IWidget } from "./widget";

export interface DashboardProps {
  /**
   * Name of the dashboard
   *
   * @default Automatically generated name
   */
  dashboardName?: string;
}

/**
 * A CloudWatch dashboard
 */
export class Dashboard extends Construct {
  private readonly rows: IWidget[] = [];
  private readonly dashboard: cloudformation.DashboardResource;

  constructor(parent: Construct, name: string, props?: DashboardProps) {
    super(parent, name);

    // WORKAROUND -- Dashboard cannot be updated if the DashboardName is missing.
    // This is a bug in CloudFormation, but we don't want CDK users to have a bad
    // experience. We'll generate a name here if you did not supply one.
    // See: https://github.com/awslabs/aws-cdk/issues/213
    const dashboardName = (props && props.dashboardName) || new Token(() => this.generateDashboardName());

    this.dashboard = new cloudformation.DashboardResource(this, 'Resource', {
      dashboardName,
      dashboardBody: new Token(() => {
        const column = new Column(...this.rows);
        column.position(0, 0);
        return CloudFormationJSON.stringify({ widgets: column.toJson() });
      })
    });
  }

  /**
   * Add a widget to the dashboard.
   *
   * Widgets given in multiple calls to add() will be laid out stacked on
   * top of each other.
   *
   * Multiple widgets added in the same call to add() will be laid out next
   * to each other.
   */
  public add(...widgets: IWidget[]) {
    if (widgets.length === 0) {
      return;
    }

    const w = widgets.length > 1 ? new Row(...widgets) : widgets[0];
    this.rows.push(w);
  }

  /**
   * Generate a unique dashboard name in case the user didn't supply one
   */
  private generateDashboardName(): string {
    // Combination of stack name and LogicalID, which are guaranteed to be unique.
    const stack = Stack.find(this);
    return stack.name + '-' + this.dashboard.logicalId;
  }
}
