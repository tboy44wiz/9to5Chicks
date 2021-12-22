// const year = 2020
// const month = 9
// const day = 5

const cronTasks = [
  { 
    id: 1,
    text: 'no 1',
    type: 'achiever',
    year: '2020',
    month: 8,
    day: 5,
    hour: 15,
    minute: 24
  },
  { 
    id: 2,
    text: 'no 2',
    type: 'star',
    year: '2020',
    month: 8,
    day: 5,
    hour: 14,
    minute: 15
  },
  { 
    id: 3,
    text: 'no 3',
    type: 'achiever',
    year: '2020',
    month: 8,
    day: 5,
    hour: 14,
    minute: 53
  }
]

var date = new Date(2020, 8, 5, 15, 23, 0);
//var date2 = new Date(2020, 8, 5, 15, 4, 0);

var j = schedule.scheduleJob(date, function(){
  console.log('The world is going to end today.');
  const find = cronTasks.filter(item => item.year === '2020');
  if(find.length){
    const find2 = find.filter(item => item.month === 8)
    if(find2.length){
      const find3 = find2.filter(item => item.day === 5);
      if(find3.length){
        for(let i=0; i < find3.length; i++){
          var date2 = new Date(2020, 8, 5, 14, find3[i].minute, 0);
          schedule.scheduleJob(date2, function(){
            console.log('send mails.');
            
          });
        }
      }
    }
  }
});

mailRoute.post(
  '/start_cron',
  // TokenHelper.verifyAdminToken('admin'),
  (req, res) => {
    console.log('start cron')
    var date = new Date(2020, 8, 5, 15, 24, 0);
    schedule.scheduleJob(date, function(){
      console.log("---------------------");
      console.log("Running Cron Job");
      console.log('send mail at 2:35');
    });
    return res.status(200).json({message: 'cron started'}); 
  }
);