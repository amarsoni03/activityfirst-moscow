import { Footprints, Star, Zap } from 'lucide-react';
import { isWeekend, isWeekdays, todayName } from '../../lib/format';
import { HUBS, STATIONS } from '../../lib/metro';
import { useApp } from '../../state';
import { TIMES } from '../../lib/types';
import { MetroDot } from '../bits';
import { Chip, isOnlineOnly, toggle } from './shared';

export function QuickFilters() {
  const { state, setFilter, setTab } = useApp();
  const f = state.filters;
  const tonightOn =
    f.days.length === 1 && f.days[0] === todayName() && f.timeOfDay.includes('Evening');
  const weekdaysOn = isWeekdays(f.days);
  const weekendOn = isWeekend(f.days);
  const selected = STATIONS.find((s) => s.id === f.metroStationIds[0]);
  const onlineOnly = isOnlineOnly(f);

  return (
    <div className="-mx-4 mt-4 flex items-center gap-2 overflow-x-auto px-4 no-scrollbar md:mx-0 md:px-0 lg:hidden">
      {!onlineOnly &&
        HUBS.map((id) => {
          const s = STATIONS.find((x) => x.id === id);
          if (!s) return null;
          const on = f.metroStationIds[0] === s.id;
          return (
            <Chip
              key={s.id}
              on={on}
              onClick={() => {
                if (on) {
                  setFilter('metroStationIds', []);
                  setFilter('metroLineId', undefined);
                } else {
                  setFilter('metroLineId', s.lineId);
                  setFilter('metroStationIds', [s.id]);
                }
              }}
            >
              <MetroDot color={s.lineColor} size={7} />
              {s.name}
            </Chip>
          );
        })}
      {selected &&
        !onlineOnly &&
        !HUBS.includes(selected.id as (typeof HUBS)[number]) && (
          <Chip
            on
            onClick={() => {
              setFilter('metroStationIds', []);
              setFilter('metroLineId', undefined);
            }}
          >
            <MetroDot color={selected.lineColor} size={7} />
            {selected.name}
          </Chip>
        )}
      <Chip
        on={tonightOn}
        onClick={() => {
          if (tonightOn) {
            setFilter('days', []);
            setFilter('timeOfDay', []);
            setTab('all');
          } else {
            setTab('tonight');
          }
        }}
      >
        Tonight
      </Chip>
      <Chip
        on={weekdaysOn}
        onClick={() => {
          if (weekdaysOn) {
            setFilter('days', []);
            setTab('all');
          } else {
            setTab('weekdays');
          }
        }}
      >
        Weekdays
      </Chip>
      <Chip
        on={weekendOn}
        onClick={() => {
          if (weekendOn) {
            setFilter('days', []);
            setTab('all');
          } else {
            setTab('weekend');
          }
        }}
      >
        Weekend
      </Chip>
      {TIMES.map((t) => (
        <Chip
          key={t}
          on={f.timeOfDay.includes(t)}
          onClick={() => setFilter('timeOfDay', toggle(f.timeOfDay, t))}
        >
          {t}
        </Chip>
      ))}
      <Chip
        on={f.minRating === 4.5}
        onClick={() => setFilter('minRating', f.minRating === 4.5 ? undefined : 4.5)}
      >
        <Star className="h-3 w-3 fill-current" />
        4.5+
      </Chip>
      <Chip
        on={Boolean(f.instantOnly)}
        onClick={() => setFilter('instantOnly', f.instantOnly ? undefined : true)}
      >
        <Zap className="h-3 w-3" />
        Book now
      </Chip>
      <Chip
        on={f.maxWalk === 5}
        onClick={() => setFilter('maxWalk', f.maxWalk === 5 ? undefined : 5)}
      >
        <Footprints className="h-3 w-3" />
        5 min walk
      </Chip>
    </div>
  );
}
