// Porta dei pagamenti: il resto dell'applicazione usa questi tipi e non
// conosce gli SDK dei singoli fornitori.
export interface PaymentRequest {
  amountCents: number;
  currency: 'EUR';
  reference: string;
  card: string;
}

export interface PaymentResult {
  paymentId: string;
  status: 'succeeded' | 'declined';
}

export class PaymentTimeoutError extends Error {
  constructor() {
    super('pagamento: timeout');
    this.name = 'PaymentTimeoutError';
  }
}

export interface PaymentGateway {
  charge(request: PaymentRequest): Promise<PaymentResult>;
  refund(paymentId: string, amountCents: number): Promise<void>;
}
