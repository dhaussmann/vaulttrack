import { Hono } from "hono";
import { Env } from './core-utils';
import type { DemoItem, ApiResponse, ParadexApiResponse, TVLData } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // New route to get Paradex Vault TVL
    app.get('/api/tvl', async (c) => {
        const PARADEX_API_URL = 'https://api.prod.paradex.trade/v1/vault';
        try {
            const response = await fetch(PARADEX_API_URL, {
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                console.error(`Paradex API request failed with status: ${response.status}`);
                return c.json({ success: false, error: 'Failed to fetch data from Paradex API' } satisfies ApiResponse, 502);
            }
            const data: ParadexApiResponse = await response.json();
            if (!data || !Array.isArray(data.results)) {
                 console.error('Invalid data structure from Paradex API');
                 return c.json({ success: false, error: 'Invalid data structure from Paradex API' } satisfies ApiResponse, 500);
            }
            const totalValueLocked = data.results.reduce((sum, vault) => {
                const balance = parseFloat(vault.balance);
                return sum + (isNaN(balance) ? 0 : balance);
            }, 0);
            const responsePayload: ApiResponse<TVLData> = {
                success: true,
                data: {
                    tvl: totalValueLocked,
                    lastUpdated: new Date().toISOString(),
                },
            };
            // Set cache header for 30 minutes
            c.header('Cache-Control', 'public, max-age=1800');
            return c.json(responsePayload);
        } catch (error) {
            console.error('Error fetching or processing Paradex TVL data:', error);
            return c.json({ success: false, error: 'An internal error occurred' } satisfies ApiResponse, 500);
        }
    });
    // --- Existing Demo Routes ---
    app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
    // Demo items endpoint using Durable Object storage
    app.get('/api/demo', async (c) => {
        const durableObjectStub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await durableObjectStub.getDemoItems();
        return c.json({ success: true, data } satisfies ApiResponse<DemoItem[]>);
    });
    // Counter using Durable Object
    app.get('/api/counter', async (c) => {
        const durableObjectStub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await durableObjectStub.getCounterValue();
        return c.json({ success: true, data } satisfies ApiResponse<number>);
    });
    app.post('/api/counter/increment', async (c) => {
        const durableObjectStub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await durableObjectStub.increment();
        return c.json({ success: true, data } satisfies ApiResponse<number>);
    });
    // Demo item management endpoints
    app.post('/api/demo', async (c) => {
        const body = await c.req.json() as DemoItem;
        const durableObjectStub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await durableObjectStub.addDemoItem(body);
        return c.json({ success: true, data } satisfies ApiResponse<DemoItem[]>);
    });
    app.put('/api/demo/:id', async (c) => {
        const id = c.req.param('id');
        const body = await c.req.json() as Partial<Omit<DemoItem, 'id'>>;
        const durableObjectStub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await durableObjectStub.updateDemoItem(id, body);
        return c.json({ success: true, data } satisfies ApiResponse<DemoItem[]>);
    });
    app.delete('/api/demo/:id', async (c) => {
        const id = c.req.param('id');
        const durableObjectStub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await durableObjectStub.deleteDemoItem(id);
        return c.json({ success: true, data } satisfies ApiResponse<DemoItem[]>);
    });
}