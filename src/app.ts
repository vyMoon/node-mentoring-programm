import express from 'express';
import { userRouter } from './user/user-router';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/user', userRouter);
app.use('/', (req, res) => {
  res.status(400).json({
    error: 'Bad request'
  })
})

app.listen(port, () => {
  console.log(`application is listening port ${port}`)
});
