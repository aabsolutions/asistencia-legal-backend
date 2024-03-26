const Cliente = require('../models/cliente');
const Usuario = require('../models/usuario');
const Tema = require('../models/tema');
const Subtema = require('../models/subtema');



const fs = require('fs');

const borrarImgAnterior = ( path ) => {
    if(fs.existsSync(path)){
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async(path, id, fileName)=> {

    let oldPath = '';

    switch (path) {
        case 'clientes':

            const cliente = await Cliente.findById(id);
            if(!cliente){
                return false;
            }else{
                oldPath = `./uploads/clientes/${ cliente.img }`;
                borrarImgAnterior(oldPath);
                cliente.img = fileName;
                await cliente.save();
                return true;
            }

        case 'usuarios':

        const usuario = await Usuario.findById(id);
            
        if(!usuario){
            return false;
        }else{
            oldPath = `./uploads/usuarios/${ usuario.img }`;
            borrarImgAnterior(oldPath);
            usuario.img = fileName;
            await usuario.save();
            return true;
        }

        case 'temas':
            
        const tema = await Tema.findById(id);
            
        if(!tema){
            return false;
        }else{
            oldPath = `./uploads/temas/${ tema.adjunto }`;
            borrarImgAnterior(oldPath);
            tema.adjunto = fileName;
            await tema.save();
            return true;
        }

        case 'subtemas':
            
        const subtema = await Subtema.findById(id);
            
        if(!subtema){
            return false;
        }else{
            oldPath = `./uploads/subtemas/${ subtema.adjunto }`;
            borrarImgAnterior(oldPath);
            subtema.adjunto = fileName;
            await subtema.save();
            return true;
        }
    }    

}

module.exports = { actualizarImagen }