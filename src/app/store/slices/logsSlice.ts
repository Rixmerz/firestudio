import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Log {
  type: string;
  message: string;
  details?: unknown;
  timestamp: number;
}

interface LogsState {
  logs: Log[];
}

const initialState: LogsState = {
  logs: [],
};

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<{ type: string; message: string; details?: unknown }>) => {
      const { type, message, details } = action.payload;
      state.logs.push({
        type,
        message,
        details,
        timestamp: Date.now(),
      });
      // Keep logs array from growing indefinitely, keep last 1000
      if (state.logs.length > 1000) {
        state.logs = state.logs.slice(-1000);
      }
    },
    clearLogs: (state) => {
      state.logs = [];
    },
  },
});

export const { addLog, clearLogs } = logsSlice.actions;

export const selectLogs = (state: { logs: LogsState }) => state.logs.logs;

export default logsSlice.reducer;
