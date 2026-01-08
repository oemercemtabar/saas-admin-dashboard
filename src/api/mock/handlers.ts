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

    http.get('/api/users', async ({ request }) => {
        await delay(300);
        const url = new URL(request.url);
        const q = (url.searchParams.get('q') ?? '').toLowerCase();
        const role = url.searchParams.get('role') ?? 'all';
        const page = Number(url.searchParams.get('page') ?? '1');
        const pageSize = Number(url.searchParams.get('pageSize') ?? '10');

        const allUsers = [
            { id: "u1", name:"Alice Johnson", email: "alice@example.com", role: "admin", status: "active", lastSeen: daysAgo(2) },
            { id: "u2", name:"Bob Smith", email: "bob@example.com", role: "user", status: "active", lastSeen: daysAgo(5) },
            { id: "u3", name:"Charlie Brown", email: "charlie@example.com", role: "user", status: "inactive", lastSeen: daysAgo(10) }
            // ...more mock users
        ];

        function daysAgo(days: number) {
            return new Date(Date.now() - days * 24 * 60_000 * 60).toISOString();
        }

        let filtered = allUsers;

        if (q) {
            filtered = filtered.filter(user => 
                user.name.toLowerCase().includes(q) || 
                user.email.toLowerCase().includes(q)
            );
        }
        
        if (role !== 'all') {
            filtered = filtered.filter(user => user.role === role);
        }

        const total = filtered.length;
        const start = (page - 1) * pageSize;
        const items = filtered.slice(start, start + pageSize);

        return HttpResponse.json({
            items,
            total,
            page,
            pageSize,
        });
    },),
];
