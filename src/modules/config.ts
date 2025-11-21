export type WidgetConfig = {
  defaultName: string;
  defaultEmail: string;
  maxFileSize: number;
  appsLabel: string;
  successMessage: string;
  emptyStateText: string;
};

export const ConfigModule = (() => {
  const config: WidgetConfig = {
    defaultName: "[Internal User Name]",
    defaultEmail: "[Internal User Email]",
    maxFileSize: 5 * 1024 * 1024,
    appsLabel: "Portal Behn Meyer",
    successMessage: "Ticket submitted successfully!",
    emptyStateText: "No tickets submitted yet.",
  };

  return {
    getConfig: (): WidgetConfig => ({ ...config }),
  };
})();

