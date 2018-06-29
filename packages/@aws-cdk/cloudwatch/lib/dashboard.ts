import { Construct, Token, tokenAwareJsonify } from "@aws-cdk/core";
import { cloudwatch } from "@aws-cdk/resources";
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

    constructor(parent: Construct, name: string, props?: DashboardProps) {
        super(parent, name);

        // WORKAROUND -- Dashboard cannot be updated if the DashboardName is missing.
        // This is a bug in CloudFormation, but we don't want CDK users to have a bad
        // experience. We'll generate a name here if you did not supply one.
        const dashboardName = (props && props.dashboardName) || this.generateDashboardName();

        new cloudwatch.DashboardResource(this, 'Resource', {
            dashboardName,
            dashboardBody: new Token(() => {
                const column = new Column(...this.rows);
                column.position(0, 0);
                return tokenAwareJsonify({ widgets: column.toJson() });
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
        // This will include the Stack name and is hence unique
        return this.path.replace('/', '-');
    }
}
