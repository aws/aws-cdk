export declare class Route53Metrics {
    static healthCheckPercentageHealthyAverage(dimensions: {
        HealthCheckId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            HealthCheckId: string;
        };
        statistic: string;
    };
    static connectionTimeAverage(dimensions: {
        HealthCheckId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            HealthCheckId: string;
        };
        statistic: string;
    };
    static healthCheckStatusMinimum(dimensions: {
        HealthCheckId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            HealthCheckId: string;
        };
        statistic: string;
    };
    static sslHandshakeTimeAverage(dimensions: {
        HealthCheckId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            HealthCheckId: string;
        };
        statistic: string;
    };
    static childHealthCheckHealthyCountAverage(dimensions: {
        HealthCheckId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            HealthCheckId: string;
        };
        statistic: string;
    };
    static timeToFirstByteAverage(dimensions: {
        HealthCheckId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            HealthCheckId: string;
        };
        statistic: string;
    };
}
