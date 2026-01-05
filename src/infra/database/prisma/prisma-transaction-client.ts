import { DefaultArgs } from "@prisma/client/runtime/client";
import { PrismaClient } from "generated/prisma/client";

export type PrismaTransactionClient = Omit<PrismaClient<never, undefined, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">