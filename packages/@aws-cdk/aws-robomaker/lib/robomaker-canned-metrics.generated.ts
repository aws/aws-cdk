// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class RoboMakerMetrics {
  public static vCpuAverage(dimensions: { SimulationJobId: string }) {
    return {
      namespace: 'AWS/RoboMaker',
      metricName: 'vCPU',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static memoryMaximum(dimensions: { SimulationJobId: string }) {
    return {
      namespace: 'AWS/RoboMaker',
      metricName: 'Memory',
      dimensionsMap: dimensions,
      statistic: 'Maximum',
    };
  }
  public static realTimeRatioAverage(dimensions: { SimulationJobId: string }) {
    return {
      namespace: 'AWS/RoboMaker',
      metricName: 'RealTimeRatio',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static simulationUnitSum(dimensions: { SimulationJobId: string }) {
    return {
      namespace: 'AWS/RoboMaker',
      metricName: 'SimulationUnit',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
