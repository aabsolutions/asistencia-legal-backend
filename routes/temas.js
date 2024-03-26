/*
ruta: /api/temas
*/
const { check } = require('express-validator');
const { Router } = require('express');

const { getTemas, getTemaId, guardarTema, actualizarTema, getTemaCliente, borrarTema } = require('../controllers/temas');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getTemas);
router.get('/:id', validarJWT, getTemaId);
router.get('/cliente/:id', validarJWT, getTemaCliente);


router.post('/',[
    validarJWT,
    check('asunto','El asunto es requerido').not().isEmpty(),
    check('texto','El texto es requerido').not().isEmpty(),
    check('fecha','La fecha es requerida').not().isEmpty(),
    validarCampos, 
] 
,guardarTema);

router.put('/:id',[
    validarJWT,
    check('asunto','El asunto es requerido').not().isEmpty(),
    check('texto','El texto es requerido').not().isEmpty(),
    check('fecha','La fecha es requerida').not().isEmpty(),
    validarCampos
] 
,actualizarTema);
router.delete('/:id', validarJWT, borrarTema);


module.exports = router;