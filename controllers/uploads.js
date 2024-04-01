const { response, request } = require("express");
const path = require('path');

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const { actualizarImagen } = require("../helpers/actualizar-imagen");
const { cloudUploadFile } = require('../helpers/cloudinary');

const { validarMongoID } = require("../middlewares/validar-mongoid");

const Cliente = require('../models/cliente');
const Usuario = require('../models/usuario');
const Tema = require('../models/tema');
const Subtema = require('../models/subtema');

const uploadFile = (req = request, res = response) => {

    const type = req.params.type;
    const id   = req.params.id;
    const validPath = ['usuarios','clientes','temas','subtemas'];

    if(!validPath.includes(type)){
        return res.status(400).json({
            ok: false,
            msg: 'Invalid Path: must be usuarios|clientes|temas|subtemas'
        })
    }

    //validar si es id de mongo valido
    if (!validarMongoID(id)) {
        return res.status(400).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        })
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha seleccionado archivo para cargar'
        });
      }

    const file        = req.files.image;
    const splitName   = file.name.split('.');
    const fileExtName = splitName[splitName.length - 1];

    const validFileExtName = ['png','jpg','jpeg','gif','pdf'];

    if(!validFileExtName.includes(fileExtName)){
        return res.status(400).json({
            ok: false,
            msg: 'Extensión de archivo inválida, permitidos: png|jpg|jpeg|gif|pdf'
        })
    }

    const fileName = `${uuidv4()}.${fileExtName}`;

    const storePath = `./uploads/${type}/${fileName}`;

    actualizarImagen(type, id, fileName).then(
        async result => {
            if(result){
                file.mv(storePath, (err) =>{
                    if(err){
                        console.log(err)
                        return res.status(500).json({
                            ok: false,
                            msg: 'Error al mover el archivo'
                        });
                    }     
                });
                const uploadResult = await uploadToCloudinary(id, type, fileName);
                res.json({
                    ok: true,
                    msg: 'Archivo subido corréctamente',
                    fileName,
                    url: uploadResult
                });
            }else{
                return res.status(500).json({
                    ok: false,
                    msg: 'Error: ID no corresponde a ningún registro en la base'
                });
            }        
        });

}

const getImage = ( req, res ) =>{
        
    const type = req.params.type;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${type}/${foto}`);
    
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathNoImg = path.join(__dirname, `../uploads/no-image.jpg`);
        res.sendFile(pathNoImg);
    }

}

const uploadToCloudinary = async (id, type, filename) => {

    const urlFileToUpload = path.join(__dirname, `../uploads/${type}/${filename}`);

    try {

        const uploadResult = await cloudUploadFile(urlFileToUpload, type);

        switch (type) {
            case 'clientes':
                
                await Cliente.findByIdAndUpdate(id,{
                    img_public_id: uploadResult.public_id,
                    img_secure_url: uploadResult.secure_url
                });
    
                return uploadResult.secure_url;
    
            case 'usuarios':
    
                await Usuario.findByIdAndUpdate(id,{
                    img_public_id: uploadResult.public_id,
                    img_secure_url: uploadResult.secure_url
                });
    
                return uploadResult.secure_url;
    
            case 'temas':
               
                await Tema.findByIdAndUpdate(id,{
                    img_public_id: uploadResult.public_id,
                    img_secure_url: uploadResult.secure_url
                });
                return uploadResult.secure_url;
    
            case 'subtemas':
                
                await Subtema.findByIdAndUpdate(id,{
                    img_public_id: uploadResult.public_id,
                    img_secure_url: uploadResult.secure_url
                });
                return uploadResult.secure_url;
        }
        
    } catch (error) {
        console.error(error);
    }    


}

module.exports = {
    uploadFile, getImage
}