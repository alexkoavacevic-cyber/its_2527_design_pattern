import { Module } from '@nestjs/common';
import { AlphaPayClient } from '../../vendor/alpha-pay';
import { BetaPayments } from '../../vendor/beta-pay';
import { AlphaPayAdapter } from './alpha-pay.adapter';
import { AlphaWebhookController } from './alpha-webhook.controller';
import { BetaPaymentsAdapter } from './beta-pay.adapter';
import type { PaymentGateway } from './payment-gateway';

export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

@Module({
  controllers: [AlphaWebhookController],
  providers: [
    {
      provide: PAYMENT_GATEWAY,
      useFactory: (): PaymentGateway => {
        if ((process.env.PAYMENT_PROVIDER ?? 'alpha') === 'beta') {
          return new BetaPaymentsAdapter(new BetaPayments(process.env.BETA_MERCHANT_ID ?? 'tickethub'));
        }
        return new AlphaPayAdapter(new AlphaPayClient(process.env.ALPHA_API_KEY ?? 'sk_test_tickethub'));
      },
    },
  ],
  exports: [PAYMENT_GATEWAY],
})
export class PaymentsModule {}
