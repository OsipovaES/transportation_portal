import { Router } from "express";
import { createRequest, getAllRequests } from "../db/queries.js";

const router = Router();

// Создание заявки
router.post("/", async (req, res) => {
  const {
    userId,
    desiredDatetime,
    cargoWeight,
    cargoDimensions,
    pickupAddress,
    deliveryAddress,
    cargoType,
  } = req.body;

  try {
    const newRequest = await createRequest({
      userId,
      desiredDatetime,
      cargoWeight,
      cargoDimensions,
      pickupAddress,
      deliveryAddress,
      cargoType,
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Ошибка при создании заявки:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при создании заявки", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const requests = await getAllRequests();
    res.json(requests);
  } catch (error) {
    console.error("Ошибка при получении заявок:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при получении заявок", error });
  }
});

export default router;
