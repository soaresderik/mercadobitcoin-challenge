/* eslint-disable no-console */
import { IPair } from './shared/interfaces';
import { CriptoService } from './modules/cripto';

const criptoService = new CriptoService();

(async () => {
  try {
    await Promise.all(
      (['BRLETH', 'BRLBTC'] as IPair[]).map(async pair => {
        await criptoService.populateDailyPrice({
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
