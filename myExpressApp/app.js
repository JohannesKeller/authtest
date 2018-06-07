var createError = require('http-errors');
const request = require('request');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
// app.use(cors());
app.options('*', cors())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hallo Welt!\n');
    var cors = "";
    
    
    
  }).listen(1337, "127.0.0.1");

  getPrevMatches();
  function getPrevMatches() {
    request({
        uri: 'https://felix.hs-furtwangen.de/restapi/repo/courses/96536472673363',
        json: true
    }, function(error, response, body){
        if (response.statusCode === 200){
        }else{

          console.log("nice");
          request({
            uri: 'https://felix.hs-furtwangen.de/shib/',
            json: true
        }, function(error, response, body){
            if (response.statusCode === 200){
                // console.log(response);
                var dataXML = response["body"];
                var input = $("input", dataXML);
                var relayState;
                var samlRequest;
                var attrs = [];
                input.each(function () {
                  //console.log($(this).attr("value"));
                  attrs.push($(this).attr("value"));

                });
                var relayState = attrs[0];
                var samlRequest = attrs[1];
          
                 console.log(samlRequest);
                console.log(relayState);

                var data = '{data" {"RelayState":'+relayState+',"SAMLRequest":'+samlRequest+"}}";
              //  var json_obj = JSON.parse(data);
                
                request.post({
                  headers: {"Authorization": "Basic YmVja2VydGg6UzlDWjhFUkE=",'Content-Type': 'application/x-www-form-urlencoded'},
                  url: 'https://idp2.hs-furtwangen.de/idp/profile/SAML2/POST/SSO',
                  // data: {"RelayState": relayState,"SAMLRequest": samlRequest,},
                  form:    data
                  
                   }, function(error, response, body){
                      console.log(response["body"]);
                      var dataXML = $.parseXML(response);
                      var samlResponse;
                      var input = $("input", dataXML);
                      var attrs1 = [];        
                      input.each(function(){
                        attrs1.push($(this).attr("value"))
                      });
                      var samlResponse = attrs1[1];

                      console.log(samlResponse);








              });
    
    
                
            }
            // Do error handling here!
        });

          
        }







        // Do error handling here!
    });
}





  
  

  // return false;
  
  
  console.log("hallo");
  $.ajax({
    url: cors + "https://felix.hs-furtwangen.de/restapi/repo/courses/96536472673363",
    method: "GET",
    headers: {
      "Authorization": "Basic YmVja2VydGg6UzlDWjhFUkE=",
      "Access-Control-Allow-Credentials": "true"
      //beckerth: Basic YmVja2VydGg6UzlDWjhFUkE= /  beckerth.hfu: Basic YmVja2VydGguaGZ1OlJlc3QjMjAxNw==
    }
  }).fail(function (data) {
    // console.log(data);
    console.log("hallo");
    
    return false;
        
        
        //Start der Shibboleth-Authentifizierung
        $.ajax({
          url: "https://felix.hs-furtwangen.de/shib/",
          method: "GET"
          
          
          
          
          // headers: {
            //     "Authorization": "Basic YmVja2VydGg6UzlDWjhFUkE=",
            //     "username": "beckerth",
            //     "password": "S9CZ8ERA"
            //   }
          }).done(function (data) {
            console.log("hallo");
          // console.log(data);
          var dataXML = $.parseXML(data);
          var input = $("input", dataXML);
          var relayState;
          var samlRequest;
          var attrs = [];
          input.each(function () {
            //console.log($(this).attr("value"));
            attrs.push($(this).attr("value"));
          })
          var relayState = attrs[0];
          var samlRequest = attrs[1];
          
          // console.log(samlRequest);
          // console.log(relayState);
          
          
          
    
          //SAMLRequest per POST verschicken
          $.ajax({
            url: cors + "https://idp2.hs-furtwangen.de/idp/profile/SAML2/POST/SSO",
            method: "POST",
            headers: {
              "Authorization": "Basic YmVja2VydGg6UzlDWjhFUkE=",
              'Content-Type': 'application/x-www-form-urlencoded'
              
            },
            data: {
              "RelayState": relayState,
              "SAMLRequest": samlRequest,
            },
            contentType: "application/x-www-form-urlencoded"
            
          })
          .done(function(data){
            var dataXML = $.parseXML(data);
            var samlResponse;
            var input = $("input", dataXML);
            var attrs1 = [];        
            input.each(function(){
              attrs1.push($(this).attr("value"))
            });
            var samlResponse = attrs1[1];
            // console.log(data);
            //console.log(samlResponse);
            // console.log(data);
            //console.log(dataXML);
            
    
    
    
    
            //SAMLResponse per POST verschicken
            $.ajax({
              url: cors + "https://felix.hs-furtwangen.de/Shibboleth.sso/SAML2/POST",
              method: "POST",
              headers: {"Authorization": "Basic YmVja2VydGg6UzlDWjhFUkE="}, //YmVja2VydGg6UzlDWjhFUkE=
              data: {
                "SAMLResponse": samlResponse
              }
            })
            .done(function(data){
              // console.log(data);
              
              
            
              
              //Authentifizierung abschließen
              $.ajax({
                url: cors + "https://felix.hs-furtwangen.de/shib/",
                method: "GET",
                headers: {"Authorization": "Basic YmVja2VydGg6UzlDWjhFUkE="}
                
              }).done(function(data){
    
    
    
    
    
                var cors = "";
                $.ajax({
                  url: cors + "https://felix.hs-furtwangen.de/restapi/repo/courses/96536472673363",
                  method: "GET",
                  headers: {"Authorization": "Basic YmVja2VydGg6UzlDWjhFUkE="},
                  // beforeSend: function( xhr ) {
                    //   xhr.setRequestHeader("Authorization", "Basic YmVja2VydGg6UzlDWjhFUkE=");
                    //        },
                    // beforeSend: function( xhr ) {
                      //   xhr.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With");
                      //        },
                      
                    }).done(function(data){
                      // console.log(data);
                      console.log("top");
                    }).fail(function (data) {
                      // console.log(data);
                      console.log("flop");
                    });
                    
                
              })
              
            })
            
            
          })   
        });
      });


console.log('Server running at http://127.0.0.1:1337/');

module.exports = app;
