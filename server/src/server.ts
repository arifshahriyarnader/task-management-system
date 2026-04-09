import express from 'express';
import cors from 'cors';
import { appConfig } from './config';
import { connectDatabase } from './shared/database';
import apiRoutes from './apiRoutes';

const app = express();
app.use(cors());
app.use(express.json());

connectDatabase()

app.use("/api/v1",apiRoutes)

app.listen(appConfig.port, () => {
console.log(`Server is running on port ${appConfig.port}`);
});