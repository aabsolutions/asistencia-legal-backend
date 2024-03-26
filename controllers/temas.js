const { request } = require('express');
const { validarMongoID } = require('../middlewares/validar-mongoid');

const Tema = require('../models/tema');


const getTemas = async (req, res = response) => {

    const [temas, total] = await Promise.all([
        Tema
                .aggregate(
                            [
                                {
                                $lookup: {
                                    from: 'clientes',
                                    localField: 'cliente',
                                    foreignField: '_id',
                                    pipeline: [{ $match: { estado: true } }],
                                    as: 'cliente'
                                }
                                },
                                { $unwind: { path: '$cliente' } },
                                { $sort: { createdAt: -1 } }
                            ],
                        ),
        Tema.countDocuments()
    ]);
    
    res.json({
        ok: true,
        temas,
        total
    });

}

const getTemaId = async(req, res  = response) => {
    
    const tid = req.params.id;

    if(!validarMongoID(tid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id del tema enviado no es válido'
        });
    }

    try {
        const tema = await Tema.findById(tid)
                .sort({createdAt: 1})
                .populate('cliente','nombre_completo')
                .populate('usuario','nombre img');

        res.json({
            ok: true,
            tema
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: true,
            msg: 'Tema no encontrado'
        });
    }
}

const getTemaCliente = async(req, res  = response) => {
    
    const cid = req.params.id;

    if(!validarMongoID(cid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id del cliente enviado no es válido'
        });
    }

    try {       
        const [temas, total] = await Promise.all([
            Tema
                    .find({'cliente':cid},'')
                    .sort({createdAt: 1})
                    .populate('cliente','nombre_completo')
                    .populate('usuario','nombre img'),
            Tema.countDocuments()
        ]);
   
        res.json({
            ok: true,
            total,
            temas
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: true,
            msg: 'Tema no encontrado'
        });
    }
}

const guardarTema = async(req = request, res = response) => {
  
    const uid = req.uid;
   
    try {

        const datosNuevoTema = new Tema({
            usuario: uid,
            ...req.body
        })
        
        const tema = new Tema( datosNuevoTema );

        await tema.save();

        res.json({
            ok: true,
            tema
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al guardar registro...'
        });
    }
}

const actualizarTema = async (req, res = response) => {

    const tid = req.params.id;
    const usuario = req.uid;
    
    if(!validarMongoID(tid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id del tema enviado no es válido'
        });
    }

    try {

        const temaDB = await Tema.findById(tid);

        if(!temaDB){
            return res.status(404).json({
                ok: false,
                msg: 'El tema con el Id indicado no existe'
            });
        }

        const { ...campos } = req.body;

        const datosTemaActualizar = { ...campos, usuario };
        const temaActualizado = await Tema.findByIdAndUpdate(tid, datosTemaActualizar, {new: true});


        res.json({
            ok: true,
            grado: temaActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const borrarTema = async (req, res = response) => {
    
    const tid = req.params.id;

    if(!validarMongoID(tid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }

    try {

        const temaDB = await Tema.findById(tid);

        if(!temaDB){
            return res.status(404).json({
                ok: false,
                msg: 'El tema con el id indicado no existe'
            });
        }

        await Tema.findByIdAndDelete(tid);

        return res.status(200).json({
            ok: true,
            msg: 'El tema de código ' + tid + ' fue eliminado'
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
   
}

module.exports = { 
    getTemas,
    getTemaId,
    getTemaCliente,
    guardarTema, 
    actualizarTema,
    borrarTema
};