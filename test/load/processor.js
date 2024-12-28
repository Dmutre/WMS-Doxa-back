'use strict';

const SCHEDULED_DELAY = 1000 * 60 * 60; // 1 hour

module.exports = {
  setScheduledAt(req, ctx, ee, next) {
    req.json.scheduledAt = new Date(Date.now() + SCHEDULED_DELAY).toISOString();
    return next();
  },
};
