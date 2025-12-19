import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { LoginRequest, VerifyEmailRequest, Customer } from "@shared/schema";

export function useAuth() {
  return useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.auth.me.responses[200].parse(await res.json());
    },
    retry: false,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const validated = api.auth.login.input.parse(data);
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }

      return api.auth.login.responses[200].parse(await res.json());
    },
  });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: VerifyEmailRequest) => {
      const validated = api.auth.verify.input.parse(data);
      const res = await fetch(api.auth.verify.path, {
        method: api.auth.verify.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Verification failed");
      }

      return api.auth.verify.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.auth.logout.path, {
        method: api.auth.logout.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout failed");
      return api.auth.logout.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
    },
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: [api.invoices.list.path],
    queryFn: async () => {
      const res = await fetch(api.invoices.list.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Authentication required");
      if (!res.ok) throw new Error("Failed to fetch invoices");
      return api.invoices.list.responses[200].parse(await res.json());
    },
  });
}

export function useInvoice(id: number) {
  return useQuery({
    queryKey: [api.invoices.get.path, id],
    queryFn: async () => {
      const url = api.invoices.get.path.replace(':id', String(id));
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 401) throw new Error("Authentication required");
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch invoice");
      return api.invoices.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
