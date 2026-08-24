const express = require("express")
const { getPedidos, createPedido, updatePedido, deletePedido } = require("../controllers/pedidosController")
const { soloAdministrador } = require("../middlewares/restrictVendedor")

const router = express.Router()

// GET /api/pedidos
// GET /api/pedidos/:id
router.get("/:id?", getPedidos)

// POST /api/pedidos
router.post("/", createPedido)

// PUT /api/pedidos/:id
router.put("/:id", updatePedido)

// DELETE /api/pedidos/:id (Proceso 3: solo administrador)
router.delete("/:id", soloAdministrador, deletePedido)

module.exports = router
