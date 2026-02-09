import { API_BASE_URL } from "./config";
import { Ticket } from "./types";

type ApiResponse<T> = {
  data: T;
  error?: string;
};

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        ...defaultHeaders,
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });
  } catch (error) {
    throw new Error(`Unable to reach API at ${url}. Ensure the Express server is running. Original error: ${String(error)}`);
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `Request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;
  return payload.data;
}

export const fetchTickets = () => apiFetch<Ticket[]>("/tickets");
export const fetchTicketById = (id: string) => apiFetch<Ticket>(`/tickets/${id}`);
export const resolveTicketRequest = (id: string, draftReply?: string) =>
  apiFetch<Ticket>(`/tickets/${id}/resolve`, {
    method: "PATCH",
    body: JSON.stringify({ draftReply }),
  });
