import { pgTable, serial, text, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const dreams = pgTable('dreams', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  dream: text('dream').notNull(),
  emotions: varchar('emotions', { length: 300 }).default('').notNull(),
  symbols: jsonb('symbols').$type<string[]>().default([]).notNull(),
  archetype: varchar('archetype', { length: 120 }).default('Unnamed').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Dream = typeof dreams.$inferSelect;
export type NewDream = typeof dreams.$inferInsert;
