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
  const result = await pool.query(
    `SELECT id, user_id, desired_datetime, cargo_weight, cargo_dimensions,
            pickup_address, delivery_address, cargo_type, status
     FROM requests`
  );

  return result.rows;
};

export { registerUser, findUserByUsername, createRequest, getAllRequests };
