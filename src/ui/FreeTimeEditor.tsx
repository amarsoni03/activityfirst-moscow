import { DAYS, TIMES, type FreeTimeSlot, type UserPreferences } from '../lib/types';
import { weekMatches } from '../lib/rank';
import { STATIONS } from '../lib/metro';
import { useApp } from '../state';

export function FreeTimeEditor({ prefs }: { prefs: UserPreferences }) {
  const { state, setPrefs } = useApp();
  const preview = weekMatches(state.activities, prefs).length;

  const toggle = (day: FreeTimeSlot['day'], time: FreeTimeSlot['timeOfDay']) => {
    setPrefs(
      {
        ...prefs,
        freeTimeSlots: prefs.freeTimeSlots.map((s) =>
          s.day === day && s.timeOfDay === time ? { ...s, enabled: !s.enabled } : s,
        ),
      },
      true,
    );
  };

  const on = (day: string, time: string) =>
    prefs.freeTimeSlots.some((s) => s.day === day && s.timeOfDay === time && s.enabled);

  return (
    <div>
      <div className="space-y-3 md:hidden">
        {DAYS.map((d) => (
          <div key={d} className="rounded-2xl bg-paper p-3">
            <p className="text-sm font-semibold">{d}</p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {TIMES.map((t) => {
                const active = on(d, t);
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle(d, t)}
                    className={`min-h-11 rounded-xl text-xs font-semibold ${
                      active ? 'bg-signal text-signal-ink' : 'bg-canvas text-quiet'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-[22px] border border-hair bg-paper md:block">
        <div className="grid grid-cols-8 border-b border-hair text-[11px] font-semibold uppercase tracking-wider text-quiet">
          <div className="px-3 py-3" />
          {DAYS.map((d) => (
            <div key={d} className="px-1 py-3 text-center">
              {d.slice(0, 2)}
            </div>
          ))}
        </div>
        {TIMES.map((t) => (
          <div key={t} className="grid grid-cols-8 border-b border-hair last:border-0">
            <div className="flex items-center px-3 py-3 text-xs text-quiet">{t}</div>
            {DAYS.map((d) => {
              const active = on(d, t);
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(d, t)}
                  className={`m-1 min-h-12 rounded-xl ${
                    active ? 'bg-signal' : 'bg-canvas hover:bg-warm'
                  }`}
                  aria-label={`${d} ${t}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <label className="mt-5 block text-sm font-medium">
        Home station
        <select
          className="mt-1 h-12 w-full rounded-2xl border border-hair bg-paper px-3"
          value={prefs.preferredMetroStationId ?? ''}
          onChange={(e) =>
            setPrefs(
              { ...prefs, preferredMetroStationId: e.target.value || undefined },
              true,
            )
          }
        >
          {STATIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · {s.district}
            </option>
          ))}
        </select>
      </label>

      <p className="mt-4 text-sm text-quiet">
        {preview.toLocaleString('en-GB')} activities fit this week and a reasonable ride.
      </p>
    </div>
  );
}
