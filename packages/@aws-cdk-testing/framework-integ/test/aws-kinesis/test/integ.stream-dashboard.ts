import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { App, Stack } from 'aws-cdk-lib';
import { Stream } from 'aws-cdk-lib/aws-kinesis';

const app = new App();
const stack = new Stack(app, 'integ-kinesis-stream-dashboard');

const stream = new Stream(stack, 'myStream');

const dashboard = new cloudwatch.Dashboard(stack, 'StreamDashboard');

function graphWidget(title: string, metric: cloudwatch.Metric) {
  return new cloudwatch.GraphWidget({
    title,
    left: [metric],
    width: 12,
    height: 5,
  });
}

function percentGraphWidget(title: string, countMetric: cloudwatch.Metric, totalMetric: cloudwatch.Metric) {
  return new cloudwatch.GraphWidget({
    title,
    left: [new cloudwatch.MathExpression({
      expression: '( count / total ) * 100',
      usingMetrics: {
        count: countMetric,
        total: totalMetric,
      },
    })],
    width: 12,
    height: 5,
  });
}

dashboard.addWidgets(
  graphWidget('Get records - sum (Bytes)', stream.metricGetRecordsBytes({ statistic: 'Sum' })),
  graphWidget('Get records iterator age - maximum (Milliseconds)', stream.metricGetRecordsIteratorAgeMilliseconds()),
  graphWidget('Get records latency - average (Milliseconds)', stream.metricGetRecordsLatency()),
  graphWidget('Get records - sum (Count)', stream.metricGetRecords({ statistic: 'Sum' })),
  graphWidget('Get records success - average (Percent)', stream.metricGetRecordsSuccess()),
  graphWidget('Incoming data - sum (Bytes)', stream.metricIncomingBytes({ statistic: 'Sum' })),
  graphWidget('Incoming records - sum (Count)', stream.metricIncomingRecords({ statistic: 'Sum' })),
  graphWidget('Put record - sum (Bytes)', stream.metricPutRecordBytes({ statistic: 'Sum' })),
  graphWidget('Put record latency - average (Milliseconds)', stream.metricPutRecordLatency()),
  graphWidget('Put record success - average (Percent)', stream.metricPutRecordSuccess()),
  graphWidget('Put records - sum (Bytes)', stream.metricPutRecordsBytes({ statistic: 'Sum' })),
  graphWidget('Put records latency - average (Milliseconds)', stream.metricPutRecordsLatency()),
  graphWidget('Read throughput exceeded - average (Percent)', stream.metricReadProvisionedThroughputExceeded()),
  graphWidget('Write throughput exceeded - average (Count)', stream.metricWriteProvisionedThroughputExceeded()),
  percentGraphWidget('Put records successful records - average (Percent)',
    stream.metricPutRecordsSuccessfulRecords(), stream.metricPutRecordsTotalRecords()),
  percentGraphWidget('Put records failed records - average (Percent)',
    stream.metricPutRecordsFailedRecords(), stream.metricPutRecordsTotalRecords()),
  percentGraphWidget('Put records throttled records - average (Percent)',
    stream.metricPutRecordsThrottledRecords(), stream.metricPutRecordsTotalRecords()),
);
