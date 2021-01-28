import { knex } from '../../config/index';
import { IDailyPrice, IPair } from '../../shared/interfaces';
import Repository from '../repository-base';
import { IGetMMSDTO } from './cripto.interfaces';
import { unixDate } from '../../shared/helpers';

export default class CriptoRepository extends Repository<IDailyPrice> {
  constructor(protected db = knex) {
    super('daily_price', db);
  }

  public async findCriptoByTimestamp(timestamps: number[], pair: IPair) {
    const result = await this.db<IDailyPrice>('daily_price')
      .whereIn('timestamp', timestamps)
      .where('pair', pair);

    return result;
  }

  public async getMMSInARange(params: IGetMMSDTO) {
    const result = await this.db<IDailyPrice>('daily_price')
      .select('timestamp', 'mms')
      .where({
        range: params.range,
        pair: params.pair,
      })
      .andWhereBetween('timestamp', [
        unixDate(params.from),
        unixDate(params.to),
      ]);

    return result;
  }
}
