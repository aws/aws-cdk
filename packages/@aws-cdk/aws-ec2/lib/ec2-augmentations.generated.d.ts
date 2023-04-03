import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
declare module "./vpn" {
    interface IVpnConnection {
        /**
         * Return the given named metric for this VPNConnection
         */
        metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The state of the tunnel. 0 indicates DOWN and 1 indicates UP.
         *
         * Average over 5 minutes
         */
        metricTunnelState(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The bytes received through the VPN tunnel.
         *
         * Sum over 5 minutes
         */
        metricTunnelDataIn(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The bytes sent through the VPN tunnel.
         *
         * Sum over 5 minutes
         */
        metricTunnelDataOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    }
    interface VpnConnectionBase {
        /**
         * Return the given named metric for this VPNConnection
         */
        metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The state of the tunnel. 0 indicates DOWN and 1 indicates UP.
         *
         * Average over 5 minutes
         */
        metricTunnelState(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The bytes received through the VPN tunnel.
         *
         * Sum over 5 minutes
         */
        metricTunnelDataIn(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
        /**
         * The bytes sent through the VPN tunnel.
         *
         * Sum over 5 minutes
         */
        metricTunnelDataOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    }
}
