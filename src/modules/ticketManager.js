import { ConfigModule } from "./config";
export const TicketManager = (() => {
    const { appsLabel } = ConfigModule.getConfig();
    const tickets = [];
    let counter = 1;
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
    ];
    const formatDate = (date) => {
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };
    const addTicket = ({ user, subject, type, }) => {
        const record = {
            id: counter++,
            user,
            subject,
            type,
            status: "Pending",
            apps: appsLabel,
            date: formatDate(new Date()),
        };
        tickets.unshift(record);
        return record;
    };
    const list = () => tickets;
    return {
        addTicket,
        list,
    };
})();
