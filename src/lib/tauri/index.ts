declare global {
  interface Window {
    __TAURI__?: {
      invoke: (command: string, args?: Record<string, unknown>) => Promise<unknown>;
      listen: (event: string, handler: (event: { payload: unknown }) => void) => Promise<() => void>;
    };
  }
}

export {};
