/*
ruta: /api/clientes
*/
const { check } = require('express-validator');
const { Router } = require('express');

const { getClientes, guardarCliente, actualizarCliente, getClienteId, eliminarCliente } = require('../controllers/clientes');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getClientes);
router.get('/:id', validarJWT, getClienteId);

router.post('/',[
    validarJWT,
    check('cedula','La cédula es requerida').not().isEmpty(),
    check('nombre_completo','El nombre completo es requerido').not().isEmpty(),
    check('direccion','La dirección es requerida').not().isEmpty(),
    check('celular','El número celular es requerido').not().isEmpty(),
    check('correo','El correo es requerido').not().isEmpty(),
    check('tipo_cliente','El tipo de cliente es requerido').not().isEmpty(),
    validarCampos, 
] 
,guardarCliente);
router.put('/:id',[
    validarJWT,
    check('cedula','La cédula es requerida').not().isEmpty(),
    check('nombre_completo','El nombre completo es requerido').not().isEmpty(),
    check('direccion','La dirección es requerida').not().isEmpty(),
    check('celular','El número celular es requerido').not().isEmpty(),
    check('correo','El correo es requerido').not().isEmpty(),
    check('tipo_cliente','El tipo de cliente es requerido').not().isEmpty(),
    validarCampos
] 
,actualizarCliente);
router.delete('/:id', validarJWT, eliminarCliente);

module.exports = router;