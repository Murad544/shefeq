class RealtimeManager {
  constructor() {
    this.clients = new Map(); // userId -> Set of res objects
    this.adminApprovedClients = new Set(); // Set of admin res objects subscribed to approved applications
  }

  addClient(userId, res) {
    const stringId = String(userId);
    if (!this.clients.has(stringId)) {
      this.clients.set(stringId, new Set());
    }
    this.clients.get(stringId).add(res);
    console.log(
      `[Realtime] Client added for user ${stringId}. `
      + `Total clients: ${this.clients.get(stringId).size}`,
    );
  }

  removeClient(userId, res) {
    const stringId = String(userId);
    const userClients = this.clients.get(stringId);
    if (userClients) {
      userClients.delete(res);
      console.log(
        `[Realtime] Client removed for user ${stringId}. `
        + `Remaining: ${userClients.size}`,
      );
      if (userClients.size === 0) {
        this.clients.delete(stringId);
      }
    }
  }

  broadcastSessions(userId, sessions) {
    const stringId = String(userId);
    const userClients = this.clients.get(stringId);
    if (userClients && userClients.size > 0) {
      const payload = `data: ${JSON.stringify({ sessions })}\n\n`;
      console.log(
        '[Realtime] Broadcasting session update to '
        + `${userClients.size} clients for user ${stringId}`,
      );
      userClients.forEach((res) => {
        try {
          res.write(payload);
          if (typeof res.flush === 'function') {
            res.flush();
          }
        } catch (error) {
          console.error(
            `[Realtime] Failed to send update to user ${stringId}:`,
            error,
          );
        }
      });
    }
  }

  addAdminApprovedClient(res) {
    this.adminApprovedClients.add(res);
    console.log(
      `[Realtime] Admin approved client added. Total: ${this.adminApprovedClients.size}`,
    );
  }

  removeAdminApprovedClient(res) {
    this.adminApprovedClients.delete(res);
    console.log(
      `[Realtime] Admin approved client removed. Remaining: ${this.adminApprovedClients.size}`,
    );
  }

  broadcastApprovedApplications(approvedApplications) {
    if (this.adminApprovedClients.size > 0) {
      const payload = `data: ${JSON.stringify({ approvedApplications })}\n\n`;
      console.log(
        `[Realtime] Broadcasting approved applications update to ${this.adminApprovedClients.size} admin clients`,
      );
      this.adminApprovedClients.forEach((res) => {
        try {
          res.write(payload);
          if (typeof res.flush === 'function') {
            res.flush();
          }
        } catch (error) {
          console.error(
            '[Realtime] Failed to send approved applications update:',
            error,
          );
        }
      });
    }
  }
}

module.exports = new RealtimeManager();
