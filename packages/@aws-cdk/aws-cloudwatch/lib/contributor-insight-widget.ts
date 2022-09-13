import * as cdk from '@aws-cdk/core';
import { MetricWidgetProps, LegendPosition } from "./graph";
import { IInsightRule } from "./insight-rule";
import { ConcreteWidget } from "./widget";

/**
 * The number of top contributors to show.
 */
 export enum TopContributors {
    /**
     * The top 10 contributors
     */
    TOP10 = 10,
    /**
     * The top 25 contributors
     */
    TOP25 = 25,
    /**
     * The top 50 contributors
     */
    TOP50 = 50,
    /**
     * The top 100 contributors
     */
    TOP100 = 100,
  }

  /**
 * Statistic to use over the aggregation period
 */
export enum OrderStatistic {
    /**
     * All values submitted for the matching metric added together.
     * This statistic can be useful for determining the total volume of a metric.
     */
    SUM = 'Sum',
    /**
     * The highest value observed during the specified period.
     * You can use this value to determine high volumes of activity for your application.
     */
    MAXIMUM = 'Maximum'
}

/**
 * Properties for a ContributorInsightsWidget
 */
export interface ContributorInsightsWidgetProps extends MetricWidgetProps {
    /**
     * Account the contributor insights rule comes from.
     */
    readonly account?: string;
    /**
     * Number of top contributors to display.
     * 
     * @default - Top 10
     */
    readonly contributorSelection?: TopContributors;
    /**
     * CloudWatch InsightRule to display.
     */
    readonly insightRule: IInsightRule;
    /**
     * Position of the legend.
     * 
     * @default - bottom
     */
    readonly legendPosition?: LegendPosition;
    /**
     * The default statistic to use for aggregating.
     * 
     * @default OrderStatistic.SUM
     */
    readonly orderStatistic?: OrderStatistic;
    /**
     * The default period for all metrics in this widget.
     * The period is the length of time represented by one data point on the graph.
     * 
     * @default cdk.Duration.minutes(5)
     */
    readonly period?: cdk.Duration;
}

/**
 * Display Contrbibutor Insights
 */
export class ContributorInsightsWidget extends ConcreteWidget {
    private readonly props: ContributorInsightsWidgetProps;

    constructor(props: ContributorInsightsWidgetProps) {
        super(props.width || 6, props.height || 6);
        this.props = props;
    }

    toJson(): any[] {
        return [
            {
                type: 'metric',
                width: this.width,
                height: this.height,
                x: this.x,
                y: this.y,
                properties: {
                    accountId: this.props.account,
                    insightRule: {
                        maxContributorCount: this.props.contributorSelection || TopContributors.TOP10,
                        orderBy: this.props.orderStatistic || OrderStatistic.SUM,
                        ruleName: this.props.insightRule.ruleName,
                    },
                    legend: { position: this.props.legendPosition || LegendPosition.BOTTOM },
                    period: (this.props.period || cdk.Duration.minutes(5)).toSeconds(),
                    region: this.props.region || cdk.Aws.REGION,
                    title: this.props.title,
                    view: 'timeSeries',
                },
            },
          ];
    }
}
