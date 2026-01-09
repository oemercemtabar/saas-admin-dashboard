import { delay, http, HttpResponse } from 'msw'

function daysAgo(days: number) {
    return new Date(Date.now() - days * 24 * 60 * 60).toISOString();
}

function isoDay(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}


const roles = ['admin', 'client_admin', 'user'] as const;
const statuses = ['active', 'inactive'] as const;
type TicketStatus = "pending" | "in_progress" | "resolved";

const allUsers = Array.from({ length: 57 }, (_, i) => {
    const idx = i + 1;
    const role = roles[idx % roles.length];
    const status = statuses[idx % statuses.length];
    return {
        id: `u${idx}`,
        name: `User ${idx}`,
        email: `user${idx}@example.com`,
        role,
        status,
        lastSeen: daysAgo(idx % 15),
    };
});

export const handlers = [

  http.post('/api/auth/login', async ({request}) => {
    await delay(300);
    const body = (await request.json()) as { email: string; password: string };
    if (body.email === 'admin@opspulse.dev' && body.password === 'admin123') {
        return HttpResponse.json({ token: 'fake-jwt-token', user: {id: "admin-1", name: "Admin", role: "admin"}, });
    }
    return new HttpResponse(
      JSON.stringify({ message: "Invalid email or password" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }),

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

    http.get('/api/users/:id', async ({ params }) => {
        await delay(200);
        const {id} = params as {id: string};
        const user = allUsers.find(u => u.id === id);

        if(!user) {
            return new HttpResponse(null, { status: 404 });
        }

        const sessions = Array.from({ length: 6 }, (_, i) => ({
            id: `${id}-s${i + 1}`,
            ts: new Date(Date.now() - (i + 1) * 36 * 60 * 60 * 1000).toISOString(),
            brand: ['DMT', 'Nike', 'Adidas', 'Salomon'][i % 4],
            model: ['Model A', 'Model B', 'Model C'][i % 3],
            footShpae: ['Narrow', 'Average', 'Wide', 'Extra Wide'][i % 4],
            toeShape: ['Greek', 'Roman', 'Egyptian'][i % 3],
            statuses: ["completed", "completed", "failed"][i % 3],
        }));

        return HttpResponse.json({
            user,
            sessions,
        });
    },),

    http.get("/api/metrics/timeseries", async ({ request }) => {
        await delay(250);

        const url = new URL(request.url);
        const days = Number(url.searchParams.get("days") ?? "14");

        const data = Array.from({ length: days }).map((_, i) => {
            const idx = days - 1 - i;
            return {
            day: isoDay(idx),
            activeUsers: 800 + (i * 13) + (i % 3) * 40,
            sessions: 1800 + (i * 27) + (i % 4) * 60,
            crashes: Math.max(0, 12 - (i % 6)),
            conversionRate: 0.09 + (i % 5) * 0.004,
            };
        });

        return HttpResponse.json({ items: data });
    },),
];
