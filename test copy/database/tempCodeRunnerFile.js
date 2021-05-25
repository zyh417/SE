console.log(global.dbHandel.getModel('userM'));

User=global.dbHandel.getModel('userM');
User.create({ 							// 创建一组user对象置入model
    name: "uname",
    password: "123"
});
