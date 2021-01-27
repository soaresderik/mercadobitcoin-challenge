/* eslint-disable no-console */
import { IPair } from './shared/interfaces';
import { CryptoService } from './modules/crypto';

const cryptoService = new CryptoService();

(async () => {
  try {
    await Promise.all(
      (['BRLETH', 'BRLBTC'] as IPair[]).map(async pair => {
        await cryptoService.populateDailyPrice({
          diffDays: 365,
          pair,
        });
      }),
    );

    console.log('Completed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
})();
