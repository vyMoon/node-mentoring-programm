import express from 'express';
import { userRouter } from './routers/users/users-router';
import { groupsRouter } from './routers/groups/group-router';
import { logger } from './logger/logger';
import { methodsLogger } from './logger/methods-logger';
import { uncaughtExceptionLogger } from './logger/uncaught-exception-logger';
import { unhandledRejectionLogger } from './logger/unhandled-rejection-logger';
import { ApplicationError } from './error/application-error';
import { errorHandler } from './error/error-handler';

const app = express();
const port = 3000;

app.use(express.json());
app.use(methodsLogger);
app.use('/users', userRouter);
app.use('/groups', groupsRouter);
app.use('/', (req, res) => {
    res.status(400).json({
        error: 'Bad request'
    })
});
app.use(errorHandler);

app.listen(port, () => {
    logger.info(`application is listening port ${port}`)
});

process.on('unhandledRejection', unhandledRejectionLogger);
process.on('uncaughtException', uncaughtExceptionLogger);
