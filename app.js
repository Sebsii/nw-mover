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

const UPDATE_INTERVAL = 0.05; // seconds
const MAX_MOVE_SPEED = 40;
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
        thing.x = (thing.x + 255) % 255; // wrap on over- and underflow
        thing.y += thing.yDir;
        thing.y = (thing.y + 255) % 255;
    });
}

// Direction includes the speed of the thing
function SetThingDirections() {
    console.log(`Setting directions after ${Date.now() - startTime} milliseconds`);
    startTime = Date.now();

    things.forEach(thing => {
        thing.xDir = (Math.random() * 2 - 1) * UPDATE_INTERVAL * MAX_MOVE_SPEED;
        thing.yDir = (Math.random() * 2 - 1) * UPDATE_INTERVAL * MAX_MOVE_SPEED;
    });
}

SetThingDirections();
setInterval(Update, UPDATE_INTERVAL * 1000)

console.log(`Update interval: ${UPDATE_INTERVAL * 1000} ms`)

module.exports = {
    app,
    things
};
