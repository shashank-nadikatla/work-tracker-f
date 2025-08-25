import { auth } from "@/firebaseConfig";
import { ActivityEntry } from "@/store/useActivityStore";

// When deployed on Firebase Hosting we rely on the rewrite that proxies "/api" to the Cloud Function
const API_URL = import.meta.env.VITE_API_URL || "/api";

async function getToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return user.getIdToken();
}

export async function fetchEntries(): Promise<ActivityEntry[]> {
  const token = await getToken();
  const res = await fetch(`${API_URL}/entries`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch entries");
  return res.json();
}

export async function upsertEntry(entry: ActivityEntry): Promise<void> {
  const token = await getToken();
  await fetch(`${API_URL}/entries`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry),
  });
}

export async function deleteEntry(id: string): Promise<void> {
  const token = await getToken();
  await fetch(`${API_URL}/entries/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
