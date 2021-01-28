import { Router } from 'express';

import { criptoRoutes } from '@modules/cripto';

const routes = Router();

routes.use('/', criptoRoutes);

export default routes;
