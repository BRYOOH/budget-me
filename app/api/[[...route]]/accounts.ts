import { db } from "@/database/drizzle";
import { accounts } from "@/database/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono"
import { eq } from "drizzle-orm";

const app = new Hono()
.get("/",
    clerkMiddleware(),
    async(c)=>{

    const auth = getAuth(c);
    if(!auth?.userId){
        return c.json({ error:" Unauthorized user"}, 401)
    };

    const data = await db.
    select({    
        id:accounts.id,
        name:accounts.name
    }).from(accounts)
    .where(eq(accounts.userId,auth.userId));

    return c.json({data});
});

export default app;