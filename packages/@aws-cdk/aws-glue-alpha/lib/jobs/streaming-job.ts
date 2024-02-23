/**
 *  Streaming Jobs class
 *
 * A Streaming job is similar to an ETL job, except that it performs ETL on data streams
 * using the Apache Spark Structured Streaming framework.
 * These jobs will default to use Python 3.9.
 *
 * Similar to ETL jobs, streaming job supports Scala and Python languages. Similar to ETL,
 * it supports G1 and G2 worker type and 2.0, 3.0 and 4.0 version. We’ll default to G2 worker
 * and 4.0 version for streaming jobs which developers can override.
 * We will enable —enable-metrics, —enable-spark-ui, —enable-continuous-cloudwatch-log.
 *
 */
