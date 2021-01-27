import Repository from '../repository-base';
import { knex } from '../../config/index';
import { ISystemNotification } from './system-notification.interfaces';

export default class SystemNotificationRepository extends Repository<ISystemNotification> {
  constructor(protected db = knex) {
    super('system_notifications', db);
  }
}
