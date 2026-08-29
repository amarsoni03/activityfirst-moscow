import { DAYS, TIMES, type Activity } from '../lib/types';
import { useApp } from '../state';
import { MetroDot } from './bits';

export function WeekBoard({ activities }: { activities: Activity[] }) {
  const { go } = useApp();
  const sliced = activities.slice(0, 80);

  return (
    <>
      <div className="space-y-4 md:hidden">
        {DAYS.map((d) => {
          const dayActs = sliced.filter((a) => a.schedule.days.includes(d));
          if (!dayActs.length) return null;
          return (
            <section key={d} className="rounded-2xl border border-hair bg-paper p-4">
              <h3 className="font-display text-lg">{d}</h3>
              <div className="mt-3 space-y-3">
                {TIMES.map((t) => {
                  const cell = dayActs.filter((a) => a.schedule.timeOfDay.includes(t));
                  if (!cell.length) return null;
                  return (
                    <div key={t}>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-quiet">{t}</p>
                      <div className="mt-1.5 flex flex-col gap-1.5">
                        {cell.slice(0, 4).map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => go({ view: 'activity', id: a.id })}
                            className="rounded-lg bg-canvas px-3 py-2.5 text-left"
                          >
                            <span className="flex items-center gap-2">
                              {a.metroLineColor && <MetroDot color={a.metroLineColor} size={8} />}
                              <span className="line-clamp-2 text-sm font-medium">{a.title}</span>
                            </span>
                          </button>
                        ))}
                        {cell.length > 4 && (
                          <span className="px-1 text-[10px] text-quiet">+{cell.length - 4} more</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto rounded-[22px] border border-hair bg-paper md:block">
        <table className="min-w-[720px] w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-28 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-quiet">
                Window
              </th>
              {DAYS.map((d) => (
                <th key={d} className="px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-quiet">
                  {d.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMES.map((t) => (
              <tr key={t} className="border-t border-hair">
                <th className="px-3 py-3 text-left text-xs font-medium text-quiet">{t}</th>
                {DAYS.map((d) => {
                  const cell = sliced.filter(
                    (a) => a.schedule.days.includes(d) && a.schedule.timeOfDay.includes(t),
                  );
                  return (
                    <td key={d} className="align-top px-1.5 py-2">
                      <div className="flex flex-col gap-1.5">
                        {cell.slice(0, 3).map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => go({ view: 'activity', id: a.id })}
                            className="rounded-lg bg-canvas px-2 py-1.5 text-left hover:bg-warm"
                          >
                            <span className="flex items-center gap-1.5">
                              {a.metroLineColor && <MetroDot color={a.metroLineColor} size={6} />}
                              <span className="line-clamp-2 text-[11px] font-medium leading-snug">
                                {a.title}
                              </span>
                            </span>
                          </button>
                        ))}
                        {cell.length > 3 && (
                          <span className="px-1 text-[10px] text-quiet">+{cell.length - 3}</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
