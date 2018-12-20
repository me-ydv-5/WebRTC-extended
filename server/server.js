const express = require('express');
const app = express();
const request = require('request')
const path = require('path');
const port = process.env.PORT || 5000;
const ejs = require('ejs')

function handleFail(err){
  console.log("Error : ", err);
}

//Static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));

// //production mode
// if(process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'client/build')));
//   //
//   app.get('*', (req, res) => {
//     res.sendfile(path.join(__dirname = 'client/build/index.html'));
//   })
// }

app.post("/getVerified", (req, res) => {
  var POST = {};
  req.on('data', function(data) {
     POST = JSON.parse(data);
     console.log(POST);
     var options = {
           uri: 'https://www.google.com/recaptcha/api/siteverify',
           headers:{
              'content-type' : 'application/x-www-form-urlencoded'
           },
           body: require('querystring').stringify({
              secret: '6LdSmH8UAAAAAH7Gcm5hDTWD2dqLVR95WEVqoS75',
              response: POST['response']
           })
     };
     console.log("POST IS ", POST)
     request.post(options, (err, response, body) => {
        if (err){
           console.log("Error occured while calling captcha url: ", err);
        }else{
          console.log(body)
           var body = JSON.parse(body);
           if(body['success'] !== true){
              console.log('Error in processing captcha! Entry Denied.');
            //   ejs.renderFile("./404.ejs", {code: response.statusCode, 
            //      string: "Psst! Some problem has occured!"},
            //      {client: true},(err, str) =>{
            //         if(err)
            //            console.log(err);
            //         else{
            //            res.render(str);
            //         }
            //      });
           }else{
              console.log(POST);
              channelName = POST['channelName'];
              console.log("POST channel name "+ channelName);
              res.send({success: true});
           }
        }
     });
  });
}, handleFail);

const IP = 'https://young-falls-63578.herokuapp.com'
//start server
if(process.env.NODE_ENV === 'production')
  app.listen(port, IP, (req, res) => {
    console.log( `server listening on port: ${port} and HOST ${IP}`);
  })
else app.listen(port, (req, res) => {
    console.log("Server listening on port: ", port);
})