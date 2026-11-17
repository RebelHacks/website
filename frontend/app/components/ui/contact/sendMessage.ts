"use server";

import { headers } from "next/headers";
import { MAX_LENGTHS } from "./contactData";

export interface ContactMessage {
  name: string;
  email: string;
  role: string;
  message: string;
  // the hidden field only bots fill in
  botcheck: boolean;
}

// ------ checks ------

// A script can call sendMessage with anything, so the types above aren't a guarantee.
function isText(value: unknown, maxLength: number) {
  return (
    typeof value === "string" &&
    value.trim() !== "" &&
    value.length <= maxLength
  );
}

const SENDS_PER_HOUR = 5;
const HOUR = 60 * 60 * 1000;

// When each visitor sent a message, by IP address. Kept in memory, so it
// resets when the site restarts.
const recentSends = new Map<string, number[]>();

// The header can be faked, so this only slows down casual abuse.
async function getVisitor() {
  const forwardedFor = (await headers()).get("x-forwarded-for") ?? "";
  return forwardedFor.split(",")[0].trim() || "unknown";
}

// Also counts this send if the visitor is under the limit.
function isOverLimit(visitor: string) {
  const now = Date.now();

  // drop everything older than an hour, so the map doesn't grow forever
  for (const [key, times] of recentSends) {
    const lastHour = times.filter((time) => now - time < HOUR);
    if (lastHour.length > 0) recentSends.set(key, lastHour);
    else recentSends.delete(key);
  }

  const sends = recentSends.get(visitor) ?? [];
  if (sends.length >= SENDS_PER_HOUR) return true;
  recentSends.set(visitor, [...sends, now]);
  return false;
}

// ------ sending ------

// The backend emails the message to the organizers with Symfony Mailer.
// This runs on our server, so the backend's address stays out of the browser.
export async function sendMessage({
  name,
  email,
  role,
  message,
  botcheck,
}: ContactMessage) {
  // a bot hears that it worked, so it doesn't try another way
  if (botcheck) return true;

  const isValid =
    isText(name, MAX_LENGTHS.name) &&
    isText(email, MAX_LENGTHS.email) &&
    isText(role, MAX_LENGTHS.role) &&
    isText(message, MAX_LENGTHS.message);
  if (!isValid) return false;

  if (isOverLimit(await getVisitor())) return false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contact-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // the backend has no field for the role, so it goes in the message
        body: JSON.stringify({
          name,
          email,
          message: `Writing as: ${role}\n\n${message}`,
        }),
      },
    );
    const result = await response.json();
    if (result.success) return true;

    console.error("The backend refused the contact message:", result);
    return false;
  } catch (error) {
    console.error("The contact message couldn't reach the backend:", error);
    return false;
  }
}
