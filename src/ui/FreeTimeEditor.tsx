import { useState } from 'react';
import { DAYS, TIMES, type FreeTimeSlot, type UserPreferences } from '../lib/types';
import { weekMatches } from '../lib/rank';
import { STATIONS } from '../lib/metro';
import { useApp } from '../state';

const PRESETS = [
  { id: 'weeknights', label: 'After work' },
  { id: 'weekends', label: 'Weekends' },
  { id: 'both', label: 'Both' },
] as const;

type PresetId = (typeof PRESETS)[number]['id'] | 'custom';

function weekend(day: string) {
  return day === 'Saturday' || day === 'Sunday';
}

function shouldEnable(id: Exclude<PresetId, 'custom'>, slot: FreeTimeSlot): boolean {
  if (id === 'weeknights') return !weekend(slot.day) && slot.timeOfDay === 'Evening';
  if (id === 'weekends') return weekend(slot.day) && slot.timeOfDay !== 'Evening';
  return (
    (!weekend(slot.day) && slot.timeOfDay === 'Evening') ||
    (weekend(slot.day) && slot.timeOfDay !== 'Evening')
  );
}

function activePreset(slots: FreeTimeSlot[]): PresetId {
  for (const id of ['weeknights', 'weekends', 'both'] as const) {
    if (slots.every((s) => s.enabled === shouldEnable(id, s))) return id;
  }
  return 'custom';
}

export function FreeTimeEditor({ prefs }: { prefs: UserPreferences }) {
  const { state, setPrefs } = useApp();
  const preview = weekMatches(state.activities, prefs).length;
  const preset = activePreset(prefs.freeTimeSlots);
  const [grid, setGrid] = useState(preset === 'custom');

  const apply = (id: Exclude<PresetId, 'custom'>) => {
    setPrefs(
      {
        ...prefs,
        freeTimeSlots: prefs.freeTimeSlots.map((s) => ({ ...s, enabled: shouldEnable(id, s) })),
      },
      true,
    );
    setGrid(false);
  };

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
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={preset === p.id}
            onClick={() => apply(p.id)}
            className={`h-10 rounded-full px-3.5 text-sm ${
              preset === p.id ? 'bg-ink text-paper' : 'bg-paper text-quiet ring-1 ring-hair'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {!grid ? (
        <button
          type="button"
          onClick={() => setGrid(true)}
          className="mt-3 text-sm text-quiet underline decoration-hair underline-offset-4 hover:text-ink"
        >
          Fine-tune the grid
        </button>
      ) : null}

      {grid ? (
        <>
          <div className="mt-4 space-y-3 md:hidden">
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

          <div className="mt-4 hidden overflow-hidden rounded-[22px] border border-hair bg-paper md:block">
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
        </>
      ) : null}

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
        {preview.toLocaleString('en-GB')} activities fit a ride from here.
      </p>
    </div>
  );
}
