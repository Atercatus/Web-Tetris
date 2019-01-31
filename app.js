const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// ejs 사용위해서
app.set('viwes', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.resolve(__dirname, "public"))); // 정적파일(javascript 및 css) 사용위해서

app.use('/', require('./routes/board'));

app.listen(port, function(){
    console.log('Express server has started on port ' + port);
});