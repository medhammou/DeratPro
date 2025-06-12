import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'interventions',
      columns: [
        {name: 'station_id', type: 'string'},
        {name: 'consumption', type: 'number'},
        {name: 'notes', type: 'string', isOptional: true},
        {name: 'trace_droppings', type: 'boolean'},
        {name: 'trace_tracks', type: 'boolean'},
        {name: 'trace_damage', type: 'boolean'},
        {name: 'trace_nest', type: 'boolean'},
        {name: 'trace_smell', type: 'boolean'},
        {name: 'created_at', type: 'number'},
      ],
    }),
  ],
});
