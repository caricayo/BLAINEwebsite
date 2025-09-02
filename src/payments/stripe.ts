export type CreateCheckoutInput = {
  name: string
  email: string
  amount: number // in smallest currency unit (e.g., USD cents)
}

export async function createDepositCheckoutSession(
  input: CreateCheckoutInput
): Promise<{ url: string }> {
  // Stub implementation. Later, call your API route to create a real Stripe Checkout Session
  // and return its URL. Keep this signature stable so the UI doesn’t change.
  void input
  return { url: "/booking/confirmed" }
}
