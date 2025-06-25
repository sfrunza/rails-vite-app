// import type { SessionRequest, SessionResponse, SessionUser } from "@/types/user";
// import Cookies from "js-cookie";

// const API_URL = import.meta.env.VITE_API_URL;

// export async function login({ email_address, password }: SessionRequest): Promise<SessionResponse> {
//   const response = await fetch(`${API_URL}/api/v1/session`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       credentials: 'include',
//     },
//     body: JSON.stringify({ email_address, password }),
//   });

//   if (!response.ok) {
//     throw new Error(response.statusText);
//   }

//   return response.json();
// }

// export async function verifySession(): Promise<SessionUser | { error: string }> {
//   const response = await fetch(`${API_URL}/api/v1/session`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       credentials: 'include',
//     },
//   });

//   if (!response.ok) {
//     Cookies.remove("session_id");
//     throw new Error(response.statusText);
//   }

//   return response.json();
// }