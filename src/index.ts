import express from "express" ;
import type { Express, Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient } from '@prisma/client';
import type { Todo } from "./types/Todo";
import { handlePrismaError } from "./handler/PrismaErrorHandler";
import cors from "cors";
import moment from "moment";
import { FRONT_URL } from "./consistants/url";

const prisma = new PrismaClient();
const app: Express = express();
const PORT = 8080;
const corsOptions = {
    origin: FRONT_URL,
};

const myLogger = (req: Request, res: Response, next: NextFunction) => {
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    const accessLog = `${now}:${req.method} ${req.path} ${req.ip}`;
    console.log(accessLog);
    next();
};

app.use(myLogger);
app.use(express.json());
app.use(cors(corsOptions));

app.get("/alltodos", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const allTodos: Todo[] = await prisma.todo.findMany();
        return res.json(allTodos);
    } catch (e) {
        next(e);
    }
});

app.post("/createtodo", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { title, isCompleted } = req.body;
        const createTodo = await prisma.todo.create({
            data: {
                title: title,
                isCompleted: isCompleted,
            },
        });
        return res.json(createTodo);
    } catch (e) {
        next(e);
    }
});

app.put("/updatetodo", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const _todo:Todo = req.body;
        const updatedTodo = await prisma.todo.update({
            where: {
                id: _todo.id
            },
            data: {
                title: _todo.title,
                isCompleted: _todo.isCompleted,
            },
        });
        return res.json(updatedTodo);
    } catch (e) {
        next(e);
    }
});


app.delete("/deletetodo", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id:number = req.body.id;
        const deletedTodo:Todo = await prisma.todo.delete({
            where: {
                id
            }
        });
        return res.json(deletedTodo);
    } catch (e) {
        next(e);
    }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    handlePrismaError(err, req, res, next);
});

app.listen(PORT, () => console.log("server is running!!!"));