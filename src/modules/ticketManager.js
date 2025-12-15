import { ConfigModule } from "./config";
export const TicketManager = (() => {
    const { appsLabel } = ConfigModule.getConfig();
    let tickets = [];
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
            createdAt: formatDate(new Date()),
            email: ""
        };
        tickets.unshift(record);
        return record;
    };
    const list = () => tickets;
    const setTickets = (data) => {
        tickets = data.map((item, index) => ({
            ...item,
            id: item.id ?? index + 1,
        }));
        counter = tickets.length + 1;
    };
    const clear = () => {
        tickets = [];
        counter = 1;
    };
    return {
        addTicket,
        list,
        setTickets,
        clear,
    };
})();
