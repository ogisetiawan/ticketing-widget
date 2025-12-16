export const TicketManager = (() => {
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
    const list = () => tickets;
    const setTickets = (data) => {
        tickets = data.map((item, index) => ({
            ...item,
            id: item.id ?? index + 1,
        }));
    };
    const clear = () => {
        tickets = [];
    };
    return {
        list,
        setTickets,
        clear,
    };
})();
