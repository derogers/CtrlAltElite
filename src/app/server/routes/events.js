var express = require('express');
var router = express.Router();
var Event = require('../models/Event');
var Message = require('../models/Message');
var passport = require('passport');

router.post('/createEvent', function (req, res, next) {
  addToDB(req, res);
});

router.post('/removeEvent', function (req, res, next) {
  try {
    Event.findOneAndDelete(
      { _id: req.body.params.id }, {
    }, function (err, doc) {
      if (err) {
        return res.status(500).json({ message: 'Delete event failed' });
      } else {
        return res.status(200).json({ message: 'Deleted event', userObject: doc });
      }
    }
    )
  }
  catch (err) {
    return res.status(500).json({ message: 'Event deletion failed' });
  }
})

router.post('/editEvent', function (req, res, next) {
  try {
    Event.findOneAndUpdate(
    {_id: req.body.eventId }, {
      $set: {
        eventTitle: req.body.editEventTitle,
        date: req.body.editDate,
        startTime: req.body.editStartTime,
        endTime: req.body.editEndTime,
        resources: req.body.editResources,
        description: req.body.editDescription,
        maxPlayers: req.body.editMaxPlayers,
        minPlayers: req.body.editMinPlayers,
        eventCreator: req.body.eventCreator
      }
    }, function (err,doc) {
        if (err) {
          return res.status(500).json({message:'Updating event failed'});
        } else {
          return res.status(200).json({message:'Updated event', eventObject: doc});
        }
      }
    )
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({message:'Updated user failed'});
  }
});

async function addToDB(req, res) {

  var event = new Event({
    eventTitle: req.body.eventTitle,
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    resources: req.body.resources,
    description: req.body.description,
    maxPlayers: req.body.maxPlayers,
    minPlayers: req.body.minPlayers,
    table: req.body.table,
    eventID: req.body.id,
    currentPlayers: [req.body.eventCreator],
    isOpen: true,
    playersIDs: [req.body.eventCreatorID],
    creation_dt: Date.now(),
    eventCreator: req.body.eventCreator,
    messages: []
  });

  try {
    doc = await event.save();
    return res.status(201).json(doc);
  }
  catch (err) {
    return res.status(501).json(err);
  }
}

router.post('/add-message', function (req, res, next) {
  let message = new Message({
    eventID: req.body.eventID,
    author: req.body.author,
    messageContent: req.body.message,
  });

  try {
    doc = message.save();
    return res.status(201).json(doc);
  }
  catch (err) {
    console.log('Error from /add-message: ' + err);
    return res.status(501).json(err);
  }
});

router.get('/events', function(req,res,next){
  Event.find({}, function (err, events) {
    if(err){
      res.send('something went wrong')
      next()
    }
    res.json(events);
  });
});

router.get('/event-puller', function(req,res,next){
  let today = new Date();
  let tomorrow4 = new Date();
  today.setTime(today.getTime() - 1 * 86400000);
  today.setHours(0,0,0,0);
  tomorrow4.setTime(today.getTime() + 5 * 86400000);
  tomorrow4.setHours(0,0,0,0);

  try {
    Event.find(
      {
        date: {"$gt": today, "$lt": tomorrow4}
      }, function (err, events) {
      if(err){
        res.send('something went wrong')
        next()
      }
      res.json(events);
    });

  }
  catch (err) {
    console.log(err);
    return res.status(500).json({message:'The try failed'});
  }
});

router.get('/messages', function (req, res, next) {
  try {
    Message.find(
      {
        eventID: req.query.eventID
      }, function (err, doc) {
      if (err) {
        console.log('Get messages error: ' + err)
        return res.status(500).json({ message: ':(' });
      } else {
        // console.log('Updated password: ' + doc)
        return res.status(200).json({ message: 'Messages found', messagesList: doc });
      }
    }
    )
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Catch error' });
  }
})


router.get('/:eventTitle', (req, res, next) => {
  const eventTitle = req.params.eventTitle
  Event.find(eventTitle)
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided title" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
})

router.get('/:date', (req, res, next) => {
  const date = req.params.date
  Event.find(date)
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided date" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
})

router.post('/join', (req, res) => {
  let join = req.body;
  Event.findOne({_id: join.event}, (err, joinEvent) => {
    if(!joinEvent){
      res.json(join.event + "Not Found")
    }else {
      joinEvent.currentPlayers.push(join.user)
      joinEvent.playersIDs.push(join.userID)
      joinEvent.save()
    }
  })
})

router.post('/leave', (req, res) => {
  let quit = req.body;
  Event.findOne({_id: quit.event}, (err, quitEvent) => {
    if(!quitEvent){
      res.json(quit.event + "Not Found")
    } else {
      if(quitEvent.currentPlayers.indexOf(quit.user) !== -1){
        quitEvent.currentPlayers.splice(quitEvent.playersIDs.indexOf(quit.user), 1);
        quitEvent.playersIDs.splice(quitEvent.playersIDs.indexOf(quit.userID), 1);
        quitEvent.save();
      }
    }
  })
})

function isValidUser(req,res,next){
  if(req.isAuthenticated()) next();
  else {
    return res.status(401).json({message:'Unauthorized Request'})
  };
}

module.exports = router;
