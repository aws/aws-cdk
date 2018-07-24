using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>Backup configuration for RDS databases</summary>
    public class BackupProps : DeputyBase, IBackupProps
    {
        /// <summary>How many days to retain the backup</summary>
        [JsiiProperty("retentionDays", "{\"primitive\":\"number\"}", true)]
        public double RetentionDays
        {
            get;
            set;
        }

        /// <summary>
        /// A daily time range in 24-hours UTC format in which backups preferably execute.
        /// 
        /// Must be at least 30 minutes long.
        /// 
        /// Example: '01:00-02:00'
        /// </summary>
        [JsiiProperty("preferredWindow", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string PreferredWindow
        {
            get;
            set;
        }
    }
}