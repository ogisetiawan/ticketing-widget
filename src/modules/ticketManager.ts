import { ConfigModule } from "./config";

export type TicketType = "Bug Report" | "Support" | "Feature Request" | "Others";
export type TicketStatus = "Pending" | "In Progress" | "Resolved" | "Closed";

export type TicketRecord = {
  id: string;
  user: string;
  email: string;
  subject: string;
  type: TicketType;
  status: TicketStatus;
  createdAt: string;
  apps: string;
};

export const TicketManager = (() => {
  let tickets: TicketRecord[] = [];

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

  const list = (): readonly TicketRecord[] => tickets;

  const setTickets = (data: TicketRecord[]) => {
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

