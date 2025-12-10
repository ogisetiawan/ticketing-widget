import { ConfigModule } from "./config";

export type TicketType = "bug" | "support" | "feature" | "others";
export type TicketStatus = "Pending" | "In Progress" | "Resolved" | "Closed";

export type TicketRecord = {
  id: number;
  user: string;
  subject: string;
  type: TicketType;
  status: TicketStatus;
  date: string;
  apps: string;
};

export const TicketManager = (() => {
  const { appsLabel } = ConfigModule.getConfig();
  const tickets: TicketRecord[] = [];
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
      date: formatDate(new Date()),
    };
    tickets.unshift(record);
    return record;
  };

  const list = (): readonly TicketRecord[] => tickets;

  return {
    addTicket,
    list,
  };
})();

