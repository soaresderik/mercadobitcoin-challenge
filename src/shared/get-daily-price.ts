import axios from 'axios';
import {
  subDays,
  unixDate,
  diffDays,
  jsDate,
  flatMap,
  splice,
} from './helpers';
import {
  IDailyPriceDTO,
  IDailyPriceReturn,
  ICandlesResponse,
  IDailyPrice,
  IRanges,
  errorCode,
  IPair,
} from './interfaces';
import HttpException from './errors/HttpException';

export async function getDailyPrice(
  params: IDailyPriceDTO,
): Promise<IDailyPriceReturn> {
  try {
    const to = params.to ? params.to : new Date();
    const from = subDays(to, params.diffDays);

    const { data } = await axios.get<ICandlesResponse>(
      `https://mobile.mercadobitcoin.com.br/v4/${
        params.pair
      }/candle?from=${unixDate(from)}&to=${unixDate(to)}&precision=1d`,
    );

    const orderByCandles = data.candles.sort(
      (a, b) => a.timestamp - b.timestamp,
    );

    const toInsert: IDailyPrice[] = [];
    const missingDates: { to: number; from: number; pair: IPair }[] = [];
    orderByCandles.forEach((item, idx) => {
      ([20, 50, 200] as IRanges[]).forEach(range => {
        // Captura o intervalo entre os dias do index e o range maximo
        const spliced = splice(idx, range, orderByCandles);

        // passando a referencia para simplicar variável
        const candle = orderByCandles[idx + range - 1];

        // So calcular valores dentro do range
        if (spliced.length === range) {
          const mms = spliced.reduce((a, c) => a + c.close, 0) / range;
          if (!candle.toInsert) candle.toInsert = [];
          candle.toInsert.push({
            mms,
            range,
            pair: params.pair,
            price: candle.close,
            timestamp: candle.timestamp,
          } as IDailyPrice);
        }
      });

      // Verifica se o intervalo entre o dia no index e o dia anterior não é maior que 1 dia
      if (
        idx &&
        diffDays(
          jsDate(item.timestamp),
          jsDate(orderByCandles[idx - 1].timestamp),
        ) > 1
      ) {
        missingDates.push({
          to: item.timestamp,
          from: orderByCandles[idx - 1].timestamp,
          pair: params.pair,
        });
      }

      toInsert.push(
        item.toInsert || [
          {
            mms: null,
            range: null,
            pair: params.pair,
            price: item.close,
            timestamp: item.timestamp,
          },
        ],
      );
    });

    return { missingDates, toInsert: flatMap((item: any) => item, toInsert) };
  } catch (err) {
    throw new HttpException('CALL_API_DAILY_PRICE' as errorCode, 500);
  }
}
