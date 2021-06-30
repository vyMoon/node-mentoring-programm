import express from 'express';
import timeout from 'connect-timeout'
import { userRouter } from './routers/users/users-router';
import { groupsRouter } from './routers/groups/group-router';
import { logger, getTime } from './logger/logger';
import { methodsLogger } from './logger/methods-logger';
import { uncaughtExceptionLogger } from './logger/uncaught-exception-logger';
import { unhandledRejectionLogger } from './logger/unhandled-rejection-logger';
import { ApplicationError } from './error/application-error';
import { errorHandler } from './error/error-handler';
import { login, authGuard } from './authorisation/login';

const app = express();
const port = 3000;

app.use(express.json());
app.use(timeout('5s'));
app.use(methodsLogger);
app.post('/login', login);
app.use('/users', authGuard, userRouter);
app.use('/groups', authGuard, groupsRouter);
app.use('/', (req, res) => {
    throw new ApplicationError(400, 'Bad Request');
});
app.use(errorHandler);

app.listen(port, () => {
    logger.info(`${getTime()} application is listening port ${port}`)
});

process.on('unhandledRejection', unhandledRejectionLogger);
process.on('uncaughtException', uncaughtExceptionLogger);
