/**
 * ZarinPal Payment Gateway — API v4
 * Server-side only module
 */

const PRODUCTION_BASE = "https://payment.zarinpal.com";
const SANDBOX_BASE = "https://sandbox.zarinpal.com";
const PRODUCTION_GATEWAY = "https://www.zarinpal.com";
const SANDBOX_GATEWAY = "https://sandbox.zarinpal.com";

/** Default sandbox merchant ID (any 36-char string works in sandbox) */
const DEFAULT_SANDBOX_MERCHANT =
  "00000000-0000-0000-0000-000000000000";

function isSandbox(): boolean {
  return process.env.ZARINPAL_SANDBOX !== "false";
}

function getMerchantId(): string {
  return (
    process.env.ZARINPAL_MERCHANT_ID || DEFAULT_SANDBOX_MERCHANT
  );
}

function getBaseUrl(): string {
  return isSandbox() ? SANDBOX_BASE : PRODUCTION_BASE;
}

function getGatewayUrl(): string {
  return isSandbox() ? SANDBOX_GATEWAY : PRODUCTION_GATEWAY;
}

// ─── Types ────────────────────────────────────────────────

export interface PaymentRequestResult {
  authority: string;
  paymentUrl: string;
}

export interface PaymentVerifyResult {
  refId: number;
  cardPan?: string;
  cardHash?: string;
  feeType?: string;
  fee?: number;
}

export interface ZarinPalError {
  code: number;
  message: string;
}

// ─── Error codes ──────────────────────────────────────────

// ─── Error codes ──────────────────────────────────────────

const ERROR_MESSAGES: Record<number, string> = {
  [-1]: "اطلاعات ارسالی ناقص است",
  [-2]: "IP و یا مرچنت کد صحیح نیست",
  [-3]: "مبلغ باید بالای ۱۰۰ تومان باشد",
  [-4]: "سطح تأیید پذیرنده کمتر از نقره‌ای است",
  [-9]: "خطای اعتبار سنجی اطلاعات درخواست",
  [-10]: "IP یا مرچنت کد درگاه صحیح نیست",
  [-11]: "درخواست مورد نظر یافت نشد",
  [-12]: "امکان ویرایش درخواست میسر نمی‌باشد",
  [-14]: "دامنه آدرس بازگشت (Callback) با دامنه ثبت‌شده در پنل زرین‌پال مطابقت ندارد",
  [-15]: "تراکنش نیازمند شناسه معتبر می‌باشد",
  [-16]: "سطح تایید پذیرنده پایین‌تر از سطح نقره‌ای است",
  [-21]: "هیچ نوع عملیات مالی برای این تراکنش یافت نشد",
  [-22]: "تراکنش ناموفق است",
  [-33]: "مبلغ تراکنش با مبلغ پرداخت شده مطابقت ندارد",
  [-34]: "حد تقسیم تراکنش از مبلغ کل کمتر است",
  [-40]: "اجازه دسترسی به متد مربوطه وجود ندارد",
  [-41]: "اطلاعات اضافی درخواست نامعتبر است",
  [-42]: "عمر شناسه پرداخت باید بین ۳۰ دقیقه تا ۴۵ روز باشد",
  [-54]: "درخواست مورد نظر آرشیو شده است",
  [100]: "عملیات موفق",
  [101]: "تراکنش قبلاً تأیید شده است",
};

function getErrorMessage(code: number, serverMessage?: string): string {
  if (serverMessage && serverMessage.trim() !== "") {
    const known = ERROR_MESSAGES[code];
    return known ? `${known} (${serverMessage})` : serverMessage;
  }
  return ERROR_MESSAGES[code] || `خطای درگاه پرداخت (کد ${code})`;
}

// ─── Payment Request ──────────────────────────────────────

export async function requestPayment(
  amount: number,
  description: string,
  callbackUrl: string,
  metadata?: { email?: string; mobile?: string }
): Promise<PaymentRequestResult> {
  const url = `${getBaseUrl()}/pg/v4/payment/request.json`;

  const body: Record<string, unknown> = {
    merchant_id: getMerchantId(),
    amount: Math.round(amount),
    currency: "IRT", // Toman
    callback_url: callbackUrl,
    description,
  };

  if (metadata) {
    body.metadata = metadata;
  }

  let json: any;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });
    json = await res.json();
  } catch (err) {
    console.error("ZarinPal request payment fetch error:", err);
    throw new Error("امکان برقراری ارتباط با درگاه پرداخت زرین‌پال وجود ندارد");
  }

  if (!json.data || json.data.code !== 100) {
    const code = json.errors?.code ?? json.data?.code ?? -1;
    const serverMsg = json.errors?.message;
    const errorText = getErrorMessage(code, serverMsg);
    console.error(`ZarinPal Request Payment Failed [Code ${code}]:`, errorText);
    throw new Error(errorText);
  }

  const authority: string = json.data.authority;

  return {
    authority,
    paymentUrl: `${getGatewayUrl()}/pg/StartPay/${authority}`,
  };
}

// ─── Payment Verify ───────────────────────────────────────

export async function verifyPayment(
  authority: string,
  amount: number
): Promise<PaymentVerifyResult> {
  const url = `${getBaseUrl()}/pg/v4/payment/verify.json`;

  let json: any;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        merchant_id: getMerchantId(),
        amount: Math.round(amount),
        authority,
      }),
    });
    json = await res.json();
  } catch (err) {
    console.error("ZarinPal verify payment fetch error:", err);
    throw new Error("امکان تایید پرداخت با زرین‌پال وجود ندارد");
  }

  if (!json.data || (json.data.code !== 100 && json.data.code !== 101)) {
    const code = json.errors?.code ?? json.data?.code ?? -22;
    const serverMsg = json.errors?.message;
    const errorText = getErrorMessage(code, serverMsg);
    console.error(`ZarinPal Verify Payment Failed [Code ${code}]:`, errorText);
    throw new Error(errorText);
  }

  return {
    refId: json.data.ref_id,
    cardPan: json.data.card_pan,
    cardHash: json.data.card_hash,
    feeType: json.data.fee_type,
    fee: json.data.fee,
  };
}
