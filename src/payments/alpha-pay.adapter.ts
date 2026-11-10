import { AlphaPayClient, AlphaTimeoutError } from '../../vendor/alpha-pay';
import type { PaymentGateway, PaymentRequest, PaymentResult } from './payment-gateway';
import { PaymentTimeoutError } from './payment-gateway';

// Adatta l'SDK AlphaPay alla porta PaymentGateway.
export class AlphaPayAdapter implements PaymentGateway {
  constructor(private readonly client: AlphaPayClient) {}

  async charge(request: PaymentRequest): Promise<PaymentResult> {
    try {
      const charge = await this.client.charge({
        amountCents: request.amountCents,
        currency: request.currency,
        reference: request.reference,
        card: request.card,
      });
      return { paymentId: charge.chargeId, status: charge.status };
    } catch (err) {
      if (err instanceof AlphaTimeoutError) throw new PaymentTimeoutError();
      throw err;
    }
  }

  async refund(paymentId: string, amountCents: number): Promise<void> {
    try {
      await this.client.refund(paymentId, amountCents);
    } catch (err) {
      if (err instanceof AlphaTimeoutError) throw new PaymentTimeoutError();
      throw err;
    }
  }
}
