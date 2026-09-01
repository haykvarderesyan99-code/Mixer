import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); 

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, '../../data', process.env.DB_NAME || 'database.sqlite'),
    logging: false
});