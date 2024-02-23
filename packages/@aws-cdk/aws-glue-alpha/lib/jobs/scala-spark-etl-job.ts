/**
 *  Spark ETL Jobs class
 *  ETL jobs support pySpark and Scala languages, for which there are separate
 *  but similar constructors. ETL jobs default to the G2 worker type, but you
 *  can override this default with other supported worker type values
 *  (G1, G2, G4 and G8). ETL jobs defaults to Glue version 4.0, which you can
 *  override to 3.0. The following ETL features are enabled by default:
 *  —enable-metrics, —enable-spark-ui, —enable-continuous-cloudwatch-log.
 *  You can find more details about version, worker type and other features
 *  in Glue's public documentation.
 */

