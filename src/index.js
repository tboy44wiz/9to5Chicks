import '@babel/polyfill';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from 'morgan';
import router from './routes';
import cron from 'node-cron';
import cronReminder from './config/cron';
import moment from 'moment';

const { NODE_ENV } = process.env;
const app = express();

// Public Folder
app.use(express.static('./public'));

dotenv.config();
if (NODE_ENV === 'development' || NODE_ENV === 'production') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {

  res.status(200).json({
    status: 200,
    message: 'Welcome to 9to5chick API'
  });
});
// app.use('/', express.static('public'));

cronReminder();

/*const dayStart = new Date();
const date = "2021-08-28T23:34:26.468Z"
const time = "2020-09-22T09:04:00.000Z"
const mYear = moment(date).format('DD/MM/YYYY');
const mMonth = moment(date).add(1, 'month').month();
const mDay = moment(date).date();
const mHour = moment(time).format();
const mMinute = moment(time).minute();
console.log(mHour);
// console.log(mYear);
// console.log(mMonth)
// console.log(mDay);
// console.log(mHour);
// console.log(mMinute);*/
console.log(new Date());


app.use('/api', router);

const port = process.env.PORT || 3000;

app.listen(port, () => (
  console.log(`You are now listening to port: ${port}`)
));

export default app;
