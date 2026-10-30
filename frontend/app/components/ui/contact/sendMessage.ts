import { CONTACT_EMAIL, WEB3FORMS_ACCESS_KEY } from "./contactData";

export interface ContactMessage {
  name: string;
  email: string;
  role: string;
  message: string;
  // the hidden field only bots fill in
  botcheck: boolean;
}

// Web3Forms emails the message to CONTACT_EMAIL
export async function sendMessage({ botcheck, ...message }: ContactMessage) {
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Website message from ${message.name} (${message.role})`,
        ...message,
        // Web3Forms drops anything with botcheck set, so only send it if it's checked
        ...(botcheck && { botcheck }),
      }),
    });
    const result = await response.json();
    if (result.success) return true;

    console.error(`The message to ${CONTACT_EMAIL} was refused:`, result);
    return false;
  } catch (error) {
    console.error(`The message to ${CONTACT_EMAIL} couldn't be sent:`, error);
    return false;
  }
}
