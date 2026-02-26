import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Elara Pro <notifications@elara.pro>';

export async function sendWelcomeEmail(params: {
  to: string;
  name: string;
  salonName: string;
}): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: `Welcome to Elara Pro, ${params.name}!`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #f5f0e8; padding: 40px;">
        <h1 style="font-family: 'Playfair Display', serif; color: #c4956a;">Welcome to Elara Pro</h1>
        <p>Hi ${params.name},</p>
        <p>Your salon <strong>${params.salonName}</strong> is now set up on Elara Pro.</p>
        <p>Start by adding your first client and creating a consultation.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #c4956a; color: #1a1a2e; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Go to Dashboard</a>
      </div>
    `,
  });
}

export async function sendPatchTestReminder(params: {
  to: string;
  clientName: string;
  testDate: string;
  checkTime: string;
}): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: `Patch Test Reminder: ${params.clientName}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #f5f0e8; padding: 40px;">
        <h2 style="color: #c4956a;">Patch Test Check Required</h2>
        <p>Client <strong>${params.clientName}</strong> had a patch test applied on ${params.testDate}.</p>
        <p>Please check the test results at <strong>${params.checkTime}</strong>.</p>
        <p>Record the results in Elara Pro before proceeding with the color service.</p>
      </div>
    `,
  });
}

export async function sendLowInventoryAlert(params: {
  to: string;
  productName: string;
  currentStock: string;
  reorderPoint: string;
}): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: `Low Inventory Alert: ${params.productName}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #f5f0e8; padding: 40px;">
        <h2 style="color: #e8a948;">⚠️ Low Inventory</h2>
        <p><strong>${params.productName}</strong> is running low.</p>
        <p>Current stock: ${params.currentStock}g</p>
        <p>Reorder point: ${params.reorderPoint}g</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/inventory" style="display: inline-block; background: #c4956a; color: #1a1a2e; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">View Inventory</a>
      </div>
    `,
  });
}
