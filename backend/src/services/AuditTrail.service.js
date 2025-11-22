function record(action, entity, before, after, user='system') {
  // Placeholder: push to DB table audit_logs
  console.log('[audit]', { action, entity, user, before, after, ts: new Date().toISOString() });
}
module.exports = { record };
