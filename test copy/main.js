const express=require('express');
const static=require('express-static');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const bodyParser=require('body-parser');
const multer=require('multer');
const consolidate=require('consolidate');
const mysql=require('mysql');

const db=mysql.createPool({
  host:'localhost',
  user:'root',
  password:'158298232',
  database:'blog'
});

var server=express();

server.listen(3000,function(err){
  if(!err){
    console.log('server is listening 3000 port');
  }else{
    console.log(err);
  }
});
app.set('views', path.join(__dirname, 'views'));
app.engine("html",require("ejs").__express); // or   app.engine("html",require("ejs").renderFile);
//app.set("view engine","ejs");
app.set('view engine', 'html');

//当客户端访问根目录即主页面的时候,渲染首页的内容给用户

//处理facivon.ico
server.get('/favicon.ico',function(req,res){});

//因为处理同一个页面,如果不断的嵌套会显得很混乱,所以这里使用express的链式操作next
//这里的get处理banners的图片
server.get('/',function(req,res,next){
  //当用户访问主页面即'/'的时候,我们先从数据库里读取banners图片的数据
  db.query('SELECT * FROM banner_table',function(err,data){
    if(err){
      res.send('ERROR');
    }else{
      //我们把数据库读取出来的数据加在res的banners参数上
      //res表示返回给客户端的
      //因此客户端可以取得数据库的数据
      console.log(data);
      res.banners=data;
      //处理完后前往下一个链式操作
      next();
    }
  });
});
//这里的get处理文章的id,读取文章的id
//本质来说服务器如何渲染文件取决于客户端如何给服务器发送请求
//因此服务器需要返回各种信息给客户端来使用
server.get('/',function(req,res,next){
  db.query('SELECT id,title,summary FROM article_table',function(err,data){
    if(err){
      console.log(err);
    }else{
      //把数据库取得的data数据加在res的articles参数上
      res.articles=data;
      //前往下一个链式操作
      next();
    }
  });
});
//最后一个链式操作
server.get('/',function(req,res){
  //response即返回给客户端的文件是渲染后的index.ejs文件
  res.render('index.ejs',{
    //这里给客户端返回的json上有数据
    //banners上是数据库banners_table的数据
    //articles上是数据库article_table的数据
    banners:res.banners,
    articles:res.articles
  });
});

//如果客户端没有点a标签即没有请求这个/article页面,那这边是不会执行的
//假设客户端有人点了a标签
//a标签请求,并且会带着id
//于是需要处理对/article的请求
server.get('/article',function(req,res){
  //判断req上是否真的有id值
  //如果req有id值则查询数据库,如果没有就向客户端返回错误
  if(req.query.id){
    //查询数据库,这边用了字面量字符串,需要用反单引号(1旁边的那个)括起来
    //这句sql语句的意思是把这个id值的所有数据都选出来
    db.query(`SELECT * FROM article_table WHERE id=${req.query.id}`,function(err,data){
      console.log(data);
      // 如果有错就返回错误
      if(err){
        console.log(err);
      }else{
        // 没有的话判断一下数据库里有没有这个数据
        // 如果数据库里都是空的,那就返回错误,说明没有内容
        if(data.length==0){
          res.status(404).send(err).end();
        }else{
          // 如果数据库里有内容就渲染出来
          res.render('conText.ejs',{
            // 这边的data就一个数据,所以直接返回了,用data[0]
            article_data:data[0]
          });
        }
      }
    });
  }else{
    res.status(404).send(err).end();
  }
});

server.use(static('./www'));