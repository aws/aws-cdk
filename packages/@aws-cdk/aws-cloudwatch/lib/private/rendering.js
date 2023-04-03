"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricSet = exports.allMetricsGraphJson = void 0;
const drop_empty_object_at_the_end_of_an_array_token_1 = require("./drop-empty-object-at-the-end-of-an-array-token");
const env_tokens_1 = require("./env-tokens");
const metric_util_1 = require("./metric-util");
const object_1 = require("./object");
/**
 * Return the JSON structure which represents these metrics in a graph.
 *
 * Depending on the metric type (stat or expression), one `Metric` object
 * can render to multiple time series.
 *
 * - Top-level metrics will be rendered visibly, additionally added metrics will
 *   be rendered invisibly.
 * - IDs used in math expressions need to be either globally unique, or refer to the same
 *   metric object.
 *
 * This will be called by GraphWidget, no need for clients to call this.
 */
function allMetricsGraphJson(left, right) {
    // Add metrics to a set which will automatically expand them recursively,
    // making sure to retain conflicting the visible one on conflicting metrics objects.
    const mset = new MetricSet();
    mset.addTopLevel('left', ...left);
    mset.addTopLevel('right', ...right);
    // Render all metrics from the set.
    return mset.entries.map(entry => new drop_empty_object_at_the_end_of_an_array_token_1.DropEmptyObjectAtTheEndOfAnArray(metricGraphJson(entry.metric, entry.tag, entry.id)));
}
exports.allMetricsGraphJson = allMetricsGraphJson;
function metricGraphJson(metric, yAxis, id) {
    const config = metric.toMetricConfig();
    const ret = [];
    const options = { ...config.renderingProperties };
    metric_util_1.dispatchMetric(metric, {
        withStat(stat) {
            ret.push(stat.namespace, stat.metricName);
            // Dimensions
            for (const dim of (stat.dimensions || [])) {
                ret.push(dim.name, dim.value);
            }
            // Metric attributes that are rendered to graph options
            if (stat.account) {
                options.accountId = env_tokens_1.accountIfDifferentFromStack(stat.account);
            }
            if (stat.region) {
                options.region = env_tokens_1.regionIfDifferentFromStack(stat.region);
            }
            if (stat.period && stat.period.toSeconds() !== 300) {
                options.period = stat.period.toSeconds();
            }
            if (stat.statistic && stat.statistic !== 'Average') {
                options.stat = stat.statistic;
            }
        },
        withExpression(expr) {
            options.expression = expr.expression;
            if (expr.searchAccount) {
                options.accountId = env_tokens_1.accountIfDifferentFromStack(expr.searchAccount);
            }
            if (expr.searchRegion) {
                options.region = env_tokens_1.regionIfDifferentFromStack(expr.searchRegion);
            }
            if (expr.period && expr.period !== 300) {
                options.period = expr.period;
            }
        },
    });
    // Options
    if (!yAxis) {
        options.visible = false;
    }
    if (yAxis !== 'left') {
        options.yAxis = yAxis;
    }
    if (id) {
        options.id = id;
    }
    if (options.visible !== false && options.expression && !options.label) {
        // Label may be '' or undefined.
        //
        // If undefined, we'll render the expression as the label, to suppress
        // the default behavior of CW where it would render the metric
        // id as label, which we (inelegantly) generate to be something like "metric_alias0".
        //
        // For array expressions (returning more than 1 TS) users may sometimes want to
        // suppress the label completely. For those cases, we'll accept the empty string,
        // and not render a label at all.
        options.label = options.label === '' ? undefined : metric.toString();
    }
    const renderedOpts = object_1.dropUndefined(options);
    if (Object.keys(renderedOpts).length !== 0) {
        ret.push(renderedOpts);
    }
    return ret;
}
/**
 * Contain a set of metrics, expanding math expressions
 *
 * "Primary" metrics (added via a top-level call) can be tagged with an additional value.
 */
