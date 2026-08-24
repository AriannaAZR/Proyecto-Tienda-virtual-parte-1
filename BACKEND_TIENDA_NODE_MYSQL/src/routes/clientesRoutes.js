const express = require("express")
const { getClientes, createCliente, updateCliente, deleteCliente } = require("../controllers/clientesController")
const { soloAdministrador } = require("../middlewares/restrictVendedor")

const router = express.Router()

// GET /api/clientes
// GET /api/clientes/:id
router.get("/:id?", getClientes)

// POST /api/clientes
router.post("/", createCliente)

// PUT /api/clientes/:id
router.put("/:id", updateCliente)

// DELETE /api/clientes/:id (Proceso 3: solo administrador)
router.delete("/:id", soloAdministrador, deleteCliente)

module.exports = router
