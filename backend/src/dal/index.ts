import { db, DB } from '@config/db';

export abstract class BaseDAL {
  protected db: DB

  constructor() {
    this.db = db
  }
}