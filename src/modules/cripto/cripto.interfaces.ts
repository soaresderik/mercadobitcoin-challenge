import { IPair, IRanges } from '../../shared/interfaces';

export interface IGetMMSDTO {
  pair: IPair;
  to: Date;
  from: Date;
  range: IRanges;
}
