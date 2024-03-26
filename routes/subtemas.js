/*
ruta: /api/subtemas
*/
const { check } = require('express-validator');
const { Router } = require('express');

const { getSubtemas, getSubtemaId, guardarSubtema, getSubtemasPorTema, actualizarSubtema, borrarSubtema } = require('../controllers/subtemas');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getSubtemas);
router.get('/:id', validarJWT, getSubtemaId);
router.get('/tema/:id', validarJWT, getSubtemasPorTema);


router.post('/:id',[
    validarJWT,
    check('asunto','El asunto es requerido').not().isEmpty(),
    check('texto','El texto es requerido').not().isEmpty(),
    check('fecha','La fecha es requerida').not().isEmpty(),
    validarCampos, 
] 
,guardarSubtema);

router.put('/:id',[
    validarJWT,
    check('asunto','El asunto es requerido').not().isEmpty(),
    check('texto','El texto es requerido').not().isEmpty(),
    check('fecha','La fecha es requerida').not().isEmpty(),
    validarCampos
] 
,actualizarSubtema);
router.delete('/:id', validarJWT, borrarSubtema);

module.exports = router;