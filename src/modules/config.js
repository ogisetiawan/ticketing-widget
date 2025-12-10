export const ConfigModule = (() => {
    const config = {
        defaultName: "[Internal User Name]",
        defaultEmail: "[Internal User Email]",
        maxFileSize: 10 * 1024 * 1024,
        maxFiles: 5,
        appsLabel: "Portal Behn Meyer",
        successMessage: "Ticket submitted successfully!",
        emptyStateText: "No tickets submitted yet.",
    };
    return {
        getConfig: () => ({ ...config }),
    };
})();
