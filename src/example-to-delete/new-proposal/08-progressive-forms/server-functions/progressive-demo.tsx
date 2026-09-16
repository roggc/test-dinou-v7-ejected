"use server";

export interface FeedbackEntry {
  id: string;
  sender: string;
  comment: string;
  rating: number;
  submittedAt: string;
  isJsFree: boolean;
}

let feedbackStorage: FeedbackEntry[] = [
  {
    id: "fb-1",
    sender: "Alex Dev",
    comment: "Submitted via native HTML POST without JavaScript loaded!",
    rating: 5,
    submittedAt: "10:15 AM",
    isJsFree: true,
  },
  {
    id: "fb-2",
    sender: "Sarah Engineer",
    comment: "Server Actions work flawlessly with progressive enhancement.",
    rating: 5,
    submittedAt: "11:42 AM",
    isJsFree: true,
  },
];

export async function submitProgressiveFeedback(formData: FormData): Promise<FeedbackEntry[]> {
  const sender = (formData.get("sender") as string)?.trim() || "Anonymous Developer";
  const comment = (formData.get("comment") as string)?.trim() || "Great framework experience!";
  const rating = Number(formData.get("rating") || 5);
  const isJsFree = formData.get("js_status") !== "active";

  // Simulate server processing in Node.js
  await new Promise((resolve) => setTimeout(resolve, 400));

  const newEntry: FeedbackEntry = {
    id: "fb-" + Date.now(),
    sender,
    comment,
    rating,
    submittedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    isJsFree,
  };

  feedbackStorage = [newEntry, ...feedbackStorage.slice(0, 3)];
  return [...feedbackStorage];
}

export async function getFeedbackEntries(): Promise<FeedbackEntry[]> {
  return [...feedbackStorage];
}
