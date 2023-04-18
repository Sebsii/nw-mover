var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

const UPDATE_INTERVAL = 0.01; // seconds
const MAX_MOVE_SPEED = 20;
var startTime = Date.now();

var things = [
    { x: 128, y: 128, xDir: 0, yDir: 0 },
    { x: 128, y: 128, xDir: 0, yDir: 0 },
    { x: 128, y: 128, xDir: 0, yDir: 0 },
    { x: 128, y: 128, xDir: 0, yDir: 0 },
    { x: 128, y: 128, xDir: 0, yDir: 0 },
]

var updateCounter = 0;

function Update() {
    MoveThings();
    updateCounter++;

    // change direction every second
    if (updateCounter < 1 / UPDATE_INTERVAL) return;
    updateCounter = 0;
    SetThingDirections();
}


function MoveThings() {
    things.forEach(thing => {
        thing.x += thing.xDir;
        thing.y += thing.yDir;
    });
}

// Direction includes the speed of the thing
function SetThingDirections() {
    console.log(`Setting directions after ${Date.now() - startTime} seconds`);
    startTime = Date.now();

    things.forEach(thing => {
        thing.xDir = (Math.random() * 2 - 1) * UPDATE_INTERVAL * MAX_MOVE_SPEED;
        thing.yDir = (Math.random() * 2 - 1) * UPDATE_INTERVAL * MAX_MOVE_SPEED;
    });
}

SetThingDirections();
setInterval(Update, UPDATE_INTERVAL * 1000)

module.exports = {
    app,
    things
};
