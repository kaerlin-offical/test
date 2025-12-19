import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertContact } from "@shared/schema";

export function useCreateContact() {
  return useMutation({
    mutationFn: async (data: InsertContact) => {
      const validated = api.contact.create.input.parse(data);
      
      const res = await fetch(api.contact.create.path, {
        method: api.contact.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.contact.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to send message");
      }

      return api.contact.create.responses[201].parse(await res.json());
    },
  });
}
