export const ConfigModule = (() => {
    const DEFAULTS = {
        defaultName: "[Internal User Name]",
        defaultEmail: "[Internal User Email]",
        maxFileSize: 10 * 1024 * 1024,
        maxFiles: 5,
        appsLabel: "Portal Behn Meyer",
        successMessage: "Ticket submitted successfully!",
        emptyStateText: "No tickets submitted yet.",
        apiUrl: import.meta.env.VITE_BM_TICKETING_API || "http://localhost:3000/bm-ticketing/tickets",
        sharedSecret: "",
    };
    const buildConfig = () => {
        const payload = window.BMTicketingWidgetConfig?.payload ?? {};
        const apiUrl = DEFAULTS.apiUrl;
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
        getConfig: () => ({ ...config }),
    };
})();
