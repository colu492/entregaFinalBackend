import multer from "multer";

// Configuración del almacenamiento para Multer
const storage = multer.diskStorage({
    destination: (_req, file, cb) => {
        // Determinar la carpeta de destino según el nombre del campo del formulario
        let destinationFolder
        if (file.fieldname === 'profileImage') {
            destinationFolder = './src/public/profiles';
        } else if (file.fieldname === 'productImage') {
            destinationFolder = './src/public/products';
        } else if (file.fieldname === 'identificacion' || file.fieldname === 'domicilio' || file.fieldname === 'compruebaCuenta') {
            destinationFolder = './src/public/documents'
        }

        cb(null, destinationFolder);
    },
    filename: (_req ,file ,cb) => {
        // Crear un nuevo nombre de archivo combinando el nombre del campo y el nombre original del archivo
        const fieldName = file.fieldname;
        const originalName = file.originalname;
        const newName = `${fieldName}_${originalName}`
        cb(null, newName)
    }
})

// Configuración de Multer con la opción de almacenamiento personalizado
const upload = multer({storage: storage})

export {upload}