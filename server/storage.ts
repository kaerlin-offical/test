import { db } from "./db";
import { supabase } from "./supabase";
import {
  contacts,
  type InsertContact,
  type Contact
} from "@shared/schema";

export interface IStorage {
  createContact(contact: InsertContact): Promise<Contact>;
}

export class DatabaseStorage implements IStorage {
  async createContact(insertContact: InsertContact): Promise<Contact> {
    if (db) {
      const [contact] = await db.insert(contacts).values(insertContact).returning();
      return contact;
    }

    if (supabase) {
      const { data, error } = await supabase
        .from("contacts")
        .insert({ ...insertContact })
        .select()
        .single();

      if (error || !data) {
        console.error("[Storage] Failed to save contact to Supabase", error);
        throw new Error("Failed to save contact message");
      }

      return {
        id: data.id ?? Date.now(),
        name: data.name,
        email: data.email,
        message: data.message,
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      };
    }

    // Log contact when no database configuration is available
    console.log('[Storage] Contact form submitted (not saved - no database):', insertContact);
    return {
      id: Date.now(),
      ...insertContact,
      createdAt: new Date(),
    };
  }
}

export const storage = new DatabaseStorage();
