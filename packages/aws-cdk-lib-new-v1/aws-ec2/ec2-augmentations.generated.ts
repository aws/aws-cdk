// Copyright 2012-2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
/* eslint-disable prettier/prettier,max-len */
import * as cw from "aws-cdk-lib/aws-cloudwatch";
import { VpnConnectionBase } from "./vpn";

declare module "./vpn" {
  interface IVpnConnection {
    /**
     * Return the given named metric for this VPNConnection
     */
    metric(metricName: string, props?: cw.MetricOptions): cw.Metric;

    /**
     * The state of the tunnel. 0 indicates DOWN and 1 indicates UP.
     *
     * Average over 5 minutes
     */
    metricTunnelState(props?: cw.MetricOptions): cw.Metric;

    /**
     * The bytes received through the VPN tunnel.
     *
     * Sum over 5 minutes
     */
    metricTunnelDataIn(props?: cw.MetricOptions): cw.Metric;

    /**
     * The bytes sent through the VPN tunnel.
     *
     * Sum over 5 minutes
     */
    metricTunnelDataOut(props?: cw.MetricOptions): cw.Metric;
  }
}



declare module "./vpn" {
  interface VpnConnectionBase {
    /**
     * Return the given named metric for this VPNConnection
     */
    metric(metricName: string, props?: cw.MetricOptions): cw.Metric;

    /**
     * The state of the tunnel. 0 indicates DOWN and 1 indicates UP.
     *
     * Average over 5 minutes
     */
    metricTunnelState(props?: cw.MetricOptions): cw.Metric;

    /**
     * The bytes received through the VPN tunnel.
     *
     * Sum over 5 minutes
     */
    metricTunnelDataIn(props?: cw.MetricOptions): cw.Metric;

    /**
     * The bytes sent through the VPN tunnel.
     *
     * Sum over 5 minutes
     */
    metricTunnelDataOut(props?: cw.MetricOptions): cw.Metric;
  }
}

VpnConnectionBase.prototype.metric = function(metricName: string, props?: cw.MetricOptions) {
  return new cw.Metric({
    "namespace": "AWS/VPN",
    "metricName": metricName,
    "dimensionsMap": {
      "VpnId": this.vpnId
    },
    ...props
  }).attachTo(this);
};
VpnConnectionBase.prototype.metricTunnelState = function(props?: cw.MetricOptions) {
  return this.metric("TunnelState", {
    "statistic": "Average",
    ...props
  });
};
VpnConnectionBase.prototype.metricTunnelDataIn = function(props?: cw.MetricOptions) {
  return this.metric("TunnelDataIn", {
    "statistic": "Sum",
    ...props
  });
};
VpnConnectionBase.prototype.metricTunnelDataOut = function(props?: cw.MetricOptions) {
  return this.metric("TunnelDataOut", {
    "statistic": "Sum",
    ...props
  });
};