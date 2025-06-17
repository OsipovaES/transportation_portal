import pool from "./pool.js";

(async () => {
  try {
    const res = await pool.query("SELECT NOW();");
    console.log("Успешное подключение к БД:", res.rows[0]);
    pool.end();
  } catch (err) {
    console.error("Ошибка подключения к БД:", err.message);
  }
})();
