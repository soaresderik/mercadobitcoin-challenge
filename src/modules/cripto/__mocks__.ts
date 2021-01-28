import { unixDate } from '@shared/helpers';
import { subDays } from 'date-fns';

export const mmsReponseDraft = (wrap?: {
  timestamp?: string;
  mms?: number;
}) => {
  return [
    { timestamp: wrap?.timestamp || '1610928000', mms: wrap?.mms || 189752.52 },
    { timestamp: '1611014400', mms: 191931.83 },
    { timestamp: '1611100800', mms: 193771.22 },
    { timestamp: '1611187200', mms: 194531.19 },
    { timestamp: '1611273600', mms: 195136.19 },
    { timestamp: '1611360000', mms: 195186.25 },
  ];
};

export const apiResponseDraft = () => {
  return {
    status_code: 100,
    status_message: 'Success',
    server_unix_timestamp: 1611849660,
    candles: [...Array(100).keys()].map(i => ({
      timestamp: unixDate(subDays(new Date(), i + 1)),
      open: 529.9598,
      close: 526.16056,
      high: 534.99999,
      low: 525,
      volume: 68.01555633,
    })),
  };
};
