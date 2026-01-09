export type TicketStatus = "pending" | "in_progress" | "resolved";

export type Ticket = {
  id: string;
  code: string;
  client: string;
  email: string;
  subject: string;
  status: TicketStatus;
  createdAt: string;
};

export type TicketsResponse = {
  items: Ticket[];
  page: number;
  pageSize: number;
  total: number;
};