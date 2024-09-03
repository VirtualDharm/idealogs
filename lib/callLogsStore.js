// lib/callLogsStore.js
let callLogs = [];

export const addCallLog = (log) => {
  callLogs.push(log);
};

export const getCallLogs = () => {
  return callLogs;
};

export const clearCallLogs = () => {
  callLogs = [];
};