class MetricSet {
    constructor() {
        this.metrics = new Array();
        this.metricById = new Map();
        this.metricByKey = new Map();
    }
    /**
     * Add the given set of metrics to this set
     */
    addTopLevel(tag, ...metrics) {
        for (const metric of metrics) {
            this.addOne(metric, tag);
        }
    }
    /**
     * Access all the accumulated timeseries entries
     */
    get entries() {
        return this.metrics;
    }
    /**
     * Add a metric into the set
     *
     * The id may not be the same as a previous metric added, unless it's the same metric.
     *
     * It can be made visible, in which case the new "metric" object replaces the old
     * one (and the new ones "renderingPropertieS" will be honored instead of the old
     * one's).
     */
    addOne(metric, tag, id) {
        const key = metric_util_1.metricKey(metric);
        let existingEntry;
        // Try lookup existing by id if we have one
        if (id) {
            existingEntry = this.metricById.get(id);
            if (existingEntry && metric_util_1.metricKey(existingEntry.metric) !== key) {
                throw new Error(`Cannot have two different metrics share the same id ('${id}') in one Alarm or Graph. Rename one of them.`);
            }
        }
        if (!existingEntry) {
            // Try lookup by metric if we didn't find one by id
            existingEntry = this.metricByKey.get(key);
            // If the one we found already has an id, it must be different from the id
            // we're trying to add and we want to add a new metric. Pretend we didn't
            // find one.
            if (existingEntry?.id && id) {
                existingEntry = undefined;
            }
        }
        // Create a new entry if we didn't find one so far
        let entry;
        if (existingEntry) {
            entry = existingEntry;
        }
        else {
            entry = { metric };
            this.metrics.push(entry);
            this.metricByKey.set(key, entry);
        }
        // If it didn't have an id but now we do, add one
        if (!entry.id && id) {
            entry.id = id;
            this.metricById.set(id, entry);
        }
        // If it didn't have a tag but now we do, add one
        if (!entry.tag && tag) {
            entry.tag = tag;
        }
        // Recurse and add children
        const conf = metric.toMetricConfig();
        if (conf.mathExpression) {
            for (const [subId, subMetric] of Object.entries(conf.mathExpression.usingMetrics)) {
                this.addOne(subMetric, undefined, subId);
            }
        }
    }
}
exports.MetricSet = MetricSet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVuZGVyaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFIQUFvRztBQUNwRyw2Q0FBdUY7QUFDdkYsK0NBQTBEO0FBQzFELHFDQUF5QztBQUd6Qzs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxTQUFnQixtQkFBbUIsQ0FBQyxJQUFlLEVBQUUsS0FBZ0I7SUFDbkUseUVBQXlFO0lBQ3pFLG9GQUFvRjtJQUNwRixNQUFNLElBQUksR0FBRyxJQUFJLFNBQVMsRUFBVSxDQUFDO0lBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQztJQUVwQyxtQ0FBbUM7SUFDbkMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksaUZBQWdDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdILENBQUM7QUFURCxrREFTQztBQUVELFNBQVMsZUFBZSxDQUFDLE1BQWUsRUFBRSxLQUFjLEVBQUUsRUFBVztJQUNuRSxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7SUFFdkMsTUFBTSxHQUFHLEdBQVUsRUFBRSxDQUFDO0lBQ3RCLE1BQU0sT0FBTyxHQUFRLEVBQUUsR0FBRyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUV2RCw0QkFBYyxDQUFDLE1BQU0sRUFBRTtRQUNyQixRQUFRLENBQUMsSUFBSTtZQUNYLEdBQUcsQ0FBQyxJQUFJLENBQ04sSUFBSSxDQUFDLFNBQVMsRUFDZCxJQUFJLENBQUMsVUFBVSxDQUNoQixDQUFDO1lBRUYsYUFBYTtZQUNiLEtBQUssTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFO2dCQUN6QyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQy9CO1lBRUQsdURBQXVEO1lBQ3ZELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFBRSxPQUFPLENBQUMsU0FBUyxHQUFHLHdDQUEyQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUFFO1lBQ3BGLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFBRSxPQUFPLENBQUMsTUFBTSxHQUFHLHVDQUEwQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUFFO1lBQzlFLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxLQUFLLEdBQUcsRUFBRTtnQkFBRSxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7YUFBRTtZQUNqRyxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7Z0JBQUUsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO2FBQUU7U0FDdkY7UUFFRCxjQUFjLENBQUMsSUFBSTtZQUNqQixPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDckMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUFFLE9BQU8sQ0FBQyxTQUFTLEdBQUcsd0NBQTJCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQUU7WUFDaEcsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUFFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsdUNBQTBCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQUU7WUFDMUYsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO2dCQUFFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUFFO1NBQzFFO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsVUFBVTtJQUNWLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFBRSxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztLQUFFO0lBQ3hDLElBQUksS0FBSyxLQUFLLE1BQU0sRUFBRTtRQUFFLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQUU7SUFDaEQsSUFBSSxFQUFFLEVBQUU7UUFBRSxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztLQUFFO0lBRTVCLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxLQUFLLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7UUFDckUsZ0NBQWdDO1FBQ2hDLEVBQUU7UUFDRixzRUFBc0U7UUFDdEUsOERBQThEO1FBQzlELHFGQUFxRjtRQUNyRixFQUFFO1FBQ0YsK0VBQStFO1FBQy9FLGlGQUFpRjtRQUNqRixpQ0FBaUM7UUFDakMsT0FBTyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDdEU7SUFFRCxNQUFNLFlBQVksR0FBRyxzQkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRTVDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDeEI7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFzQkQ7Ozs7R0FJRztBQUNILE1BQWEsU0FBUztJQUF0QjtRQUNtQixZQUFPLEdBQUcsSUFBSSxLQUFLLEVBQWtCLENBQUM7UUFDdEMsZUFBVSxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO1FBQy9DLGdCQUFXLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7SUErRW5FLENBQUM7SUE3RUM7O09BRUc7SUFDSSxXQUFXLENBQUMsR0FBTSxFQUFFLEdBQUcsT0FBa0I7UUFDOUMsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDMUI7S0FDRjtJQUVEOztPQUVHO0lBQ0gsSUFBVyxPQUFPO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjtJQUVEOzs7Ozs7OztPQVFHO0lBQ0ssTUFBTSxDQUFDLE1BQWUsRUFBRSxHQUFPLEVBQUUsRUFBVztRQUNsRCxNQUFNLEdBQUcsR0FBRyx1QkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlCLElBQUksYUFBeUMsQ0FBQztRQUU5QywyQ0FBMkM7UUFDM0MsSUFBSSxFQUFFLEVBQUU7WUFDTixhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDeEMsSUFBSSxhQUFhLElBQUksdUJBQVMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxFQUFFO2dCQUM1RCxNQUFNLElBQUksS0FBSyxDQUFDLHlEQUF5RCxFQUFFLCtDQUErQyxDQUFDLENBQUM7YUFDN0g7U0FDRjtRQUVELElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEIsbURBQW1EO1lBQ25ELGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUUxQywwRUFBMEU7WUFDMUUseUVBQXlFO1lBQ3pFLFlBQVk7WUFDWixJQUFJLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFO2dCQUFFLGFBQWEsR0FBRyxTQUFTLENBQUM7YUFBRTtTQUM1RDtRQUVELGtEQUFrRDtRQUNsRCxJQUFJLEtBQUssQ0FBQztRQUNWLElBQUksYUFBYSxFQUFFO1lBQ2pCLEtBQUssR0FBRyxhQUFhLENBQUM7U0FDdkI7YUFBTTtZQUNMLEtBQUssR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNsQztRQUVELGlEQUFpRDtRQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDbkIsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDZCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDaEM7UUFFRCxpREFBaUQ7UUFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxFQUFFO1lBQ3JCLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1NBQ2pCO1FBRUQsMkJBQTJCO1FBQzNCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNyQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsS0FBSyxNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDakYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQzFDO1NBQ0Y7S0FDRjtDQUNGO0FBbEZELDhCQWtGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERyb3BFbXB0eU9iamVjdEF0VGhlRW5kT2ZBbkFycmF5IH0gZnJvbSAnLi9kcm9wLWVtcHR5LW9iamVjdC1hdC10aGUtZW5kLW9mLWFuLWFycmF5LXRva2VuJztcbmltcG9ydCB7IGFjY291bnRJZkRpZmZlcmVudEZyb21TdGFjaywgcmVnaW9uSWZEaWZmZXJlbnRGcm9tU3RhY2sgfSBmcm9tICcuL2Vudi10b2tlbnMnO1xuaW1wb3J0IHsgZGlzcGF0Y2hNZXRyaWMsIG1ldHJpY0tleSB9IGZyb20gJy4vbWV0cmljLXV0aWwnO1xuaW1wb3J0IHsgZHJvcFVuZGVmaW5lZCB9IGZyb20gJy4vb2JqZWN0JztcbmltcG9ydCB7IElNZXRyaWMgfSBmcm9tICcuLi9tZXRyaWMtdHlwZXMnO1xuXG4vKipcbiAqIFJldHVybiB0aGUgSlNPTiBzdHJ1Y3R1cmUgd2hpY2ggcmVwcmVzZW50cyB0aGVzZSBtZXRyaWNzIGluIGEgZ3JhcGguXG4gKlxuICogRGVwZW5kaW5nIG9uIHRoZSBtZXRyaWMgdHlwZSAoc3RhdCBvciBleHByZXNzaW9uKSwgb25lIGBNZXRyaWNgIG9iamVjdFxuICogY2FuIHJlbmRlciB0byBtdWx0aXBsZSB0aW1lIHNlcmllcy5cbiAqXG4gKiAtIFRvcC1sZXZlbCBtZXRyaWNzIHdpbGwgYmUgcmVuZGVyZWQgdmlzaWJseSwgYWRkaXRpb25hbGx5IGFkZGVkIG1ldHJpY3Mgd2lsbFxuICogICBiZSByZW5kZXJlZCBpbnZpc2libHkuXG4gKiAtIElEcyB1c2VkIGluIG1hdGggZXhwcmVzc2lvbnMgbmVlZCB0byBiZSBlaXRoZXIgZ2xvYmFsbHkgdW5pcXVlLCBvciByZWZlciB0byB0aGUgc2FtZVxuICogICBtZXRyaWMgb2JqZWN0LlxuICpcbiAqIFRoaXMgd2lsbCBiZSBjYWxsZWQgYnkgR3JhcGhXaWRnZXQsIG5vIG5lZWQgZm9yIGNsaWVudHMgdG8gY2FsbCB0aGlzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWxsTWV0cmljc0dyYXBoSnNvbihsZWZ0OiBJTWV0cmljW10sIHJpZ2h0OiBJTWV0cmljW10pOiBhbnlbXSB7XG4gIC8vIEFkZCBtZXRyaWNzIHRvIGEgc2V0IHdoaWNoIHdpbGwgYXV0b21hdGljYWxseSBleHBhbmQgdGhlbSByZWN1cnNpdmVseSxcbiAgLy8gbWFraW5nIHN1cmUgdG8gcmV0YWluIGNvbmZsaWN0aW5nIHRoZSB2aXNpYmxlIG9uZSBvbiBjb25mbGljdGluZyBtZXRyaWNzIG9iamVjdHMuXG4gIGNvbnN0IG1zZXQgPSBuZXcgTWV0cmljU2V0PHN0cmluZz4oKTtcbiAgbXNldC5hZGRUb3BMZXZlbCgnbGVmdCcsIC4uLmxlZnQpO1xuICBtc2V0LmFkZFRvcExldmVsKCdyaWdodCcsIC4uLnJpZ2h0KTtcblxuICAvLyBSZW5kZXIgYWxsIG1ldHJpY3MgZnJvbSB0aGUgc2V0LlxuICByZXR1cm4gbXNldC5lbnRyaWVzLm1hcChlbnRyeSA9PiBuZXcgRHJvcEVtcHR5T2JqZWN0QXRUaGVFbmRPZkFuQXJyYXkobWV0cmljR3JhcGhKc29uKGVudHJ5Lm1ldHJpYywgZW50cnkudGFnLCBlbnRyeS5pZCkpKTtcbn1cblxuZnVuY3Rpb24gbWV0cmljR3JhcGhKc29uKG1ldHJpYzogSU1ldHJpYywgeUF4aXM/OiBzdHJpbmcsIGlkPzogc3RyaW5nKSB7XG4gIGNvbnN0IGNvbmZpZyA9IG1ldHJpYy50b01ldHJpY0NvbmZpZygpO1xuXG4gIGNvbnN0IHJldDogYW55W10gPSBbXTtcbiAgY29uc3Qgb3B0aW9uczogYW55ID0geyAuLi5jb25maWcucmVuZGVyaW5nUHJvcGVydGllcyB9O1xuXG4gIGRpc3BhdGNoTWV0cmljKG1ldHJpYywge1xuICAgIHdpdGhTdGF0KHN0YXQpIHtcbiAgICAgIHJldC5wdXNoKFxuICAgICAgICBzdGF0Lm5hbWVzcGFjZSxcbiAgICAgICAgc3RhdC5tZXRyaWNOYW1lLFxuICAgICAgKTtcblxuICAgICAgLy8gRGltZW5zaW9uc1xuICAgICAgZm9yIChjb25zdCBkaW0gb2YgKHN0YXQuZGltZW5zaW9ucyB8fCBbXSkpIHtcbiAgICAgICAgcmV0LnB1c2goZGltLm5hbWUsIGRpbS52YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIE1ldHJpYyBhdHRyaWJ1dGVzIHRoYXQgYXJlIHJlbmRlcmVkIHRvIGdyYXBoIG9wdGlvbnNcbiAgICAgIGlmIChzdGF0LmFjY291bnQpIHsgb3B0aW9ucy5hY2NvdW50SWQgPSBhY2NvdW50SWZEaWZmZXJlbnRGcm9tU3RhY2soc3RhdC5hY2NvdW50KTsgfVxuICAgICAgaWYgKHN0YXQucmVnaW9uKSB7IG9wdGlvbnMucmVnaW9uID0gcmVnaW9uSWZEaWZmZXJlbnRGcm9tU3RhY2soc3RhdC5yZWdpb24pOyB9XG4gICAgICBpZiAoc3RhdC5wZXJpb2QgJiYgc3RhdC5wZXJpb2QudG9TZWNvbmRzKCkgIT09IDMwMCkgeyBvcHRpb25zLnBlcmlvZCA9IHN0YXQucGVyaW9kLnRvU2Vjb25kcygpOyB9XG4gICAgICBpZiAoc3RhdC5zdGF0aXN0aWMgJiYgc3RhdC5zdGF0aXN0aWMgIT09ICdBdmVyYWdlJykgeyBvcHRpb25zLnN0YXQgPSBzdGF0LnN0YXRpc3RpYzsgfVxuICAgIH0sXG5cbiAgICB3aXRoRXhwcmVzc2lvbihleHByKSB7XG4gICAgICBvcHRpb25zLmV4cHJlc3Npb24gPSBleHByLmV4cHJlc3Npb247XG4gICAgICBpZiAoZXhwci5zZWFyY2hBY2NvdW50KSB7IG9wdGlvbnMuYWNjb3VudElkID0gYWNjb3VudElmRGlmZmVyZW50RnJvbVN0YWNrKGV4cHIuc2VhcmNoQWNjb3VudCk7IH1cbiAgICAgIGlmIChleHByLnNlYXJjaFJlZ2lvbikgeyBvcHRpb25zLnJlZ2lvbiA9IHJlZ2lvbklmRGlmZmVyZW50RnJvbVN0YWNrKGV4cHIuc2VhcmNoUmVnaW9uKTsgfVxuICAgICAgaWYgKGV4cHIucGVyaW9kICYmIGV4cHIucGVyaW9kICE9PSAzMDApIHsgb3B0aW9ucy5wZXJpb2QgPSBleHByLnBlcmlvZDsgfVxuICAgIH0sXG4gIH0pO1xuXG4gIC8vIE9wdGlvbnNcbiAgaWYgKCF5QXhpcykgeyBvcHRpb25zLnZpc2libGUgPSBmYWxzZTsgfVxuICBpZiAoeUF4aXMgIT09ICdsZWZ0JykgeyBvcHRpb25zLnlBeGlzID0geUF4aXM7IH1cbiAgaWYgKGlkKSB7IG9wdGlvbnMuaWQgPSBpZDsgfVxuXG4gIGlmIChvcHRpb25zLnZpc2libGUgIT09IGZhbHNlICYmIG9wdGlvbnMuZXhwcmVzc2lvbiAmJiAhb3B0aW9ucy5sYWJlbCkge1xuICAgIC8vIExhYmVsIG1heSBiZSAnJyBvciB1bmRlZmluZWQuXG4gICAgLy9cbiAgICAvLyBJZiB1bmRlZmluZWQsIHdlJ2xsIHJlbmRlciB0aGUgZXhwcmVzc2lvbiBhcyB0aGUgbGFiZWwsIHRvIHN1cHByZXNzXG4gICAgLy8gdGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgQ1cgd2hlcmUgaXQgd291bGQgcmVuZGVyIHRoZSBtZXRyaWNcbiAgICAvLyBpZCBhcyBsYWJlbCwgd2hpY2ggd2UgKGluZWxlZ2FudGx5KSBnZW5lcmF0ZSB0byBiZSBzb21ldGhpbmcgbGlrZSBcIm1ldHJpY19hbGlhczBcIi5cbiAgICAvL1xuICAgIC8vIEZvciBhcnJheSBleHByZXNzaW9ucyAocmV0dXJuaW5nIG1vcmUgdGhhbiAxIFRTKSB1c2VycyBtYXkgc29tZXRpbWVzIHdhbnQgdG9cbiAgICAvLyBzdXBwcmVzcyB0aGUgbGFiZWwgY29tcGxldGVseS4gRm9yIHRob3NlIGNhc2VzLCB3ZSdsbCBhY2NlcHQgdGhlIGVtcHR5IHN0cmluZyxcbiAgICAvLyBhbmQgbm90IHJlbmRlciBhIGxhYmVsIGF0IGFsbC5cbiAgICBvcHRpb25zLmxhYmVsID0gb3B0aW9ucy5sYWJlbCA9PT0gJycgPyB1bmRlZmluZWQgOiBtZXRyaWMudG9TdHJpbmcoKTtcbiAgfVxuXG4gIGNvbnN0IHJlbmRlcmVkT3B0cyA9IGRyb3BVbmRlZmluZWQob3B0aW9ucyk7XG5cbiAgaWYgKE9iamVjdC5rZXlzKHJlbmRlcmVkT3B0cykubGVuZ3RoICE9PSAwKSB7XG4gICAgcmV0LnB1c2gocmVuZGVyZWRPcHRzKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgc2luZ2xlIG1ldHJpYyBpbiBhIE1ldHJpY1NldFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1ldHJpY0VudHJ5PEE+IHtcbiAgLyoqXG4gICAqIFRoZSBtZXRyaWMgb2JqZWN0XG4gICAqL1xuICByZWFkb25seSBtZXRyaWM6IElNZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSB0YWcsIGFkZGVkIGlmIHRoZSBvYmplY3QgaXMgYSBwcmltYXJ5IG1ldHJpY1xuICAgKi9cbiAgdGFnPzogQTtcblxuICAvKipcbiAgICogSUQgZm9yIHRoaXMgbWV0cmljIG9iamVjdFxuICAgKi9cbiAgaWQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ29udGFpbiBhIHNldCBvZiBtZXRyaWNzLCBleHBhbmRpbmcgbWF0aCBleHByZXNzaW9uc1xuICpcbiAqIFwiUHJpbWFyeVwiIG1ldHJpY3MgKGFkZGVkIHZpYSBhIHRvcC1sZXZlbCBjYWxsKSBjYW4gYmUgdGFnZ2VkIHdpdGggYW4gYWRkaXRpb25hbCB2YWx1ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1ldHJpY1NldDxBPiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbWV0cmljcyA9IG5ldyBBcnJheTxNZXRyaWNFbnRyeTxBPj4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBtZXRyaWNCeUlkID0gbmV3IE1hcDxzdHJpbmcsIE1ldHJpY0VudHJ5PEE+PigpO1xuICBwcml2YXRlIHJlYWRvbmx5IG1ldHJpY0J5S2V5ID0gbmV3IE1hcDxzdHJpbmcsIE1ldHJpY0VudHJ5PEE+PigpO1xuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGdpdmVuIHNldCBvZiBtZXRyaWNzIHRvIHRoaXMgc2V0XG4gICAqL1xuICBwdWJsaWMgYWRkVG9wTGV2ZWwodGFnOiBBLCAuLi5tZXRyaWNzOiBJTWV0cmljW10pIHtcbiAgICBmb3IgKGNvbnN0IG1ldHJpYyBvZiBtZXRyaWNzKSB7XG4gICAgICB0aGlzLmFkZE9uZShtZXRyaWMsIHRhZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFjY2VzcyBhbGwgdGhlIGFjY3VtdWxhdGVkIHRpbWVzZXJpZXMgZW50cmllc1xuICAgKi9cbiAgcHVibGljIGdldCBlbnRyaWVzKCk6IFJlYWRvbmx5QXJyYXk8TWV0cmljRW50cnk8QT4+IHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG1ldHJpYyBpbnRvIHRoZSBzZXRcbiAgICpcbiAgICogVGhlIGlkIG1heSBub3QgYmUgdGhlIHNhbWUgYXMgYSBwcmV2aW91cyBtZXRyaWMgYWRkZWQsIHVubGVzcyBpdCdzIHRoZSBzYW1lIG1ldHJpYy5cbiAgICpcbiAgICogSXQgY2FuIGJlIG1hZGUgdmlzaWJsZSwgaW4gd2hpY2ggY2FzZSB0aGUgbmV3IFwibWV0cmljXCIgb2JqZWN0IHJlcGxhY2VzIHRoZSBvbGRcbiAgICogb25lIChhbmQgdGhlIG5ldyBvbmVzIFwicmVuZGVyaW5nUHJvcGVydGllU1wiIHdpbGwgYmUgaG9ub3JlZCBpbnN0ZWFkIG9mIHRoZSBvbGRcbiAgICogb25lJ3MpLlxuICAgKi9cbiAgcHJpdmF0ZSBhZGRPbmUobWV0cmljOiBJTWV0cmljLCB0YWc/OiBBLCBpZD86IHN0cmluZykge1xuICAgIGNvbnN0IGtleSA9IG1ldHJpY0tleShtZXRyaWMpO1xuXG4gICAgbGV0IGV4aXN0aW5nRW50cnk6IE1ldHJpY0VudHJ5PEE+IHwgdW5kZWZpbmVkO1xuXG4gICAgLy8gVHJ5IGxvb2t1cCBleGlzdGluZyBieSBpZCBpZiB3ZSBoYXZlIG9uZVxuICAgIGlmIChpZCkge1xuICAgICAgZXhpc3RpbmdFbnRyeSA9IHRoaXMubWV0cmljQnlJZC5nZXQoaWQpO1xuICAgICAgaWYgKGV4aXN0aW5nRW50cnkgJiYgbWV0cmljS2V5KGV4aXN0aW5nRW50cnkubWV0cmljKSAhPT0ga2V5KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhdmUgdHdvIGRpZmZlcmVudCBtZXRyaWNzIHNoYXJlIHRoZSBzYW1lIGlkICgnJHtpZH0nKSBpbiBvbmUgQWxhcm0gb3IgR3JhcGguIFJlbmFtZSBvbmUgb2YgdGhlbS5gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWV4aXN0aW5nRW50cnkpIHtcbiAgICAgIC8vIFRyeSBsb29rdXAgYnkgbWV0cmljIGlmIHdlIGRpZG4ndCBmaW5kIG9uZSBieSBpZFxuICAgICAgZXhpc3RpbmdFbnRyeSA9IHRoaXMubWV0cmljQnlLZXkuZ2V0KGtleSk7XG5cbiAgICAgIC8vIElmIHRoZSBvbmUgd2UgZm91bmQgYWxyZWFkeSBoYXMgYW4gaWQsIGl0IG11c3QgYmUgZGlmZmVyZW50IGZyb20gdGhlIGlkXG4gICAgICAvLyB3ZSdyZSB0cnlpbmcgdG8gYWRkIGFuZCB3ZSB3YW50IHRvIGFkZCBhIG5ldyBtZXRyaWMuIFByZXRlbmQgd2UgZGlkbid0XG4gICAgICAvLyBmaW5kIG9uZS5cbiAgICAgIGlmIChleGlzdGluZ0VudHJ5Py5pZCAmJiBpZCkgeyBleGlzdGluZ0VudHJ5ID0gdW5kZWZpbmVkOyB9XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGEgbmV3IGVudHJ5IGlmIHdlIGRpZG4ndCBmaW5kIG9uZSBzbyBmYXJcbiAgICBsZXQgZW50cnk7XG4gICAgaWYgKGV4aXN0aW5nRW50cnkpIHtcbiAgICAgIGVudHJ5ID0gZXhpc3RpbmdFbnRyeTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW50cnkgPSB7IG1ldHJpYyB9O1xuICAgICAgdGhpcy5tZXRyaWNzLnB1c2goZW50cnkpO1xuICAgICAgdGhpcy5tZXRyaWNCeUtleS5zZXQoa2V5LCBlbnRyeSk7XG4gICAgfVxuXG4gICAgLy8gSWYgaXQgZGlkbid0IGhhdmUgYW4gaWQgYnV0IG5vdyB3ZSBkbywgYWRkIG9uZVxuICAgIGlmICghZW50cnkuaWQgJiYgaWQpIHtcbiAgICAgIGVudHJ5LmlkID0gaWQ7XG4gICAgICB0aGlzLm1ldHJpY0J5SWQuc2V0KGlkLCBlbnRyeSk7XG4gICAgfVxuXG4gICAgLy8gSWYgaXQgZGlkbid0IGhhdmUgYSB0YWcgYnV0IG5vdyB3ZSBkbywgYWRkIG9uZVxuICAgIGlmICghZW50cnkudGFnICYmIHRhZykge1xuICAgICAgZW50cnkudGFnID0gdGFnO1xuICAgIH1cblxuICAgIC8vIFJlY3Vyc2UgYW5kIGFkZCBjaGlsZHJlblxuICAgIGNvbnN0IGNvbmYgPSBtZXRyaWMudG9NZXRyaWNDb25maWcoKTtcbiAgICBpZiAoY29uZi5tYXRoRXhwcmVzc2lvbikge1xuICAgICAgZm9yIChjb25zdCBbc3ViSWQsIHN1Yk1ldHJpY10gb2YgT2JqZWN0LmVudHJpZXMoY29uZi5tYXRoRXhwcmVzc2lvbi51c2luZ01ldHJpY3MpKSB7XG4gICAgICAgIHRoaXMuYWRkT25lKHN1Yk1ldHJpYywgdW5kZWZpbmVkLCBzdWJJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=