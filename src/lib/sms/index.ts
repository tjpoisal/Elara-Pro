import twilio from 'twilio';

const getClient = () =>
  twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER!;

export async function sendPatchTestReminder(params: {
  to: string;
  clientName: string;
  checkTime: string;
}): Promise<void> {
  const client = getClient();
  await client.messages.create({
    body: `Elara Pro: Patch test for ${params.clientName} is ready to check at ${params.checkTime}. Log results before proceeding with color service.`,
    from: FROM_NUMBER,
    to: params.to,
  });
}

export async function sendAppointmentReminder(params: {
  to: string;
  clientName: string;
  dateTime: string;
  stylistName: string;
}): Promise<void> {
  const client = getClient();
  await client.messages.create({
    body: `Hi ${params.clientName}! Reminder: your appointment with ${params.stylistName} is scheduled for ${params.dateTime}. See you soon! - Elara Pro`,
    from: FROM_NUMBER,
    to: params.to,
  });
}

export async function sendServiceComplete(params: {
  to: string;
  clientName: string;
  serviceSummary: string;
}): Promise<void> {
  const client = getClient();
  await client.messages.create({
    body: `Hi ${params.clientName}! Your color service is complete. ${params.serviceSummary}. Thank you for visiting! - Elara Pro`,
    from: FROM_NUMBER,
    to: params.to,
  });
}
