import express from "express";
import cors from "cors";
import UsersRoutes from "./routes/users.routes.js";
import TokensRoutes from "./routes/tokens.routes.js";
import ReserveRoutes from './routes/reserve.routes.js'
import ResourcesRoutes from './routes/resource.routes.js'
import LoanRoutes from './routes/loan.routes.js'
import IntegrationRoutes from './routes/integration.routes.js'

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user/", UsersRoutes);
app.use("/api/tokens/", TokensRoutes);
app.use("/api/booking/", ReserveRoutes);
app.use("/api/resources/", ResourcesRoutes);
app.use("/api/loan/", LoanRoutes);
app.use("/api/integration/", IntegrationRoutes);

app.listen("3000");
console.log("Servidor Iniciado / Puerto 3000");

export default app;