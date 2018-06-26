import { Construct, resolve, Token } from "@aws-cdk/core";
import { cloudwatch } from "@aws-cdk/resources";
import { Column, Row } from "./layout";
import { Widget } from "./widget";

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
    private readonly rows: Widget[] = [];

    constructor(parent: Construct, name: string, props?: DashboardProps) {
        super(parent, name);

        new cloudwatch.DashboardResource(this, 'Resource', {
            dashboardName: props && props.dashboardName,
            dashboardBody: new Token(() => {
                const column = new Column(...this.rows);
                column.position(0, 0);
                return JSON.stringify(resolve({ widgets: column.toJson() }));
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
    public add(...widgets: Widget[]) {
        if (widgets.length === 0) {
            return;
        }

        const w = widgets.length > 1 ? new Row(...widgets) : widgets[0];
        this.rows.push(w);
    }
}