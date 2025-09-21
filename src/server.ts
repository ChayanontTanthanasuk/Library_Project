import express, { Application, Request, Response } from "express";


const app: Application = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
