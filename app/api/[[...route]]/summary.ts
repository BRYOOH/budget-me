import { z } from "zod";
import { Hono } from "hono";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";
import { subDays, parse, differenceInDays } from "date-fns";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";

import { db } from "@/database/drizzle";
import { accounts, categories, transactions } from "@/database/schema";

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

    //Used to return the transactions between the start and end date 
   async function fetchFinancialData (
    userId:string,
    startDate: Date,
    endDate: Date
    ) {
         return await db
         .select({ 
            income: sql `SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
            expenses:sql `SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
            remaining:sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .innerJoin(accounts, 
            eq(transactions.accountId,accounts.id))
        .where(
            and(
                accountId ? eq(transactions.accountId,accountId) : undefined,
                eq(accounts.userId,userId),
                lte(transactions.date,endDate),
                gte(transactions.date,startDate)
            ))
        };

    const [currentPeriod] = await fetchFinancialData(
        auth.userId,
        startDate,
        endDate
    );

    const [lastPeriod] = await fetchFinancialData(
        auth.userId,
        lastPeriodStart,
        lastPeriodEnd);

    const incomeChange = calculatePercentageChange(
        currentPeriod.income,
        lastPeriod.income
    );

    const expenseChange = calculatePercentageChange(
        currentPeriod.expenses,
        lastPeriod.expenses
    );

    const remainingChange = calculatePercentageChange(
        currentPeriod.remaining,
        lastPeriod.remaining
    );

    //Used to group the transactions by category to see the most used category
    const category = await db
    .select({
        name:categories.name,
        value: sql `SUM(ABS(${transactions.amount}))`.mapWith(Number), //(TODO:)
    })
    .from(transactions)
    .innerJoin(
        categories,
        eq(transactions.categoryId, categories.id)
    )
    .innerJoin(
        accounts,
        eq(transactions.accountId, accounts.id)
    )
    .where(
        and(
        accountId ? eq(transactions.accountId,accountId) : undefined,
        eq(accounts.userId, auth.userId),
        lt(transactions.amount,0),//(TODO:)
        lte(transactions.date,endDate),
        gte(transactions.date,startDate)
    ))
    .groupBy(categories.name)
    .orderBy(desc(
        sql`SUM(ABS(${transactions.amount}))`
    ));

    const topCategories = category.slice(0,3);//(TODO:)
    const otherCategories = category.slice(3);//(TODO:)
    const otherSum = otherCategories
    .reduce((sum,current) => sum + current.value,0);//(TODO:)

const finalCategories = [...topCategories];
    if(otherCategories.length > 0){
        finalCategories.push({//(TODO:)
            name:'Other',
            value: otherSum,
        });
    }

    //Returns the days with transaction activity
    const activeDays = await db
    .select({ 
        date: transactions.date,
        income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
        expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
    }).from(transactions)
    .innerJoin(
        accounts,
        eq(transactions.accountId,accounts.id)
    )
    .where(
        and(
            accountId ? eq(transactions.accountId,accountId) : undefined,
            eq(accounts.userId,auth.userId),
            lte(transactions.date, endDate),
            gte(transactions.date, startDate),
        )
    ).groupBy(transactions.date)
    .orderBy(transactions.date);

    const days = fillMissingDays(
        activeDays,
        startDate,
        endDate
    );
    
        return c.json({
            data: {
                remainingAmount: currentPeriod.remaining, remainingChange,
                incomeAmount: currentPeriod.income, incomeChange,
                expenseAmount: currentPeriod.expenses,expenseChange,
                categories:finalCategories,
                days,
            },
        });

});

export default app