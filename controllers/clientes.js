const { request } = require('express');
const { validarMongoID } = require('../middlewares/validar-mongoid');
const Cliente = require('../models/cliente');

const getClientes = async (req, res = response) => {

    const from = Number(req.query.from)||0;
    const limit = Number(req.query.limit)||0;

    const [clientes, total] = await Promise.all([
        Cliente
                .find({estado: true},'')
                .skip(from)
                .limit(limit)
                .sort({nombre_completo: 1}),
        Cliente.countDocuments()
    ]);

    res.json({
        ok: true,
        clientes,
        total
    });

}

const getClienteId = async(req, res  = response) => {
    
    const cid = req.params.id;

    try {
        const cliente = await Cliente.findById(cid)
                               .populate('usuario','nombre img');

        res.json({
            ok: true,
            cliente
        });
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Cliente no encontrado'
        });
    }
}

const guardarCliente = async(req = request, res = response) => {
  
    const uid = req.uid;
    const datosNuevoCliente = new Cliente({
        usuario: uid,
        ...req.body
    })

    const { cedula } = req.body;
    
    try {

        const verificaExiste = await Cliente.findOne({cedula});

        if(verificaExiste){
            return res.status(400).json({
                ok: false,
                msg: 'La cédula ingresada ya está registrada'
            });
        }

        const cliente = new Cliente( datosNuevoCliente );

        await cliente.save();

        res.json({
            ok: true,
            cliente
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al guardar registro...'
        });
    }
}

const actualizarCliente = async (req, res = response) => {

    const cid = req.params.id;
    const usuario = req.uid;
    
    if(!validarMongoID(cid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }

    try {

        const clienteDB = await Cliente.findById(cid);

        if(!clienteDB){
            return res.status(404).json({
                ok: false,
                msg: 'El cliente con el Id indicado no existe'
            });
        }

        const { cedula, ...campos } = req.body;

        if(clienteDB.cedula !== cedula){
            
            const existeCedula = await Cliente.findOne({cedula});
            
            if(existeCedula){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un cliente con la cedula a actualizar'
                })
            }
        }

        const datosClienteActualizar = { cedula, ...campos, usuario };
        const clienteActualizado = await Cliente.findByIdAndUpdate(cid, datosClienteActualizar, {new: true});


        res.json({
            ok: true,
            cliente: clienteActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const eliminarCliente = async (req, res = response) => {

    const cid = req.params.id;
    const uid = req.uid;

    if(!validarMongoID(cid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }

    try {

        const clienteDB = await Cliente.findById(cid);

        if(!clienteDB){
            return res.status(404).json({
                ok: false,
                msg: 'El cliente con el id indicado no existe'
            });
        }

        const clienteActualizado = await Cliente.findByIdAndUpdate(cid, {estado: false, usuario: uid}, {new: true});

        res.json({
            ok: true,
            cliente: clienteActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

module.exports = { 
    getClientes,
    getClienteId, 
    guardarCliente, 
    actualizarCliente, 
    eliminarCliente
};