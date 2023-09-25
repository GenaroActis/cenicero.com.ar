import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        const { docType } = req.params;
        cb(null, `./src/documents/${docType}`)
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + '--' + file.originalname)
    }
})

export const upload = multer({storage: storage})