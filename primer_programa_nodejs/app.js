
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var edge = require('edge');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/users', user.list);

app.get('/blog/:id', function(req,res){ // accede a `/blog/id-largo` pero no a `/blog/id-largo/otro-di'
  var id = req.params.id; // accede al id que se ha requerido
  console.log('Id : ' + id);
  res.json({Mensaje:'hola ' + id});
})

app.get('/u/:id/mensajes.:format', function(req,res){
  var id = req.params.id;
  var format = req.params.format;
  if (format === 'json'){
    res.json({status:200, id:id});
  } else {
    res.json({status:500});
  }
});

//Test 1 c# hello world
var helloWorld = edge.func('async (input) => { return ".NET Welcomes " + input.ToString(); }');

helloWorld('JavaScript', function (error, result) {
    if (error) throw error;
    console.log(result);
});

//Test 2 c# Sum /lambda
var add7 = edge.func('async (input) => { return (int)input + 7; }');

add7(20, function (error, result) {
    if (error) throw error;
    console.log(result);
});

//Test 3 c# class
var add8 = edge.func(function() {/*
    using System.Threading.Tasks;

    public class Startup
    {
        public async Task<object> Invoke(object input)
        {
            int v = (int)input;
            return (int)input + 8;
        }
    }

*/});

add8(20, function (error, result) {
    if (error) throw error;
    console.log(result);
});

//Test 4 c# class with external library
var add9 = edge.func(function() {/*

    //#r "System.Data.dll"

    using System.Data;
    using System.Threading.Tasks;

    public class Startup
    {
        public async Task<object> Invoke(object input)
        {
            int v = (int)input;
            return (int)input + 9;
        }
    }
*/});

add9(20, function (error, result) {
    if (error) throw error;
    console.log(result);
});

//Test 5 c# class with external library (other way)
var add10 = edge.func({
    source: function() {/*

        using System.Data;
        using System.Threading.Tasks;

        public class Startup
        {
            public async Task<object> Invoke(object input)
            {
				int v = (int)input;
				return (int)input + 10;
            }
        }
    */},
    references: [ 'System.Data.dll' ]
});

add10(20, function (error, result) {
    if (error) throw error;
    console.log(result);
});

//Test 6 dll library c# with breakpoint in dll (Attach node process)
var getData = edge.func('Edge.Sample.dll');



app.get('/getData', function(req,res){

	getData(null, function (error, result) {
		if (error) throw error;
		console.log(result);
		res.json({Result:result});
	});
    
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
