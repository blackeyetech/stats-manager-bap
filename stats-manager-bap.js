"use strict";

// Config consts and defaults
const CFG_INTERVAL = "interval";
const CFG_INTERVAL_DEFAULT = 0;

class StatsManagerBap extends besh.Bap {
  constructor(name) {
    super(name);

    this.log.info("Initialising ...");

    this.interval = this.getCfg(CFG_INTERVAL, CFG_INTERVAL_DEFAULT);
    this.log.info(`${CFG_INTERVAL} set to (${this.interval}) secs`);

    this.log.info("Finished initialising");
  }

  async start() {
    this.log.info("Starting ...");

    if (this.interval > 0) {
      this.timeout = setInterval(
        this.publish.bind(this), this.interval*1000);
    }

    this.log.info("Started!");
  }

  async stop() {
    this.log.info("Stopping ...!");
    this.publish();
    if (this.interval > 0) {
      clearInterval(this.timeout);
      this.log.info("Stopped interval timer");
    }
    this.log.info("Stopped!");
  }

  publish() {
    let bapList = besh.getBapList();

    let now = Date.now();
    bapList.forEach((bap) => {
      let stats = bap.stats.get(now);

      if (stats !== null) {
        this.log.info("%j", stats);
      }
    });
  }

  get() {
    let allStats = [];

    let bapList = besh.getBapList();

    bapList.forEach((bap) => {
      let stats = bap.stats.get();

      if (stats !== null) {
        allStats.push(stats);
      }
    });

    return allStats;
  }
}

// Use the same version as besh
StatsManagerBap.version = besh.version;

module.exports = StatsManagerBap;
