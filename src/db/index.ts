import {Database} from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/lokijs';

import {mySchema} from './schema';
import Intervention from './Intervention';

const adapter = new LokiJSAdapter({
  schema: mySchema,
  useWebWorker: false,
  useIncrementalIDB: true,
  autosave: true,
  autosaveInterval: 4000,
  autoload: true,
});

export const database = new Database({
  adapter,
  modelClasses: [Intervention],
});
