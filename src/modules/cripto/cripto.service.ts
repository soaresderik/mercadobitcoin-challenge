import HttpException from '../../shared/errors/HttpException';
import { SystemNotificationRepository } from '../system-notification';
import { IDailyPriceDTO, errorCode } from '../../shared/interfaces';
import { MercadoBitcoinIntegration } from '../integrations/index';
import { subDays, unixDate, diffDays } from '../../shared/helpers';
import { CriptoRepository, IGetMMSDTO } from '.';

export default class CriptoService {
  constructor(
    private criptoRepository = new CriptoRepository(),
    private systemNotificationRepository = new SystemNotificationRepository(),
    private mercadobitcoinIntegration = new MercadoBitcoinIntegration(),
  ) {}

  public async getMMSInARange(params: IGetMMSDTO) {
    const from = diffDays(params.to, params.from);

    if (from > 365) {
      throw new HttpException(
        'As datas não podem ter mais do que 365 dias de diferença.',
        400,
      );
    }

    const mms = await this.criptoRepository.getMMSInARange(params);

    return mms;
  }

  public async populateDailyPrice(params: IDailyPriceDTO) {
    try {
      const {
        toInsert,
        missingDates,
      } = await this.mercadobitcoinIntegration.getDailyPrice(params);

      // Verifica se o intervalo encontrado ja foi inserido, se sim vai filtrar apenas por novos.
      const alreadySaved = await this.criptoRepository.findCriptoByTimestamp(
        toInsert.map(item => item.timestamp as number),
        params.pair,
      );

      let store = toInsert;
      if (alreadySaved.length) {
        store = toInsert.filter(
          a => !alreadySaved.find(b => +b.timestamp === +a.timestamp),
        );
      }

      if (store.length) {
        await this.criptoRepository.store(store);
      }

      if (missingDates.length) {
        await this.systemNotificationRepository.store({
          message: `Parece que a busca de intervalos diários na api de criptomoedas está inconsistente [${params.pair}]`,
          code: errorCode.INCONSISTENT_INTERVAL,
          metadata: JSON.stringify(missingDates),
        });
      }

      return { store, missingDates };
    } catch (err) {
      if (err.message === errorCode.CALL_API_DAILY_PRICE) {
        const to = params.to || new Date();
        await this.systemNotificationRepository.store({
          message: `Ocorreu um erro ao tentar obter valores diários das criptomoedas [${params.pair}]`,
          code: err.message,
          metadata: JSON.stringify([
            {
              pair: params.pair,
              to: unixDate(to),
              from: unixDate(subDays(to, params.diffDays)),
            },
          ]),
        });
      }

      throw err;
    }
  }
}
