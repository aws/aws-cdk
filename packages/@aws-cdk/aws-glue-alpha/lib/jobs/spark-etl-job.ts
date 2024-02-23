/**
 *  Spark ETL Jobs class
 *
 * ETL jobs supports Python and Scala language.
 * ETL job type supports G1, G2, G4 and G8 worker type default as G2, which customer can override.
 * It wil default to the best practice version of ETL 4.0, but allow developers to override to 3.0.
 * We will also default to best practice enablement the following ETL features:
 *  —enable-metrics, —enable-spark-ui, —enable-continuous-cloudwatch-log.
 *
 */