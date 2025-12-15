export const TicketManager = (() => {
    // const { appsLabel } = ConfigModule.getConfig();
    let tickets = [];
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
    // const formatDate = (date: Date): string => {
    //   const day = date.getDate();
    //   const month = months[date.getMonth()];
    //   const year = date.getFullYear();
    //   return `${day} ${month} ${year}`;
    // };
    // const addTicket = ({
    //   user,
    //   subject,
    //   type,
    // }: {
    //   user: string;
    //   subject: string;
    //   type: TicketType;
    // }): TicketRecord => {
    //   const record: TicketRecord = {
    //     id,
    //     user,
    //     subject,
    //     type,
    //     status: "Pending",
    //     apps: appsLabel,
    //     createdAt: formatDate(new Date()),
    //     email: ""
    //   };
    //   tickets.unshift(record);
    //   return record;
    // };
    const list = () => tickets;
    const setTickets = (data) => {
        tickets = data.map((item, index) => ({
            ...item,
            id: item.id ?? index + 1,
        }));
        // counter = tickets.length + 1;
    };
    const clear = () => {
        tickets = [];
        // counter = 1;
    };
    return {
        // addTicket,
        list,
        setTickets,
        clear,
    };
})();
