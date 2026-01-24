import { z } from "zod";
import { Hono } from "hono";
import { and, eq, gte, lte, sql, sum } from "drizzle-orm";
import { subDays, parse, differenceInDays } from "date-fns";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/database/drizzle";
import { accounts, transactions } from "@/database/schema";

const app = new Hono()
.get("/", 
    clerkMiddleware(),
    zValidator("query",z.object({ 
        to:z.string().optional(),
        from:z.string().optional(),
        accountId:z.string().optional()})),
    async(c) =>{
    const auth = getAuth(c);

    if(!auth?.userId){
        return c.json({ error: "Unauthorized"}, 401);
    }

    const { to, from,accountId} = c.req.valid("query");
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo,30); // Basically defaultTo - 30;
    
    const startDate= from ? parse(from, "dd-MM-YYYY", new Date()): defaultFrom;
    const endDate = to ? parse (to, "dd-MM-YYYY" , new Date()) : defaultTo;

    const periodLength = differenceInDays(endDate,startDate);
    const lastPeriodStart = subDays(startDate,periodLength);
    const lastPeriodEnd = subDays(endDate,periodLength);

    async function fetchFinancialData(
        userId:string,
        startDate:Date,
        endDate:Date,
    ) {

        return await db
        .select({
            income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number) ,
            expenses: sql`SUM (CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number) ,
            remaining:sum(transactions.amount).mapWith(Number) ,
        })
        .from(transactions)
        .innerJoin(accounts,
            eq(transactions.accountId,accounts.id)
        ).where(
        and(
         accountId ? eq(transactions.accountId, accountId) : undefined,
         eq(accounts.userId,userId),
         gte(transactions.date, startDate),
         lte(transactions.date,endDate)
        )
        )
    };

    const [currentPeriod] = await fetchFinancialData(
        auth.userId,
        startDate,
        endDate
    );

    const [lastPeriod] = await fetchFinancialData(
        auth.userId,
        startDate,
        endDate );

        return c.json({
            currentPeriod,
            lastPeriod
        })

})

export default app