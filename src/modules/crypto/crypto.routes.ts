import { Router } from 'express';
import HttpException from '../../shared/errors/HttpException';
import validator from '../../middlewares/validator.middleware';
import { CryptoService } from '.';
import { subDays } from '../../shared/helpers';

const routes = Router();
const cryptoService = new CryptoService();

routes.get(
  '/:pair/mms',
  validator({
    from: 'required|date',
    range: 'required|in:20,50,200',
    to: 'date',
  }),
  async (req, res) => {
    if (!['BRLETH', 'BRLBTC'].includes(req.params.pair)) {
      throw new HttpException('Pair inválido.', 400);
    }

    const to = req.body.to ? req.body.to : subDays(new Date(), 1);
    res.json(
      await cryptoService.getMMSInARange({
        ...req.body,
        to,
        pair: req.params.pair,
      }),
    );
  },
);

export default routes;
