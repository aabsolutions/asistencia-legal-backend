/*
    Path: /api/busqueda
*/

const { Router } = require('express');

const { validarJWT } = require('../middlewares/validar-jwt');

const { busquedaALL, busquedaColeccion, busquedaTemasPorCliente } = require('../controllers/busquedas');

const router = Router();

router.get('/:str', [ validarJWT ] ,busquedaALL );
router.get('/:tbl/:str', [ validarJWT ] ,busquedaColeccion );
router.get('/:tbl/:cid/:str', [ validarJWT ] ,busquedaTemasPorCliente );

// router.post('/', [], );

// router.put('/:id',[], );


module.exports = router;