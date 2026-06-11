import { pgTable, serial, text, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';

export * from './auth-schema';

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

export const syncs = pgTable('syncs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 20 }).notNull(),
  emotion: varchar('emotion', { length: 300 }).default('').notNull(),
  question: varchar('question', { length: 300 }).default('').notNull(),
  // LLM-classified at submission so reports cluster into named patterns
  pattern: varchar('pattern', { length: 120 }).notNull(),
  symbol: varchar('symbol', { length: 16 }).default('✨').notNull(),
  intensity: varchar('intensity', { length: 10 }).default('medium').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Sync = typeof syncs.$inferSelect;
export type NewSync = typeof syncs.$inferInsert;
