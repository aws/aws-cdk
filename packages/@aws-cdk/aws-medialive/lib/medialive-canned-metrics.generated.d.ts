export declare class MediaLiveMetrics {
    static activeAlertsMaximum(dimensions: {
        ChannelId: string;
        Pipeline: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ChannelId: string;
            Pipeline: string;
        };
        statistic: string;
    };
    static inputVideoFrameRateAverage(dimensions: {
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ChannelId: string;
        Pipeline: string;
    }>;
    static inputVideoFrameRateAverage(dimensions: {
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }>;
    static fillMsecAverage(dimensions: {
        ChannelId: string;
        Pipeline: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ChannelId: string;
            Pipeline: string;
        };
        statistic: string;
    };
    static inputLossSecondsSum(dimensions: {
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ChannelId: string;
        Pipeline: string;
    }>;
    static inputLossSecondsSum(dimensions: {
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }>;
    static rtpPacketsReceivedSum(dimensions: {
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ChannelId: string;
        Pipeline: string;
    }>;
    static rtpPacketsReceivedSum(dimensions: {
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }>;
    static rtpPacketsRecoveredViaFecSum(dimensions: {
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ChannelId: string;
        Pipeline: string;
    }>;
    static rtpPacketsRecoveredViaFecSum(dimensions: {
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }>;
    static rtpPacketsLostSum(dimensions: {
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ChannelId: string;
        Pipeline: string;
    }>;
    static rtpPacketsLostSum(dimensions: {
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }>;
    static fecRowPacketsReceivedSum(dimensions: {
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ChannelId: string;
        Pipeline: string;
    }>;
    static fecRowPacketsReceivedSum(dimensions: {
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }>;
    static fecColumnPacketsReceivedSum(dimensions: {
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ChannelId: string;
        Pipeline: string;
    }>;
    static fecColumnPacketsReceivedSum(dimensions: {
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }>;
    static primaryInputActiveMinimum(dimensions: {
        ChannelId: string;
        Pipeline: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ChannelId: string;
            Pipeline: string;
        };
        statistic: string;
    };
    static networkInAverage(dimensions: {
        ChannelId: string;
        Pipeline: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ChannelId: string;
            Pipeline: string;
        };
        statistic: string;
    };
    static networkOutAverage(dimensions: {
        ChannelId: string;
        Pipeline: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ChannelId: string;
            Pipeline: string;
        };
        statistic: string;
    };
    static pipelinesLockedMinimum(dimensions: {
        ChannelId: string;
        Pipeline: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ChannelId: string;
            Pipeline: string;
        };
        statistic: string;
    };
    static inputTimecodesPresentMinimum(dimensions: {
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ChannelId: string;
        Pipeline: string;
    }>;
    static inputTimecodesPresentMinimum(dimensions: {
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }): MetricWithDims<{
        ActiveInputFailoverLabel: string;
        ChannelId: string;
        Pipeline: string;
    }>;
    static activeOutputsMaximum(dimensions: {
        ChannelId: string;
        OutputGroupName: string;
        Pipeline: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ChannelId: string;
            OutputGroupName: string;
            Pipeline: string;
        };
        statistic: string;
    };
    static output4XxErrorsSum(dimensions: {
        ChannelId: string;
        OutputGroupName: string;
        Pipeline: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ChannelId: string;
            OutputGroupName: string;
            Pipeline: string;
        };
        statistic: string;
    };
    static output5XxErrorsSum(dimensions: {
        ChannelId: string;
        OutputGroupName: string;
        Pipeline: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ChannelId: string;
            OutputGroupName: string;
            Pipeline: string;
        };
        statistic: string;
    };
    static audioLevelMaximum(dimensions: {
        AudioDescriptionName: string;
        ChannelId: string;
        Pipeline: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            AudioDescriptionName: string;
            ChannelId: string;
            Pipeline: string;
        };
        statistic: string;
    };
    static outputAudioLevelDbfsMaximum(dimensions: {
        AudioDescriptionName: string;
        ChannelId: string;
        Pipeline: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            AudioDescriptionName: string;
            ChannelId: string;
            Pipeline: string;
        };
        statistic: string;
    };
    static outputAudioLevelLkfsMaximum(dimensions: {
        AudioDescriptionName: string;
        ChannelId: string;
        Pipeline: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            AudioDescriptionName: string;
            ChannelId: string;
            Pipeline: string;
        };
        statistic: string;
    };
}
declare type MetricWithDims<D> = {
    namespace: string;
    metricName: string;
    statistic: string;
    dimensionsMap: D;
};
export {};
