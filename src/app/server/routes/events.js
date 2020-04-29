var express = require('express');
var router = express.Router();
var Event = require('../models/Event');
var passport = require('passport');

router.post('/createEvent', function (req, res, next) {
  addToDB(req, res);
});

router.post('/editEvent', function (req, res, next) {
  console.log('Made it to the backend! Event body:');
  console.log(req.body);
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
          console.log('Event edit error: ' + err)
          return res.status(500).json({message:'Updating event failed'});
        } else {
          console.log('Updated profile: ' + doc)
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
    currentPlayers: [],
    isOpen: true,
    playersIDs: [],
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

router.post('/addMessage', function (req, res, next) {
  console.log('/addMessage: Made it to the backend! Event body:');
  console.log(req.body);
  try {
    Event.messages.update(
    {_id: req.body.eventId }, {
      $push: {
        sender : req.body.addMessageSender,
        messageContent : req.body.addMessageContent,
      }
    }, function (err,doc) {
        if (err) {
          console.log('Add message error: ' + err)
          return res.status(500).json({message:'Adding message failed'});
        } else {
          console.log('Add Message: ' + doc)
          return res.status(200).json({message:'Added Message', eventObject: doc});
        }
      }
    )
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({message:'Add message failed'});
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
