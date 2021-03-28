import express from 'express';
import { Request, Response } from 'express';
import { userRouter } from './user/user-router';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/users', userRouter);
app.use('/', (req: Request, res: Response) => {
    res.status(400).json({
        error: 'Bad request'
    })
})

app.listen(port, () => {
    console.log(`application is listening port ${port}`)
});
