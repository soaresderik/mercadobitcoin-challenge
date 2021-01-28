import axios from 'axios';
import { CriptoService, CriptoRepository } from '.';
import { mmsReponseDraft, apiResponseDraft } from './__mocks__';
import { subDays, splice } from '../../shared/helpers';
import { MercadoBitcoinIntegration } from '../integrations';

jest.mock('axios');

describe('Crypto Module', () => {
  it('should be list cripto search', async () => {
    CriptoRepository.prototype.getMMSInARange = jest
      .fn()
      .mockImplementationOnce(() => mmsReponseDraft());

    const criptoService = new CriptoService();

    const result = await criptoService.getMMSInARange({
      from: subDays(new Date(), 10),
      pair: 'BRLBTC',
      range: 20,
      to: new Date(),
    });

    expect(result.length).toBeGreaterThan(0);
  });

  it('should be throw a validation error []', async () => {
    try {
      const criptoService = new CriptoService();

      const result = await criptoService.getMMSInARange({
        from: subDays(new Date(), 400),
        pair: 'BRLBTC',
        range: 20,
        to: new Date(),
      });

      expect(result.length).toThrowError();
    } catch (err) {
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe(
        'As datas não podem ter mais do que 365 dias de diferença.',
      );
    }
  });

  it('should be simulate api call', async () => {
    const mockAxios = axios as jest.Mocked<typeof axios>;

    mockAxios.get = (axios.get as jest.Mock).mockReturnValue({
      data: apiResponseDraft(),
    });

    const mercadobitcoinImplementation = new MercadoBitcoinIntegration(
      mockAxios,
    );

    const result = await mercadobitcoinImplementation.getDailyPrice({
      diffDays: 100,
      pair: 'BRLBTC',
    });

    expect(
      splice(0, 20, result.toInsert).reduce((a, b) => a + b.price, 0) / 20,
    ).toBe(result.toInsert[19].mms);
    expect(
      splice(0, 50, result.toInsert).reduce((a, b) => a + b.price, 0) / 50,
    ).toBe(result.toInsert[49].mms);
  });
});
