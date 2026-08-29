import { DAYS, TIMES } from '../lib/types';
import { weekMatches } from '../lib/rank';
import { STATIONS } from '../lib/metro';
import { useApp } from '../state';
import { MetroDot } from '../ui/bits';
import { money } from '../lib/format';
import { sessionPrice } from '../lib/pricing';
import { FreeTimeEditor } from '../ui/FreeTimeEditor';

export function MyWeek() {
  const { state, go } = useApp();
  const matches = weekMatches(state.activities, state.preferences).slice(0, 60);
  const home = STATIONS.find((s) => s.id === state.preferences.preferredMetroStationId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-quiet">
        My Week
      </p>
      <h1 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">
        What fits the hours you marked.
      </h1>
      <p className="mt-3 max-w-xl text-sm text-quiet">
        {matches.length} activities overlap your free time
        {home ? ` and sit a short ride from ${home.name}.` : '.'}
      </p>

      <div className="mt-8 max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-quiet">
          Your windows
        </p>
        <p className="mt-1 mb-4 text-sm text-quiet">
          Tap a cell to change it. Explore’s “Fits my time” tab reads this grid.
        </p>
        <FreeTimeEditor prefs={state.preferences} />
      </div>

      <div className="mt-10 space-y-8">
        {DAYS.map((d) => {
          const dayActs = matches.filter((a) => a.schedule.days.includes(d));
          if (!dayActs.length) return null;
          return (
            <section key={d}>
              <h2 className="font-display text-2xl">{d}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {TIMES.map((t) => {
                  const cell = dayActs.filter((a) => a.schedule.timeOfDay.includes(t));
                  if (!cell.length) return null;
                  return (
                    <div key={t} className="rounded-2xl border border-hair bg-paper p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-quiet">
                        {t}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {cell.slice(0, 4).map((a) => {
                          const session = sessionPrice(a);
                          return (
                            <li key={a.id}>
                              <button
                                type="button"
                                onClick={() => go({ view: 'activity', id: a.id })}
                                className="w-full text-left"
                              >
                                <span className="flex items-center gap-2 text-sm font-medium">
                                  {a.metroLineColor && <MetroDot color={a.metroLineColor} />}
                                  <span className="line-clamp-2">{a.title}</span>
                                </span>
                                <span className="mt-0.5 block text-xs text-quiet">
                                  {a.schedule.timeRange} ·{' '}
                                  {session === null ? money(a.price) : `${money(session)} / session`}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
        {matches.length === 0 && (
          <p className="rounded-2xl border border-hair bg-paper px-5 py-10 text-center text-sm text-quiet">
            Nothing matches this week yet. Widen the grid or pick another home station.
          </p>
        )}
      </div>
    </div>
  );
}
