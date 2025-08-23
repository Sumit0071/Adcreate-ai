import multer, { StorageEngine } from "multer"

const storage:StorageEngine = multer.memoryStorage();

export const singleUpload = multer({storage}).single("file");