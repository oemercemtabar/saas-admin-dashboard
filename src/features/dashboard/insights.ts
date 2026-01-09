export type TimeseriesItem = {
  day: string;
  sessions: number;
  activeUsers: number;
  crashes: number;
  conversionRate: number; 
};

export type Insights = {
  sessionsCur: number;
  sessionsDeltaPct: number;
  usersCurAvg: number;
  usersDeltaPct: number;
  convCurAvg: number;     
  convDeltaPP: number;    
  crashesCur: number;
  crashesDeltaPct: number;
  hasEnoughData: boolean;
};

function pctChange(current: number, prev: number) {
  if (prev === 0) return current === 0 ? 0 : 100;
  return ((current - prev) / prev) * 100;
}

const sum = (arr: TimeseriesItem[], pick: (x: TimeseriesItem) => number) =>
  arr.reduce((acc, x) => acc + (Number(pick(x)) || 0), 0);

const avg = (arr: TimeseriesItem[], pick: (x: TimeseriesItem) => number) =>
  arr.length ? sum(arr, pick) / arr.length : 0;

export function computeInsights(items: TimeseriesItem[]): Insights {
  const half = Math.floor(items.length / 2);
  const prev = items.slice(0, half);
  const cur = items.slice(half);

  const sessionsPrev = sum(prev, (x) => x.sessions);
  const sessionsCur = sum(cur, (x) => x.sessions);

  const usersPrev = avg(prev, (x) => x.activeUsers);
  const usersCur = avg(cur, (x) => x.activeUsers);

  const convPrev = avg(prev, (x) => x.conversionRate);
  const convCur = avg(cur, (x) => x.conversionRate);

  const crashesPrev = sum(prev, (x) => x.crashes);
  const crashesCur = sum(cur, (x) => x.crashes);

  return {
    sessionsCur,
    sessionsDeltaPct: pctChange(sessionsCur, sessionsPrev),

    usersCurAvg: usersCur,
    usersDeltaPct: pctChange(usersCur, usersPrev),

    convCurAvg: convCur,
    convDeltaPP: (convCur - convPrev) * 100,

    crashesCur,
    crashesDeltaPct: pctChange(crashesCur, crashesPrev),

    hasEnoughData: items.length >= 4,
  };
}