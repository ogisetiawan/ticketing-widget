declare global {
  interface Window {
    BMTicketingWidgetConfig?: {
      apiUrl?: string;
      payload?: {
        app_name?: string;
        timestamp?: number;
        user_email?: string;
        user_id?: string;
        user_name?: string;
      };
      signature?: string;
    };
  }
}

export type WidgetConfig = {
  defaultName: string;
  defaultEmail: string;
  maxFileSize: number;
  maxFiles: number;
  appsLabel: string;
  successMessage: string;
  emptyStateText: string;
  apiUrl: string;
  sharedSecret: string;
};

export const ConfigModule = (() => {
  const DEFAULTS: WidgetConfig = {
    defaultName: "[Internal User Name]",
    defaultEmail: "[Internal User Email]",
    maxFileSize: 10 * 1024 * 1024,
    maxFiles: 5,
    appsLabel: "Portal Behn Meyer",
    successMessage: "Ticket submitted successfully!",
    emptyStateText: "No tickets submitted yet.",
    apiUrl: "/bm-ticketing/tickets",
    sharedSecret: "",
  };

  const buildConfig = (): WidgetConfig => {
    const payload = window.BMTicketingWidgetConfig?.payload ?? {};
    const apiUrl = window.BMTicketingWidgetConfig?.apiUrl || DEFAULTS.apiUrl;
    const sharedSecret = window.BMTicketingWidgetConfig?.signature || DEFAULTS.sharedSecret;

    return {
      ...DEFAULTS,
      defaultName: payload.user_name || DEFAULTS.defaultName,
      defaultEmail: payload.user_email || DEFAULTS.defaultEmail,
      appsLabel: payload.app_name || DEFAULTS.appsLabel,
      apiUrl,
      sharedSecret,
    };
  };

  const config = buildConfig();

  return {
    getConfig: (): WidgetConfig => ({ ...config }),
  };
})();

