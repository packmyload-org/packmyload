import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        name: z.string().trim().min(2).max(120),
        email: z.string().trim().email().max(200),
        phone: z.string().trim().min(6).max(40),
        message: z.string().trim().min(5).max(4000),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const mod = await import("@/lib/contact.server");
    const result = await mod.sendContactEmails(data);
    return { ok: result.teamSent, ...result };
  });
