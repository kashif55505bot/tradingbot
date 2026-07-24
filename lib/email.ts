// Simple email alert system (Nodemailer setup)
export async function sendAlert(coin: string, verdict: string, confidence: number) {
  // Email logic
  console.log(`📧 Alert: ${coin} - ${verdict} (${confidence}%)`);
  
  // For production, use Nodemailer or Resend
  // const email = {
  //   to: 'user@email.com',
  //   subject: `CashiPro AI Alert: ${coin}`,
  //   body: `${coin} - ${verdict} - ${confidence}%`
  // };
}
