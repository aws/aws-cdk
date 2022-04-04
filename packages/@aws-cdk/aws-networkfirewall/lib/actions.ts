
export enum StatelessStandardAction {
  /**
   * Discontinues stateless inspection of the packet and forwards it to the stateful rule engine for inspection.
   */
  FORWARD = 'aws:forward_to_sfe',

  /**
   * Discontinues all inspection of the packet and permits it to go to its intended destination
   */
  PASS = 'aws:pass',

  /**
   * Discontinues all inspection of the packet and blocks it from going to its intended destination.
   */
  DROP = 'aws:drop',
}

export enum StatefulStandardAction {
  /**
   * Permits the packets to go to the intended destination.
   */
  PASS = 'PASS',

  /**
   * Blocks the packets from going to the intended destination and sends an alert log message, if alert logging is configured in the firewall.
   */
  DROP = 'DROP',

  /**
   * Permits the packets to go to the intended destination and sends an alert log message, if alert logging is configured in the firewall.
   */
  ALERT = 'ALERT',
}

export enum StatefulStrictAction {

  /**
   * Drops all packets.
   */
  DROP_STRICT = 'aws:drop_strict',

  /**
   * Drops only the packets that are in established connections.
   * This allows the layer 3 and 4 connection establishment packets that are needed for the upper-layer connections to be established, while dropping the packets for connections that are already established.
   * This allows application-layer pass rules to be written in a default-deny setup without the need to write additional rules to allow the lower-layer handshaking parts of the underlying protocols.
   */
  DROP_ESTABLISHED = 'aws:drop_established',

  /**
   * Logs an ALERT message on all packets.
   * This does not drop packets, but alerts you to what would be dropped if you were to choose Drop all.
   */
  ALERT_STRICT = 'aws:alert_strict',

  /**
   * Logs an ALERT message on only the packets that are in established connections.
   * This does not drop packets, but alerts you to what would be dropped if you were to choose Drop established.
   */
  ALERT_ESTABLISHED = 'aws:alert_established'
}
