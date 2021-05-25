var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var session = require('express-session');
var models = require("./models");


global.dbHandel = require('./dbHandel');
global.db = mongoose.connect("mongodb://localhost:27017/testdb");

console.log(global.dbHandel.getModel('userM'));

User=global.dbHandel.getModel('userM');
User.create({ 							// 创建一组user对象置入model
    name: "ppp",
    password: "123"
});


