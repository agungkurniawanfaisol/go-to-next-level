/**
 * lib/db.ts — File-based JSON Database
 *
 * Replaces Prisma with a simple JSON file store.
 * - Reads seed data from `data/*.json` at startup
 * - Supports CRUD operations (findMany, findUnique, create, update, delete, count, aggregate)
 * - Mutations are tracked in memory; on Vercel (serverless) they persist to /tmp/ during a session
 * - Falls back gracefully on cold starts
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

// ─── Types ────────────────────────────────────────────────────────────────

type WhereOp = {
  equals?: unknown;
  not?: unknown;
  in?: unknown[];
  notIn?: unknown[];
  gt?: number | Date;
  gte?: number | Date;
  lt?: number | Date;
  lte?: number | Date;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  mode?: "insensitive";
};

type WhereClause<T> = {
  [K in keyof T]?: T[K] | WhereOp;
} & {
  OR?: WhereClause<T>[];
  AND?: WhereClause<T>[];
  NOT?: WhereClause<T>;
};

type OrderByClause<T> = { [K in keyof T]?: "asc" | "desc" };
type SelectClause = Record<string, any>;
type IncludeClause = Record<string, any>;

type AggregateResult = {
  _sum?: Record<string, number>;
  _avg?: Record<string, number>;
  _min?: Record<string, number>;
  _max?: Record<string, number>;
  _count?: number;
};

type ModelWithId = { id: string; [key: string]: unknown };

// ─── Table (single collection) ────────────────────────────────────────────

class Table<T extends ModelWithId> {
  private data: T[] = [];
  private filePath: string;
  private seedData: T[];
  private dataDir: string;

  constructor(filename: string, seedDataLoader: () => T[]) {
    this.dataDir = findDataDir();
    this.filePath = path.join(this.dataDir, filename);
    this.seedData = seedDataLoader();
    this.load();
  }

  private load(): void {
    try {
      if (existsSync(this.filePath)) {
        const raw = readFileSync(this.filePath, "utf-8");
        const parsed = JSON.parse(raw) as T[];
        this.data = parsed;
        return;
      }
    } catch {
      // Fall through to seed
    }
    // First load: use seed data, then persist to writable location
    this.data = structuredClone(this.seedData);
    this.persist();
  }

  private persist(): void {
    try {
      writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), "utf-8");
    } catch {
      // On serverless (Vercel), /tmp/ is writable; if that fails, data stays in memory
    }
  }

  /** Reset to seed data (useful for re-seeding) */
  reset(): void {
    this.data = structuredClone(this.seedData);
    this.persist();
  }

  // ─── Query engine ─────────────────────────────────────────────────────

  private matchValue(value: unknown, op: WhereOp): boolean {
    if (op.equals !== undefined) return value === op.equals;
    if (op.not !== undefined) return value !== op.not;
    if (op.in !== undefined) return (op.in as unknown[]).includes(value);
    if (op.notIn !== undefined) return !(op.notIn as unknown[]).includes(value);
    if (op.contains !== undefined && typeof value === "string") {
      const search = op.contains;
      if (op.mode === "insensitive") {
        return (value as string).toLowerCase().includes(search.toLowerCase());
      }
      return (value as string).includes(search);
    }
    if (op.startsWith !== undefined && typeof value === "string") {
      return (value as string).startsWith(op.startsWith);
    }
    if (op.endsWith !== undefined && typeof value === "string") {
      return (value as string).endsWith(op.endsWith);
    }
    if (op.gt !== undefined) {
      const a = value instanceof Date ? value.getTime() : Number(value);
      const b = op.gt instanceof Date ? op.gt.getTime() : Number(op.gt);
      return a > b;
    }
    if (op.gte !== undefined) {
      const a = value instanceof Date ? value.getTime() : Number(value);
      const b = op.gte instanceof Date ? op.gte.getTime() : Number(op.gte);
      return a >= b;
    }
    if (op.lt !== undefined) {
      const a = value instanceof Date ? value.getTime() : Number(value);
      const b = op.lt instanceof Date ? op.lt.getTime() : Number(op.lt);
      return a < b;
    }
    if (op.lte !== undefined) {
      const a = value instanceof Date ? value.getTime() : Number(value);
      const b = op.lte instanceof Date ? op.lte.getTime() : Number(op.lte);
      return a <= b;
    }
    return true;
  }

  private matchWhere(item: T, where?: WhereClause<T>): boolean {
    if (!where) return true;

    // Handle OR
    if ((where as any).OR) {
      return (where as any).OR.some((sub: WhereClause<T>) => this.matchWhere(item, sub));
    }

    // Handle AND
    if ((where as any).AND) {
      return (where as any).AND.every((sub: WhereClause<T>) => this.matchWhere(item, sub));
    }

    // Handle NOT
    if ((where as any).NOT) {
      if (this.matchWhere(item, (where as any).NOT)) return false;
    }

    for (const [key, condition] of Object.entries(where)) {
      if (key === "OR" || key === "AND" || key === "NOT") continue;

      const value = (item as any)[key];

      // If the condition is an object with operators
      if (condition !== null && typeof condition === "object" && !Array.isArray(condition) && !(condition instanceof Date)) {
        if (!this.matchValue(value, condition as WhereOp)) return false;
      } else {
        // Direct equality
        if (value !== condition) return false;
      }
    }

    return true;
  }

  private applyOrderBy(items: T[], orderBy?: OrderByClause<T>[] | OrderByClause<T>): T[] {
    if (!orderBy || orderBy.length === 0) return items;

    const orders = Array.isArray(orderBy) ? orderBy : [orderBy];

    return [...items].sort((a, b) => {
      for (const order of orders) {
        const [field, direction] = Object.entries(order)[0] ?? [];
        if (!field) continue;

        const aVal = (a as any)[field];
        const bVal = (b as any)[field];

        if (aVal == null && bVal == null) continue;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        let cmp: number;
        if (aVal instanceof Date || bVal instanceof Date || typeof aVal === "string" && typeof bVal === "string" && isNaN(Number(aVal)) && isNaN(Number(bVal))) {
          cmp = String(aVal).localeCompare(String(bVal));
        } else {
          cmp = Number(aVal) - Number(bVal);
        }

        if (direction === "desc") cmp = -cmp;
        if (cmp !== 0) return cmp;
      }
      return 0;
    });
  }

  private applySelect<T2 extends Record<string, unknown>>(item: T, select?: SelectClause): T2 {
    if (!select) return item as unknown as T2;
    const result: Record<string, unknown> = {};
    for (const [key, include] of Object.entries(select)) {
      if (include) {
        result[key] = (item as any)[key];
      }
    }
    return result as T2;
  }

  // ─── Public API ───────────────────────────────────────────────────────

  findMany(params: {
    where?: WhereClause<T>;
    orderBy?: OrderByClause<T>[] | OrderByClause<T>;
    select?: SelectClause;
    include?: IncludeClause;
    take?: number;
    skip?: number;
  } = {}): any[] {
    let results = this.data.filter((item) => this.matchWhere(item, params.where));

    if (params.orderBy) {
      results = this.applyOrderBy(results, params.orderBy);
    }

    if (params.skip) {
      results = results.slice(params.skip);
    }

    if (params.take) {
      results = results.slice(0, params.take);
    }

    // Apply include (resolve relations)
    if (params.include) {
      results = results.map((item) => this.applyInclude(item, params.include!));
    }

    // Apply select
    if (params.select) {
      results = results.map((item) => this.applySelect(item, params.select!));
    }

    return results;
  }

  findUnique(params: {
    where: Record<string, any>;
    include?: IncludeClause;
    select?: SelectClause;
  }): any {
    const item = this.data.find((item) => this.matchWhere(item, params.where));
    if (!item) return null;

    if (params.include) {
      return this.applyInclude(item, params.include);
    }

    if (params.select) {
      return this.applySelect(item, params.select);
    }

    return item;
  }

  findFirst(params: {
    where?: WhereClause<T>;
    select?: SelectClause;
    include?: IncludeClause;
    orderBy?: OrderByClause<T>[] | OrderByClause<T>;
  } = {}): any {
    const results = this.findMany({ ...params, take: 1 });
    return results[0] ?? null;
  }

  create(params: { data: Partial<T> & { id?: string; predictions?: { create: any[] } } }): T {
    const newItem = {
      ...params.data,
      id: params.data.id ?? generateId(),
    } as T;

    // Handle nested creates (e.g., predictions: { create: [...] })
    if ((newItem as any).predictions?.create) {
      delete (newItem as any).predictions;
    }

    this.data.push(newItem);
    this.persist();
    return newItem;
  }

  update(params: { where: { id: string }; data: Partial<T> }): T {
    const idx = this.data.findIndex((item) => item.id === params.where.id);
    if (idx === -1) throw new Error(`Record not found: ${params.where.id}`);

    this.data[idx] = { ...this.data[idx], ...params.data };
    this.persist();
    return this.data[idx];
  }

  updateMany(params: { where: WhereClause<T>; data: Partial<T> }): number {
    let count = 0;
    for (let i = 0; i < this.data.length; i++) {
      if (this.matchWhere(this.data[i], params.where)) {
        this.data[i] = { ...this.data[i], ...params.data };
        count++;
      }
    }
    if (count > 0) this.persist();
    return count;
  }

  delete(params: { where: { id: string } }): T | null {
    const idx = this.data.findIndex((item) => item.id === params.where.id);
    if (idx === -1) return null;

    const deleted = this.data.splice(idx, 1)[0];
    this.persist();
    return deleted;
  }

  deleteMany(params?: { where?: WhereClause<T> }): number {
    if (!params?.where) {
      const count = this.data.length;
      this.data = [];
      this.persist();
      return count;
    }

    const toKeep = this.data.filter((item) => !this.matchWhere(item, params.where));
    const count = this.data.length - toKeep.length;
    this.data = toKeep;
    if (count > 0) this.persist();
    return count;
  }

  count(params: { where?: WhereClause<T> } = {}): number {
    if (!params.where) return this.data.length;
    return this.data.filter((item) => this.matchWhere(item, params.where)).length;
  }

  aggregate(params: {
    where?: WhereClause<T>;
    _sum?: Record<string, boolean>;
    _avg?: Record<string, boolean>;
    _min?: Record<string, boolean>;
    _max?: Record<string, boolean>;
  }): any {
    const items = params.where
      ? this.data.filter((item) => this.matchWhere(item, params.where))
      : this.data;

    const result: AggregateResult = {};

    if (params._sum) {
      result._sum = {};
      for (const field of Object.keys(params._sum)) {
        result._sum[field] = items.reduce(
          (sum, item) => sum + (Number((item as any)[field]) || 0),
          0,
        );
      }
    }

    if (params._avg) {
      result._avg = {};
      for (const field of Object.keys(params._avg)) {
        const sum = items.reduce(
          (s, item) => s + (Number((item as any)[field]) || 0),
          0,
        );
        result._avg[field] = items.length > 0 ? sum / items.length : 0;
      }
    }

    if (params._min) {
      result._min = {};
      for (const field of Object.keys(params._min)) {
        result._min[field] = Math.min(
          ...items.map((item) => Number((item as any)[field]) || 0),
        );
      }
    }

    if (params._max) {
      result._max = {};
      for (const field of Object.keys(params._max)) {
        result._max[field] = Math.max(
          ...items.map((item) => Number((item as any)[field]) || 0),
        );
      }
    }

    return result;
  }

  // ─── Include resolver ─────────────────────────────────────────────────

  private applyInclude(item: T, include: IncludeClause): any {
    const result = { ...item } as any;

    for (const [key, config] of Object.entries(include)) {
      if (!config) continue;

      const includeOpts = typeof config === "object" ? config : {};
      const select = includeOpts.select ? includeOpts.select as Record<string, boolean> : undefined;
      const orderBy = includeOpts.orderBy as OrderByClause<any> | undefined;

      // Resolve relations based on key name
      if (key === "predictions" || key === "messages") {
        // Find related records where this item's id is the foreign key
        const foreignKey = key === "predictions" ? "appraisalId" : "proposalId";
        const relatedTable =
          key === "predictions" ? db.appraisalPrediction : db.barterMessage;

        let related = relatedTable.findMany({ where: { [foreignKey]: item.id } as any });

        if (orderBy) {
          related = relatedTable.findMany({ where: { [foreignKey]: item.id } as any, orderBy });
        }

        result[key] = related.map((r: any) => {
          if (select) {
            const picked: Record<string, any> = {};
            for (const [sKey, sVal] of Object.entries(select)) {
              if (sVal) picked[sKey] = r[sKey];
            }
            return picked;
          }
          return r;
        });
      }

      if (key === "sender") {
        const userId = result.senderId;
        const user = db.user.findUnique({ where: { id: userId } });
        if (select) {
          const picked: Record<string, any> = {};
          for (const [sKey, sVal] of Object.entries(select)) {
            if (sVal) picked[sKey] = user?.[sKey];
          }
          result[key] = picked;
        } else {
          result[key] = user;
        }
      }

      if (key === "user") {
        const userId = result.userId;
        const user = db.user.findUnique({ where: { id: userId } });
        if (select) {
          const picked: Record<string, any> = {};
          for (const [sKey, sVal] of Object.entries(select)) {
            if (sVal) picked[sKey] = user?.[sKey];
          }
          result[key] = picked;
        } else {
          result[key] = user;
        }
      }

      if (key === "proposer") {
        const proposerId = result.proposerUserId;
        const user = db.user.findUnique({ where: { id: proposerId } });
        if (select) {
          const picked: Record<string, any> = {};
          for (const [sKey, sVal] of Object.entries(select)) {
            if (sVal) picked[sKey] = user?.[sKey];
          }
          result[key] = picked;
        } else {
          result[key] = user;
        }
      }

      if (key === "offeredAppraisal" || key === "requestedAppraisal") {
        const fk = key === "offeredAppraisal" ? "offeredAppraisalId" : "requestedAppraisalId";
        const appraisal = db.appraisal.findUnique({ where: { id: result[fk] } });

        if (select) {
          const picked: Record<string, any> = {};
          for (const [sKey, sVal] of Object.entries(select)) {
            if (sVal) {
              // Handle nested includes like user within requestedAppraisal
              if (sKey === "user" && typeof sVal === "object") {
                const userSelect = (sVal as any).select as Record<string, boolean>;
                const userId = appraisal?.userId;
                if (userId) {
                  const user = db.user.findUnique({ where: { id: userId } });
                  if (userSelect) {
                    picked.user = {};
                    for (const [uk, uv] of Object.entries(userSelect)) {
                      if (uv) picked.user[uk] = (user as any)?.[uk];
                    }
                  } else {
                    picked.user = user;
                  }
                } else {
                  picked.user = null;
                }
              } else {
                picked[sKey] = (appraisal as any)?.[sKey];
              }
            }
          }
          result[key] = picked;
        } else {
          result[key] = appraisal;
        }
      }
    }

    return result;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────

let _idCounter = 0;

function generateId(): string {
  _idCounter++;
  const ts = Date.now().toString(36);
  return `db${ts}${_idCounter.toString(36).padStart(4, "0")}`;
}

function findDataDir(): string {
  // On Vercel, /tmp is writable; else use project root
  const tmpDir = "/tmp/ecoswap-data";
  const localDir = path.join(process.cwd(), "data");

  // Try /tmp first (Vercel serverless); fall back to local
  try {
    if (!existsSync(tmpDir)) {
      mkdirSync(tmpDir, { recursive: true });
    }
    // Verify it's writable
    writeFileSync(path.join(tmpDir, ".write-test"), "ok");
    return tmpDir;
  } catch {
    // Fall back to project data directory
    if (!existsSync(localDir)) {
      mkdirSync(localDir, { recursive: true });
    }
    return localDir;
  }
}

// ─── Load seed data from bundled JSON files ───────────────────────────────

function loadSeed<T>(filename: string): T[] {
  const seedPath = path.join(process.cwd(), "data", filename);
  try {
    const raw = readFileSync(seedPath, "utf-8");
    return JSON.parse(raw) as T[];
  } catch (e) {
    console.error(`[db] Failed to load seed data from ${seedPath}:`, e);
    return [];
  }
}

// ─── Database wrapper ─────────────────────────────────────────────────────

type AnyRecord = { id: string; [key: string]: unknown };

class Database {
  user = new Table<AnyRecord>("users.json", () => loadSeed<AnyRecord>("users.json"));
  heritageItem = new Table<AnyRecord>("heritage-items.json", () => loadSeed<AnyRecord>("heritage-items.json"));
  appraisal = new Table<AnyRecord>("appraisals.json", () => loadSeed<AnyRecord>("appraisals.json"));
  appraisalPrediction = new Table<AnyRecord>("appraisal-predictions.json", () => loadSeed<AnyRecord>("appraisal-predictions.json"));
  barterProposal = new Table<AnyRecord>("barter-proposals.json", () => loadSeed<AnyRecord>("barter-proposals.json"));
  barterMessage = new Table<AnyRecord>("barter-messages.json", () => loadSeed<AnyRecord>("barter-messages.json"));

  $transaction<T>(fn: () => T): T;
  $transaction(operations: any[]): any[];
  $transaction(arg: any): any {
    // For callback-style: execute the function
    if (typeof arg === "function") {
      return arg();
    }
    // For array-style: execute each operation
    if (Array.isArray(arg)) {
      return arg.map((op) => op);
    }
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────

const globalForDb = globalThis as unknown as { db?: Database };
export const db: Database = globalForDb.db ?? new Database();
if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}

export { Database };
export type { WhereClause, OrderByClause, SelectClause, IncludeClause, WhereOp };
