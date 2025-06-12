import {Model} from '@nozbe/watermelondb';
import {field, date} from '@nozbe/watermelondb/decorators';
import {useDatabase} from '@nozbe/watermelondb/hooks';
export default class Intervention extends Model {
  static table = 'interventions';

  @field('station_id') stationId;
  @field('consumption') consumption;
  @field('notes') notes;
  @field('trace_droppings') traceDroppings;
  @field('trace_tracks') traceTracks;
  @field('trace_damage') traceDamage;
  @field('trace_nest') traceNest;
  @field('trace_smell') traceSmell;
  @date('created_at') createdAt;
}
