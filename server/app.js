let app = require('express')();
let userRouter = require('./Router/User.router');
app.use('/', userRouter);

const PORT = 3000;
app.listen(PORT, function (err) {
    if (err) {
        console.log('No!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    }
    else {
        console.log('Connected: ' + PORT);
    }
});



module.exports = app;
