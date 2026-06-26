const connectionString =
  process.env.DATABASE_URL || 'postgres://acrossr10:acrossr10@localhost:5437/acrossr10';

let pool;

const loadPoolCtor = async () => {
  const packageName = ['p', 'g'].join('');
  const mod = await import(packageName);
  return mod.Pool;
};

export const getDbPool = async () => {
  if (!pool) {
    const Pool = await loadPoolCtor();
    pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000
    });
  }

  return pool;
};
