const { response } = require('express');

const Tema = require('../models/tema');
const Subtema = require('../models/subtema');

const { validarMongoID } = require('../middlewares/validar-mongoid');

const getSubtemas = async (req, res = response) => {

    const from = Number(req.query.from)||0;
    const limit = Number(req.query.limit)||0;
 
    const [subtemas, total] = await Promise.all([
        Subtema
                .find({},'')
                .populate('tema', '')
                .populate('usuario','')
                .sort({createdAt: 1})
                .skip(from)
                .limit(limit),
                Subtema.countDocuments()
    ]);

    res.json({
        ok: true,
        subtemas,
        total
    });

}

const getSubtemasPorTema = async (req, res = response) => {

    const from = Number(req.query.from)||0;
    const limit = Number(req.query.limit)||0;
    const tema = req.params.id;
 
    const [subtemas, total] = await Promise.all([
        Subtema
                .find({tema},'')
                .populate('tema', 'asunto cliente usuario _id')
                .populate('usuario','nombre')
                .sort({createdAt: 1})
                .skip(from)
                .limit(limit),
                Subtema.countDocuments()
    ]);

    res.json({
        ok: true,
        subtemas,
        total
    });

}

const getSubtemaId = async(req, res  = response) => {
    
    const stid = req.params.id;

    if(!validarMongoID(stid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }

    try {
        const subtema = await Subtema.findById(stid)
                                 .populate('tema', '')
                                 .populate('usuario','');
        if(subtema){
            res.json({
                ok: true,
                subtema
            });
        }else{
            res.status(500).json({
                ok: false,
                msg: 'Subtema no encontrado'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const guardarSubtema = async(req, res = response) => {
    
    const uid = req.uid;
    const tid = req.params.id;

    if(!validarMongoID(tid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }

    const verificaExiste = await Tema.findById(tid);

    if(!verificaExiste){
        return res.status(400).json({
            ok: false,
            msg: 'El tema indicado no existe'
        });
    }

    try {

        const nuevoSubtema = {
            ...req.body,
            tema: tid,
            usuario: uid
        }

        const subtema = new Subtema( nuevoSubtema );
        await subtema.save();

        res.json({
            ok: true,
            subtema,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const actualizarSubtema = async (req, res = response) => {

    const stid = req.params.id;
    const usuario = req.uid;

    const datosNuevoSubtema = new Subtema({
        usuario,
        _id: stid,
        ...req.body
    })

    if(!validarMongoID(stid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }

    try {

        const subtemaDB = await Subtema.findById(stid);

        if(!subtemaDB){
            return res.status(404).json({
                ok: false,
                msg: 'El subtema con el id indicado no existe'
            });
        }

        const subtemaActualizado = await Subtema.findByIdAndUpdate(stid, datosNuevoSubtema, {new: true});

        res.json({
            ok: true,
            subtema: subtemaActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const borrarSubtema = async (req, res = response) => {
    
    const stid = req.params.id;

    if(!validarMongoID(stid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }

    try {

        const subtemaDB = await Subtema.findById(stid);

        if(!subtemaDB){
            return res.status(404).json({
                ok: false,
                msg: 'El subtema con el id indicado no existe'
            });
        }

        await Subtema.findByIdAndDelete(stid);

        return res.status(200).json({
            ok: true,
            msg: 'El subtema de código ' + stid + ' fue eliminado'
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
   
}

module.exports = { getSubtemas, getSubtemasPorTema, getSubtemaId, guardarSubtema, actualizarSubtema, borrarSubtema }