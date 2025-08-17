import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedures";
export const appRouter = createTRPCRouter({
  category: categoriesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
