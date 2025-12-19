import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl, type CreateCheckoutRequest } from "@shared/routes";

// List all products
export function useProducts() {
  return useQuery({
    queryKey: [api.products.list.path],
    queryFn: async () => {
      const res = await fetch(api.products.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

// Get single product
export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      return api.products.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// Create Checkout Session
export function useCreateCheckout() {
  return useMutation({
    mutationFn: async (data: CreateCheckoutRequest) => {
      // Validate input before sending using the schema from routes
      const validated = api.checkout.create.input.parse(data);
      
      const res = await fetch(api.checkout.create.path, {
        method: api.checkout.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.checkout.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create checkout session");
      }
      
      return api.checkout.create.responses[200].parse(await res.json());
    },
  });
}
