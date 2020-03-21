var express = require('express');
var router = express.Router();
var Event = require('../models/Event');
var passport = require('passport');

router.post('/createEvent', function (req, res, next) {
  addToDB(req, res);
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
    currentPlayers: [],
    isOpen: true,
    creation_dt: Date.now()
  });

  try {
    doc = await event.save();
    return res.status(201).json(doc);
  }
  catch (err) {
    return res.status(501).json(err);
  }
}

router.get('/events', function(req,res,next){
  Event.find({}, function (err, events) {
    if(err){
      res.send('something went wrong')
      next()
    }
    res.json(events);
  });
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

module.exports = router;