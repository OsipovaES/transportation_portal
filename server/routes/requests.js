import { Router } from "express";
import {
  createRequest,
  getAllRequests,
  addReviewToRequest,
  updateRequestStatus,
  deleteRequest,
} from "../db/queries.js";

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

router.post("/:id/review", async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;

  try {
    const updatedRequest = await addReviewToRequest(id, review);
    res.json(updatedRequest);
  } catch (error) {
    console.error("Ошибка при добавлении отзыва:", error);
    res.status(500).json({ message: "Ошибка при сохранении отзыва", error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedRequest = await updateRequestStatus(Number(id), status);
    res.json(updatedRequest);
  } catch (error) {
    console.error("Ошибка при обновлении статуса заявки:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при обновлении статуса", error });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRequest = await deleteRequest(id);
    res.json(deletedRequest);
  } catch (error) {
    console.error("Ошибка при удалении заявки:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при удалении заявки", error });
  }
});

export default router;
