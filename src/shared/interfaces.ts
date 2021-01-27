export type IRanges = 20 | 50 | 200;
export type IPair = 'BRLBTC' | 'BRLETH';

export enum errorCode {
  CALL_API_DAILY_PRICE = 'CALL_API_DAILY_PRICE',
  INCONSISTENT_INTERVAL = 'INCONSISTENT_INTERVAL',
  GENERIC_ERROR = 'GENERIC_ERROR',
}

export interface IMetadaDailyPrice {
  to: number;
  from: number;
  pair: IPair;
}

export interface IDailyPriceDTO {
  to?: Date;
  diffDays: number;
  pair: IPair;
}

export interface IDailyPriceReturn {
  missingDates: { pair: IPair; to: number; from: number }[];
  toInsert: IDailyPrice[];
}

export interface IDailyPrice {
  id?: string;
  pair: IPair;
  price: number;
  mms: number;
  range: IRanges;
  timestamp: Date | number;
}

export interface ICandle {
  timestamp: number;
  open?: number;
  close: number;
  high?: number;
  low?: number;
  toInsert?: any;
}

export interface ICandlesResponse {
  status_code: number;
  status_message: string | 'Success';
  server_unix_timestamp: number;
  candles: ICandle[];
}
