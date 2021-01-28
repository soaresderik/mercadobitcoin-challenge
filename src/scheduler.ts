/* eslint-disable no-console */
import cron from 'node-cron';
import { knex } from './config';
import { errorCode, IMetadaDailyPrice, IPair } from './shared/interfaces';
import { jsDate, diffDays } from './shared/helpers';
import { CriptoService, CriptoRepository } from './modules/cripto';

/** Este fluxo contempla tanto falhas dos dias que estão faltando na tabela
 *  quanto a falhas nas chamadas a api de criptomoedas */
cron.schedule('* */12 * * *', async () => {
  console.log('Init CRON: retry populate daily price table');
  const trx = await knex.transaction();
  const criptoService = new CriptoService(new CriptoRepository(trx));

  try {
    const result = await trx<{ id: string; metadata: IMetadaDailyPrice[] }>(
      'system_notifications',
    )
      .select('*')
      .whereIn('code', [
        errorCode.INCONSISTENT_INTERVAL,
        errorCode.CALL_API_DAILY_PRICE,
      ])
      .where('fixed', false)
      .first();

    if (result && result.metadata.length) {
      await Promise.all(
        result.metadata.map(async item => {
          await criptoService.populateDailyPrice({
            to: jsDate(item.to),
            diffDays: diffDays(jsDate(item.to), jsDate(item.from)),
            pair: item.pair,
          });
        }),
      );

      await trx('system_notifications')
        .update({
          fixed: true,
        })
        .where('id', result.id);
    }

    await trx.commit();
  } catch (err) {
    console.error(`[Cron Error] ${err.message} - ${err.statusCode}`);
    await trx.rollback();
  }
});

cron.schedule('* */24 * * *', async () => {
  console.log('Init CRON: populate daily price table regularly');
  const trx = await knex.transaction();

  const criptoService = new CriptoService(new CriptoRepository(trx));

  try {
    await Promise.all(
      (['BRLBTC', 'BRLETH'] as IPair[]).map(async pair => {
        const result = await trx<{ timestamp: number }>('daily_price')
          .select('timestamp')
          .where('pair', pair)
          .groupBy('timestamp')
          .orderBy('timestamp', 'desc')
          .first();

        if (!result) return;

        const diff = diffDays(new Date(), jsDate(result.timestamp));
        if (diff > 1) {
          await criptoService.populateDailyPrice({
            diffDays: diff,
            pair,
          });
        }
      }),
    );

    await trx.commit();
  } catch (err) {
    console.error(`[Cron Error] ${err.message} - ${err.statusCode}`);
    await trx.rollback();
  }
});
