import pool from "./pool.js";

// Регистрация пользователя
const registerUser = async (userData) => {
  const {
    name,
    phone,
    email,
    username,
    passwordHash,
    role = "user",
  } = userData;

  const result = await pool.query(
    `INSERT INTO users (name, phone, email, username, password_hash, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, email, username, role, created_at`,
    [name, phone, email, username, passwordHash, role]
  );

  return result.rows[0];
};

// Поиск пользователя в бд
const findUserByUsername = async (username) => {
  const result = await pool.query(
    `SELECT id, username, password_hash, role FROM users WHERE username = $1`,
    [username]
  );
  return result.rows[0];
};

// Создание новой заявки
const createRequest = async ({
  userId,
  desiredDatetime,
  cargoWeight,
  cargoDimensions,
  pickupAddress,
  deliveryAddress,
  cargoType,
}) => {
  const result = await pool.query(
    `INSERT INTO requests 
      (user_id, desired_datetime, cargo_weight, cargo_dimensions, pickup_address, delivery_address, cargo_type, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'Новая')
     RETURNING *`,
    [
      userId,
      desiredDatetime,
      cargoWeight,
      cargoDimensions,
      pickupAddress,
      deliveryAddress,
      cargoType,
    ]
  );

  return result.rows[0];
};

// Получение всех заявок
const getAllRequests = async () => {
  const result = await pool.query(`SELECT * FROM requests`);

  return result.rows;
};

// Добавление отзыва к заявке
const addReviewToRequest = async (requestId, review) => {
  const result = await pool.query(
    `UPDATE requests SET review = $1 WHERE id = $2 RETURNING *`,
    [review, requestId]
  );

  return result.rows[0];
};

// Обновление статуса заявки
const updateRequestStatus = async (requestId, status) => {
  const result = await pool.query(
    `UPDATE requests SET status = $1 WHERE id = $2 RETURNING *`,
    [status, requestId]
  );

  return result.rows[0];
};

// Удаление заявки
const deleteRequest = async (requestId) => {
  const result = await pool.query(
    `DELETE FROM requests WHERE id = $1 RETURNING *`,
    [requestId]
  );

  return result.rows[0];
};

export {
  registerUser,
  findUserByUsername,
  createRequest,
  getAllRequests,
  addReviewToRequest,
  updateRequestStatus,
  deleteRequest,
};
