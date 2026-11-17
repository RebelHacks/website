"use server";

export interface ContactMessage {
  name: string;
  email: string;
  role: string;
  message: string;
  // the hidden field only bots fill in
  botcheck: boolean;
}

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
