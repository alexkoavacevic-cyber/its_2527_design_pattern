import { BetaPayments } from '../../vendor/beta-pay';
import type { PaymentGateway, PaymentRequest, PaymentResult } from './payment-gateway';

// Adatta l'SDK BetaPayments alla porta PaymentGateway: importi in stringhe
// decimali, token al posto della carta e outcome con nomi diversi.
export class BetaPaymentsAdapter implements PaymentGateway {
  constructor(private readonly client: BetaPayments) {}

  async charge(request: PaymentRequest): Promise<PaymentResult> {
    const payment = await this.client.createPayment({
      amount: this.toAmount(request.amountCents),
      currencyCode: request.currency,
      orderRef: request.reference,
      cardToken: request.card,
    });
    return {
      paymentId: payment.id,
      status: payment.outcome === 'APPROVED' ? 'succeeded' : 'declined',
    };
  }

  async refund(paymentId: string, amountCents: number): Promise<void> {
    await this.client.reverse(paymentId, { amount: this.toAmount(amountCents) });
  }

  private toAmount(amountCents: number): string {
    return (amountCents / 100).toFixed(2);
  }
}
