import { auth } from "@/firebaseConfig";

const API_URL = import.meta.env.VITE_API_URL || "/api";

async function getToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return user.getIdToken();
}

export interface SkipRecord {
  date: string; // yyyy-MM-dd
  reason: string; // holiday | leave
  createdAt: number;
}

export async function fetchSkips(): Promise<SkipRecord[]> {
  const token = await getToken();
  const res = await fetch(`${API_URL}/skips`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch skips");
  return res.json();
}

export async function upsertSkip(date: string, reason: string): Promise<void> {
  const token = await getToken();
  await fetch(`${API_URL}/skips`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date, reason }),
  });
}

export async function deleteSkip(date: string): Promise<void> {
  const token = await getToken();
  await fetch(`${API_URL}/skips/${date}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}


