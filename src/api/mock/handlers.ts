import { delay, http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/kpis', async () => {
    await delay(250);
    return HttpResponse.json({
        activeUsers: 1200,
        sessions: 3500,
        crashes: 15,
        conersionRate: 0.124,
    });
 }),

    http.get('/api/activity', async () => {
        await delay(250);
        return HttpResponse.json([
            { 
                id: 1, 
                ts: new Date(Date.now() - 5* 60_000).toISOString(),
                type: 'message',
                message: "New fitting session completed",
            },
            {
                id: 2,
                ts: new Date(Date.now() - 15* 60_000).toISOString(),
                type: 'ticket',
                message: "Support ticket #1234 created",
            },
            {
                id: 3,
                ts: new Date(Date.now() - 30* 60_000).toISOString(),
                type: 'crash',
                message: "Crash rate exceeded threshold",
            },
            {
                id: 4,
                ts: new Date(Date.now() - 45* 60_000).toISOString(),
                type: 'health',
                message: "Redis latency back to normal",
            }
        ]);
    } ),
];
    


