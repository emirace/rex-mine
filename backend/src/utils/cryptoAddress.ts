import axios from "axios";
import crypto from "crypto";
import qs from "qs";

export const generateCryptoAddress = async (): Promise<any> => {
  try {
    const key = process.env.COINPAYMENTS_API_KEY;
    const privateKey = process.env.COINPAYMENTS_PRIVATE_KEY;

    // Check for missing environment variables
    if (!key || !privateKey) {
      throw new Error(
        "Both COINPAYMENTS_API_KEY and COINPAYMENTS_PRIVATE_KEY are required"
      );
    }

    // Create body object
    const body = {
      cmd: "get_callback_address",
      currency: "ltc",
      ipn_url: `${process.env.BACKEND_URL}/crypto/callback`,
      key,
      version: 1,
      format: "json",
    };

    // Convert body object to string for HMAC
    const bodyString = Object.entries(body)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    // Create headers object
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      hmac: crypto
        .createHmac("sha512", privateKey)
        .update(bodyString)
        .digest("hex"),
    };

    // Send request to CoinPayments API using axios
    const response = await axios.post(
      "https://www.coinpayments.net/api.php",
      bodyString,
      {
        headers,
      }
    );
    console.log(response.data);
    // Check for errors in the API response
    if (response.data.error !== "ok") {
      throw new Error(`API Error: ${response.data.error}`);
    }

    return response.data.result;
  } catch (err) {
    // Log and rethrow the error for higher-level handling
    console.error("Error generating crypto address:", err);
    throw err;
  }
};

export const callbackCheckPostCoinpaymentsData = (headers: any, data: any) => {
  if (
    headers === undefined ||
    data === undefined ||
    headers === null ||
    data === null
  ) {
    throw new Error("Something went wrong. Please try again in a few seconds.");
  } else if (
    headers.hmac === undefined ||
    headers.hmac === undefined ||
    typeof headers.hmac !== "string"
  ) {
    throw new Error("Your provided hmac is invalid.");
  } else if (
    data.merchant === undefined ||
    data.merchant === null ||
    typeof data.merchant !== "string" ||
    (process.env.COINPAYMENTS_MERCHANT &&
      data.merchant.toString() !== process.env.COINPAYMENTS_MERCHANT.toString())
  ) {
    throw new Error("Your provided merchant is invalid.");
  }
};

export const callbackCoinpaymentsCreateHmac = (body: any) => {
  const bodyString = qs.stringify(body).replace(/%20/g, "+");
  const secret = process.env.COINPAYMENTS_SECRET!;
  return crypto.createHmac("sha512", secret).update(bodyString).digest("hex");
};

export const callbackCheckPostCoinpaymentsHmac = (hmac: any, headers: any) => {
  if (hmac.toString() !== headers.hmac.toString()) {
    throw new Error("Your provided hmac is invalid.");
  }
};

export const callbackCheckPostCoinpaymentsTransaction = (
  transactionId: any,
  callbackBlockTransactionCrypto: any
) => {
  if (
    callbackBlockTransactionCrypto.includes(transactionId.toString()) === true
  ) {
    throw new Error("Your provided transaction id is currently processed.");
  }
};
