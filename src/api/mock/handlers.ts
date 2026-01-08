import { delay, http, HttpResponse } from 'msw'

export const handlers = [
  // Example handler for a GET request to /api/user
  http.get('/api/kpis', async () => {
    await delay(350);
    return HttpResponse.json({
        activeUsers: 1200,
        sessions: 3500,
        crashes: 15,
        conersionRate: 0.124,
    });
    }),
];