import { Router } from 'express';

import { cryptoRoutes } from '@modules/crypto';

const routes = Router();

routes.use('/', cryptoRoutes);

export default routes;
