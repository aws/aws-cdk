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
    (0, metric_util_1.dispatchMetric)(metric, {
        withStat(stat) {
            ret.push(stat.namespace, stat.metricName);
            // Dimensions
            for (const dim of (stat.dimensions || [])) {
                ret.push(dim.name, dim.value);
            }
            // Metric attributes that are rendered to graph options
            if (stat.account) {
                options.accountId = (0, env_tokens_1.accountIfDifferentFromStack)(stat.account);
            }
            if (stat.region) {
                options.region = (0, env_tokens_1.regionIfDifferentFromStack)(stat.region);
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
                options.accountId = (0, env_tokens_1.accountIfDifferentFromStack)(expr.searchAccount);
            }
            if (expr.searchRegion) {
                options.region = (0, env_tokens_1.regionIfDifferentFromStack)(expr.searchRegion);
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
    const renderedOpts = (0, object_1.dropUndefined)(options);
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
        const key = (0, metric_util_1.metricKey)(metric);
        let existingEntry;
        // Try lookup existing by id if we have one
        if (id) {
            existingEntry = this.metricById.get(id);
            if (existingEntry && (0, metric_util_1.metricKey)(existingEntry.metric) !== key) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVuZGVyaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFIQUFvRztBQUNwRyw2Q0FBdUY7QUFDdkYsK0NBQTBEO0FBQzFELHFDQUF5QztBQUd6Qzs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxTQUFnQixtQkFBbUIsQ0FBQyxJQUFlLEVBQUUsS0FBZ0I7SUFDbkUseUVBQXlFO0lBQ3pFLG9GQUFvRjtJQUNwRixNQUFNLElBQUksR0FBRyxJQUFJLFNBQVMsRUFBVSxDQUFDO0lBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQztJQUVwQyxtQ0FBbUM7SUFDbkMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksaUZBQWdDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdILENBQUM7QUFURCxrREFTQztBQUVELFNBQVMsZUFBZSxDQUFDLE1BQWUsRUFBRSxLQUFjLEVBQUUsRUFBVztJQUNuRSxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7SUFFdkMsTUFBTSxHQUFHLEdBQVUsRUFBRSxDQUFDO0lBQ3RCLE1BQU0sT0FBTyxHQUFRLEVBQUUsR0FBRyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUV2RCxJQUFBLDRCQUFjLEVBQUMsTUFBTSxFQUFFO1FBQ3JCLFFBQVEsQ0FBQyxJQUFJO1lBQ1gsR0FBRyxDQUFDLElBQUksQ0FDTixJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxVQUFVLENBQ2hCLENBQUM7WUFF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RCxrREFBa0Q7UUFDbEQsSUFBSSxLQUFLLENBQUM7UUFDVixJQUFJLGFBQWEsRUFBRTtZQUNqQixLQUFLLEdBQUcsYUFBYSxDQUFDO1NBQ3ZCO2FBQU07WUFDTCxLQUFLLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbEM7UUFFRCxpREFBaUQ7UUFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ25CLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2hDO1FBRUQsaURBQWlEO1FBQ2pELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBRTtZQUNyQixLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztTQUNqQjtRQUVELDJCQUEyQjtRQUMzQixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDckMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLEtBQUssTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQ2pGLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUMxQztTQUNGO0tBQ0Y7Q0FDRjtBQWxGRCw4QkFrRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEcm9wRW1wdHlPYmplY3RBdFRoZUVuZE9mQW5BcnJheSB9IGZyb20gJy4vZHJvcC1lbXB0eS1vYmplY3QtYXQtdGhlLWVuZC1vZi1hbi1hcnJheS10b2tlbic7XG5pbXBvcnQgeyBhY2NvdW50SWZEaWZmZXJlbnRGcm9tU3RhY2ssIHJlZ2lvbklmRGlmZmVyZW50RnJvbVN0YWNrIH0gZnJvbSAnLi9lbnYtdG9rZW5zJztcbmltcG9ydCB7IGRpc3BhdGNoTWV0cmljLCBtZXRyaWNLZXkgfSBmcm9tICcuL21ldHJpYy11dGlsJztcbmltcG9ydCB7IGRyb3BVbmRlZmluZWQgfSBmcm9tICcuL29iamVjdCc7XG5pbXBvcnQgeyBJTWV0cmljIH0gZnJvbSAnLi4vbWV0cmljLXR5cGVzJztcblxuLyoqXG4gKiBSZXR1cm4gdGhlIEpTT04gc3RydWN0dXJlIHdoaWNoIHJlcHJlc2VudHMgdGhlc2UgbWV0cmljcyBpbiBhIGdyYXBoLlxuICpcbiAqIERlcGVuZGluZyBvbiB0aGUgbWV0cmljIHR5cGUgKHN0YXQgb3IgZXhwcmVzc2lvbiksIG9uZSBgTWV0cmljYCBvYmplY3RcbiAqIGNhbiByZW5kZXIgdG8gbXVsdGlwbGUgdGltZSBzZXJpZXMuXG4gKlxuICogLSBUb3AtbGV2ZWwgbWV0cmljcyB3aWxsIGJlIHJlbmRlcmVkIHZpc2libHksIGFkZGl0aW9uYWxseSBhZGRlZCBtZXRyaWNzIHdpbGxcbiAqICAgYmUgcmVuZGVyZWQgaW52aXNpYmx5LlxuICogLSBJRHMgdXNlZCBpbiBtYXRoIGV4cHJlc3Npb25zIG5lZWQgdG8gYmUgZWl0aGVyIGdsb2JhbGx5IHVuaXF1ZSwgb3IgcmVmZXIgdG8gdGhlIHNhbWVcbiAqICAgbWV0cmljIG9iamVjdC5cbiAqXG4gKiBUaGlzIHdpbGwgYmUgY2FsbGVkIGJ5IEdyYXBoV2lkZ2V0LCBubyBuZWVkIGZvciBjbGllbnRzIHRvIGNhbGwgdGhpcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFsbE1ldHJpY3NHcmFwaEpzb24obGVmdDogSU1ldHJpY1tdLCByaWdodDogSU1ldHJpY1tdKTogYW55W10ge1xuICAvLyBBZGQgbWV0cmljcyB0byBhIHNldCB3aGljaCB3aWxsIGF1dG9tYXRpY2FsbHkgZXhwYW5kIHRoZW0gcmVjdXJzaXZlbHksXG4gIC8vIG1ha2luZyBzdXJlIHRvIHJldGFpbiBjb25mbGljdGluZyB0aGUgdmlzaWJsZSBvbmUgb24gY29uZmxpY3RpbmcgbWV0cmljcyBvYmplY3RzLlxuICBjb25zdCBtc2V0ID0gbmV3IE1ldHJpY1NldDxzdHJpbmc+KCk7XG4gIG1zZXQuYWRkVG9wTGV2ZWwoJ2xlZnQnLCAuLi5sZWZ0KTtcbiAgbXNldC5hZGRUb3BMZXZlbCgncmlnaHQnLCAuLi5yaWdodCk7XG5cbiAgLy8gUmVuZGVyIGFsbCBtZXRyaWNzIGZyb20gdGhlIHNldC5cbiAgcmV0dXJuIG1zZXQuZW50cmllcy5tYXAoZW50cnkgPT4gbmV3IERyb3BFbXB0eU9iamVjdEF0VGhlRW5kT2ZBbkFycmF5KG1ldHJpY0dyYXBoSnNvbihlbnRyeS5tZXRyaWMsIGVudHJ5LnRhZywgZW50cnkuaWQpKSk7XG59XG5cbmZ1bmN0aW9uIG1ldHJpY0dyYXBoSnNvbihtZXRyaWM6IElNZXRyaWMsIHlBeGlzPzogc3RyaW5nLCBpZD86IHN0cmluZykge1xuICBjb25zdCBjb25maWcgPSBtZXRyaWMudG9NZXRyaWNDb25maWcoKTtcblxuICBjb25zdCByZXQ6IGFueVtdID0gW107XG4gIGNvbnN0IG9wdGlvbnM6IGFueSA9IHsgLi4uY29uZmlnLnJlbmRlcmluZ1Byb3BlcnRpZXMgfTtcblxuICBkaXNwYXRjaE1ldHJpYyhtZXRyaWMsIHtcbiAgICB3aXRoU3RhdChzdGF0KSB7XG4gICAgICByZXQucHVzaChcbiAgICAgICAgc3RhdC5uYW1lc3BhY2UsXG4gICAgICAgIHN0YXQubWV0cmljTmFtZSxcbiAgICAgICk7XG5cbiAgICAgIC8vIERpbWVuc2lvbnNcbiAgICAgIGZvciAoY29uc3QgZGltIG9mIChzdGF0LmRpbWVuc2lvbnMgfHwgW10pKSB7XG4gICAgICAgIHJldC5wdXNoKGRpbS5uYW1lLCBkaW0udmFsdWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBNZXRyaWMgYXR0cmlidXRlcyB0aGF0IGFyZSByZW5kZXJlZCB0byBncmFwaCBvcHRpb25zXG4gICAgICBpZiAoc3RhdC5hY2NvdW50KSB7IG9wdGlvbnMuYWNjb3VudElkID0gYWNjb3VudElmRGlmZmVyZW50RnJvbVN0YWNrKHN0YXQuYWNjb3VudCk7IH1cbiAgICAgIGlmIChzdGF0LnJlZ2lvbikgeyBvcHRpb25zLnJlZ2lvbiA9IHJlZ2lvbklmRGlmZmVyZW50RnJvbVN0YWNrKHN0YXQucmVnaW9uKTsgfVxuICAgICAgaWYgKHN0YXQucGVyaW9kICYmIHN0YXQucGVyaW9kLnRvU2Vjb25kcygpICE9PSAzMDApIHsgb3B0aW9ucy5wZXJpb2QgPSBzdGF0LnBlcmlvZC50b1NlY29uZHMoKTsgfVxuICAgICAgaWYgKHN0YXQuc3RhdGlzdGljICYmIHN0YXQuc3RhdGlzdGljICE9PSAnQXZlcmFnZScpIHsgb3B0aW9ucy5zdGF0ID0gc3RhdC5zdGF0aXN0aWM7IH1cbiAgICB9LFxuXG4gICAgd2l0aEV4cHJlc3Npb24oZXhwcikge1xuICAgICAgb3B0aW9ucy5leHByZXNzaW9uID0gZXhwci5leHByZXNzaW9uO1xuICAgICAgaWYgKGV4cHIuc2VhcmNoQWNjb3VudCkgeyBvcHRpb25zLmFjY291bnRJZCA9IGFjY291bnRJZkRpZmZlcmVudEZyb21TdGFjayhleHByLnNlYXJjaEFjY291bnQpOyB9XG4gICAgICBpZiAoZXhwci5zZWFyY2hSZWdpb24pIHsgb3B0aW9ucy5yZWdpb24gPSByZWdpb25JZkRpZmZlcmVudEZyb21TdGFjayhleHByLnNlYXJjaFJlZ2lvbik7IH1cbiAgICAgIGlmIChleHByLnBlcmlvZCAmJiBleHByLnBlcmlvZCAhPT0gMzAwKSB7IG9wdGlvbnMucGVyaW9kID0gZXhwci5wZXJpb2Q7IH1cbiAgICB9LFxuICB9KTtcblxuICAvLyBPcHRpb25zXG4gIGlmICgheUF4aXMpIHsgb3B0aW9ucy52aXNpYmxlID0gZmFsc2U7IH1cbiAgaWYgKHlBeGlzICE9PSAnbGVmdCcpIHsgb3B0aW9ucy55QXhpcyA9IHlBeGlzOyB9XG4gIGlmIChpZCkgeyBvcHRpb25zLmlkID0gaWQ7IH1cblxuICBpZiAob3B0aW9ucy52aXNpYmxlICE9PSBmYWxzZSAmJiBvcHRpb25zLmV4cHJlc3Npb24gJiYgIW9wdGlvbnMubGFiZWwpIHtcbiAgICAvLyBMYWJlbCBtYXkgYmUgJycgb3IgdW5kZWZpbmVkLlxuICAgIC8vXG4gICAgLy8gSWYgdW5kZWZpbmVkLCB3ZSdsbCByZW5kZXIgdGhlIGV4cHJlc3Npb24gYXMgdGhlIGxhYmVsLCB0byBzdXBwcmVzc1xuICAgIC8vIHRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIENXIHdoZXJlIGl0IHdvdWxkIHJlbmRlciB0aGUgbWV0cmljXG4gICAgLy8gaWQgYXMgbGFiZWwsIHdoaWNoIHdlIChpbmVsZWdhbnRseSkgZ2VuZXJhdGUgdG8gYmUgc29tZXRoaW5nIGxpa2UgXCJtZXRyaWNfYWxpYXMwXCIuXG4gICAgLy9cbiAgICAvLyBGb3IgYXJyYXkgZXhwcmVzc2lvbnMgKHJldHVybmluZyBtb3JlIHRoYW4gMSBUUykgdXNlcnMgbWF5IHNvbWV0aW1lcyB3YW50IHRvXG4gICAgLy8gc3VwcHJlc3MgdGhlIGxhYmVsIGNvbXBsZXRlbHkuIEZvciB0aG9zZSBjYXNlcywgd2UnbGwgYWNjZXB0IHRoZSBlbXB0eSBzdHJpbmcsXG4gICAgLy8gYW5kIG5vdCByZW5kZXIgYSBsYWJlbCBhdCBhbGwuXG4gICAgb3B0aW9ucy5sYWJlbCA9IG9wdGlvbnMubGFiZWwgPT09ICcnID8gdW5kZWZpbmVkIDogbWV0cmljLnRvU3RyaW5nKCk7XG4gIH1cblxuICBjb25zdCByZW5kZXJlZE9wdHMgPSBkcm9wVW5kZWZpbmVkKG9wdGlvbnMpO1xuXG4gIGlmIChPYmplY3Qua2V5cyhyZW5kZXJlZE9wdHMpLmxlbmd0aCAhPT0gMCkge1xuICAgIHJldC5wdXNoKHJlbmRlcmVkT3B0cyk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIHNpbmdsZSBtZXRyaWMgaW4gYSBNZXRyaWNTZXRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNZXRyaWNFbnRyeTxBPiB7XG4gIC8qKlxuICAgKiBUaGUgbWV0cmljIG9iamVjdFxuICAgKi9cbiAgcmVhZG9ubHkgbWV0cmljOiBJTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgdGFnLCBhZGRlZCBpZiB0aGUgb2JqZWN0IGlzIGEgcHJpbWFyeSBtZXRyaWNcbiAgICovXG4gIHRhZz86IEE7XG5cbiAgLyoqXG4gICAqIElEIGZvciB0aGlzIG1ldHJpYyBvYmplY3RcbiAgICovXG4gIGlkPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIENvbnRhaW4gYSBzZXQgb2YgbWV0cmljcywgZXhwYW5kaW5nIG1hdGggZXhwcmVzc2lvbnNcbiAqXG4gKiBcIlByaW1hcnlcIiBtZXRyaWNzIChhZGRlZCB2aWEgYSB0b3AtbGV2ZWwgY2FsbCkgY2FuIGJlIHRhZ2dlZCB3aXRoIGFuIGFkZGl0aW9uYWwgdmFsdWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBNZXRyaWNTZXQ8QT4ge1xuICBwcml2YXRlIHJlYWRvbmx5IG1ldHJpY3MgPSBuZXcgQXJyYXk8TWV0cmljRW50cnk8QT4+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgbWV0cmljQnlJZCA9IG5ldyBNYXA8c3RyaW5nLCBNZXRyaWNFbnRyeTxBPj4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBtZXRyaWNCeUtleSA9IG5ldyBNYXA8c3RyaW5nLCBNZXRyaWNFbnRyeTxBPj4oKTtcblxuICAvKipcbiAgICogQWRkIHRoZSBnaXZlbiBzZXQgb2YgbWV0cmljcyB0byB0aGlzIHNldFxuICAgKi9cbiAgcHVibGljIGFkZFRvcExldmVsKHRhZzogQSwgLi4ubWV0cmljczogSU1ldHJpY1tdKSB7XG4gICAgZm9yIChjb25zdCBtZXRyaWMgb2YgbWV0cmljcykge1xuICAgICAgdGhpcy5hZGRPbmUobWV0cmljLCB0YWcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBY2Nlc3MgYWxsIHRoZSBhY2N1bXVsYXRlZCB0aW1lc2VyaWVzIGVudHJpZXNcbiAgICovXG4gIHB1YmxpYyBnZXQgZW50cmllcygpOiBSZWFkb25seUFycmF5PE1ldHJpY0VudHJ5PEE+PiB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBtZXRyaWMgaW50byB0aGUgc2V0XG4gICAqXG4gICAqIFRoZSBpZCBtYXkgbm90IGJlIHRoZSBzYW1lIGFzIGEgcHJldmlvdXMgbWV0cmljIGFkZGVkLCB1bmxlc3MgaXQncyB0aGUgc2FtZSBtZXRyaWMuXG4gICAqXG4gICAqIEl0IGNhbiBiZSBtYWRlIHZpc2libGUsIGluIHdoaWNoIGNhc2UgdGhlIG5ldyBcIm1ldHJpY1wiIG9iamVjdCByZXBsYWNlcyB0aGUgb2xkXG4gICAqIG9uZSAoYW5kIHRoZSBuZXcgb25lcyBcInJlbmRlcmluZ1Byb3BlcnRpZVNcIiB3aWxsIGJlIGhvbm9yZWQgaW5zdGVhZCBvZiB0aGUgb2xkXG4gICAqIG9uZSdzKS5cbiAgICovXG4gIHByaXZhdGUgYWRkT25lKG1ldHJpYzogSU1ldHJpYywgdGFnPzogQSwgaWQ/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBrZXkgPSBtZXRyaWNLZXkobWV0cmljKTtcblxuICAgIGxldCBleGlzdGluZ0VudHJ5OiBNZXRyaWNFbnRyeTxBPiB8IHVuZGVmaW5lZDtcblxuICAgIC8vIFRyeSBsb29rdXAgZXhpc3RpbmcgYnkgaWQgaWYgd2UgaGF2ZSBvbmVcbiAgICBpZiAoaWQpIHtcbiAgICAgIGV4aXN0aW5nRW50cnkgPSB0aGlzLm1ldHJpY0J5SWQuZ2V0KGlkKTtcbiAgICAgIGlmIChleGlzdGluZ0VudHJ5ICYmIG1ldHJpY0tleShleGlzdGluZ0VudHJ5Lm1ldHJpYykgIT09IGtleSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYXZlIHR3byBkaWZmZXJlbnQgbWV0cmljcyBzaGFyZSB0aGUgc2FtZSBpZCAoJyR7aWR9JykgaW4gb25lIEFsYXJtIG9yIEdyYXBoLiBSZW5hbWUgb25lIG9mIHRoZW0uYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFleGlzdGluZ0VudHJ5KSB7XG4gICAgICAvLyBUcnkgbG9va3VwIGJ5IG1ldHJpYyBpZiB3ZSBkaWRuJ3QgZmluZCBvbmUgYnkgaWRcbiAgICAgIGV4aXN0aW5nRW50cnkgPSB0aGlzLm1ldHJpY0J5S2V5LmdldChrZXkpO1xuXG4gICAgICAvLyBJZiB0aGUgb25lIHdlIGZvdW5kIGFscmVhZHkgaGFzIGFuIGlkLCBpdCBtdXN0IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBpZFxuICAgICAgLy8gd2UncmUgdHJ5aW5nIHRvIGFkZCBhbmQgd2Ugd2FudCB0byBhZGQgYSBuZXcgbWV0cmljLiBQcmV0ZW5kIHdlIGRpZG4ndFxuICAgICAgLy8gZmluZCBvbmUuXG4gICAgICBpZiAoZXhpc3RpbmdFbnRyeT8uaWQgJiYgaWQpIHsgZXhpc3RpbmdFbnRyeSA9IHVuZGVmaW5lZDsgfVxuICAgIH1cblxuICAgIC8vIENyZWF0ZSBhIG5ldyBlbnRyeSBpZiB3ZSBkaWRuJ3QgZmluZCBvbmUgc28gZmFyXG4gICAgbGV0IGVudHJ5O1xuICAgIGlmIChleGlzdGluZ0VudHJ5KSB7XG4gICAgICBlbnRyeSA9IGV4aXN0aW5nRW50cnk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudHJ5ID0geyBtZXRyaWMgfTtcbiAgICAgIHRoaXMubWV0cmljcy5wdXNoKGVudHJ5KTtcbiAgICAgIHRoaXMubWV0cmljQnlLZXkuc2V0KGtleSwgZW50cnkpO1xuICAgIH1cblxuICAgIC8vIElmIGl0IGRpZG4ndCBoYXZlIGFuIGlkIGJ1dCBub3cgd2UgZG8sIGFkZCBvbmVcbiAgICBpZiAoIWVudHJ5LmlkICYmIGlkKSB7XG4gICAgICBlbnRyeS5pZCA9IGlkO1xuICAgICAgdGhpcy5tZXRyaWNCeUlkLnNldChpZCwgZW50cnkpO1xuICAgIH1cblxuICAgIC8vIElmIGl0IGRpZG4ndCBoYXZlIGEgdGFnIGJ1dCBub3cgd2UgZG8sIGFkZCBvbmVcbiAgICBpZiAoIWVudHJ5LnRhZyAmJiB0YWcpIHtcbiAgICAgIGVudHJ5LnRhZyA9IHRhZztcbiAgICB9XG5cbiAgICAvLyBSZWN1cnNlIGFuZCBhZGQgY2hpbGRyZW5cbiAgICBjb25zdCBjb25mID0gbWV0cmljLnRvTWV0cmljQ29uZmlnKCk7XG4gICAgaWYgKGNvbmYubWF0aEV4cHJlc3Npb24pIHtcbiAgICAgIGZvciAoY29uc3QgW3N1YklkLCBzdWJNZXRyaWNdIG9mIE9iamVjdC5lbnRyaWVzKGNvbmYubWF0aEV4cHJlc3Npb24udXNpbmdNZXRyaWNzKSkge1xuICAgICAgICB0aGlzLmFkZE9uZShzdWJNZXRyaWMsIHVuZGVmaW5lZCwgc3ViSWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19