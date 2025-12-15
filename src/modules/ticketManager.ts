import { ConfigModule } from "./config";

export type TicketType = "Bug Report" | "Support" | "Feature Request" | "Others";
export type TicketStatus = "Pending" | "In Progress" | "Resolved" | "Closed";

export type TicketRecord = {
  id: number;
  user: string;
  email: string;
  subject: string;
  type: TicketType;
  status: TicketStatus;
  createdAt: string;
  apps: string;
};

export const TicketManager = (() => {
  const { appsLabel } = ConfigModule.getConfig();
  let tickets: TicketRecord[] = [];
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

  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const addTicket = ({
    user,
    subject,
    type,
  }: {
    user: string;
    subject: string;
    type: TicketType;
  }): TicketRecord => {
    const record: TicketRecord = {
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

  const list = (): readonly TicketRecord[] => tickets;

  const setTickets = (data: TicketRecord[]) => {
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

