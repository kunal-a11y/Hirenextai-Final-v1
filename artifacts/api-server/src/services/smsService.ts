import crypto from "crypto";

export function generateOtpCode(length = 6): string {
  const max = 10 ** length;
  return String(crypto.randomInt(0, max)).padStart(length, "0");
}

export async function sendOtpSms(phone: string, code: string): Promise<{ delivered: boolean; provider: string }> {
  const smsApiUrl = process.env.SMS_API_URL;
  const smsApiKey = process.env.SMS_API_KEY;
  const message = `Your HirenextAI verification code is ${code}. It expires in 10 minutes.`;

  if (smsApiUrl && smsApiKey) {
    const response = await fetch(smsApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${smsApiKey}` },
      body: JSON.stringify({ phone, message }),
    });
    if (!response.ok) throw new Error("SMS provider request failed");
    return { delivered: true, provider: "custom_sms_api" };
  }

  console.log(`[SmsService] OTP for ${phone}: ${code} (SMS_API_URL not configured)`);
  return { delivered: false, provider: "console" };
}
