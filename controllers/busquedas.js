const { response, request } = require('express');

const Cliente = require('../models/cliente');
const Tema = require('../models/tema');
const Usuario = require('../models/usuario');

const busquedaALL = async(req = request, res = response) => {

    const strBusqueda = req.params.str;
    const strBusquedaRegex = RegExp(strBusqueda,'i');

    try {
        
        const [coincidenciasUsuario, coincidenciasCliente, coincidenciasTema] = await Promise.all([
            Usuario.find({ nombre: strBusquedaRegex },'uid nombre img'),
            Cliente.find({ nombre_completo: strBusquedaRegex },'uid nombre_completo'),
            Tema.find({$or:[{ asunto: strBusquedaRegex },{texto: strBusquedaRegex}]},'uid asunto').populate('cliente','nombre_completo')
        ])
        
        res.json({
            ok: true,
            coincidenciasUsuario,
            coincidenciasCliente,
            coincidenciasTema
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error Busqueda Total: Hable con el administrador'
        })
    }
}

const busquedaColeccion = async(req = request, res = response) => {

    const tabla = req.params.tbl;
    const strBusqueda = req.params.str;
    const strBusquedaRegex = new RegExp(strBusqueda,'i');

    let datosEncontrados = [];

    try {
        switch (tabla) {
            case 'usuarios':
                datosEncontrados = await Usuario.find({ nombre: strBusquedaRegex },'');    
                break;
            case 'clientes':
                datosEncontrados = await Cliente.find({nombre_completo: strBusquedaRegex, estado: true },'')
                                                    .skip(0)
                                                    .limit(5)
                                                    .sort({nombre_completo: 1})
                break;
            case 'temas':
                    // datosEncontrados = await Tema.find({$or:[{ asunto: strBusquedaRegex }]},'')
                    //                                 .populate('cliente','')
                    //                                 .sort({asunto:1, fecha:1})
                    datosEncontrados = await Tema
                    .aggregate(
                        [
                            { $match: { asunto: strBusquedaRegex } },
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
                    );
                    break;
            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'Colección de búsqueda inválida',
                    field: tabla
                });
                break;
        }
        res.json({
            ok: true,
            collection: tabla,
            data: datosEncontrados
        });
                
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const busquedaTemasPorCliente = async(req = request, res = response) => {

    const tabla = req.params.tbl;
    const strBusqueda = req.params.str;
    const cid = req.params.cid;
    const strBusquedaRegex = new RegExp(strBusqueda,'i');

    let datosEncontrados = [];

    try {
        switch (tabla) {
            case 'temas':
                    datosEncontrados = await Tema.find({$or:[{ asunto: strBusquedaRegex, cliente: cid }]},'')
                                                    .populate('cliente','')
                                                    .sort({asunto:1, fecha:1})
                    break;
            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'Colección de búsqueda inválida',
                    field: tabla
                });
                break;
        }
        res.json({
            ok: true,
            collection: tabla,
            data: datosEncontrados
        });
                
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


module.exports = {
    busquedaALL, busquedaColeccion, busquedaTemasPorCliente
}