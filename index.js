var http = require('http'),
	fs = require('fs'),
	url = require('url'),
	path = require('path'),
	events = require('events'),
	jade = require('jade'),
	mime = require('mime'),
	server;

/**
*	File opener
*	@param file | file to open
*	@param callback | callback to fire when done
*/
var openFile = function(file, callback){
	fs.readFile(file, callback);
};

/**
*	Render the jade string with JSON if there is some
*	@param file | file to render
*	@param obj | JSON if there is any
*	@return the jade template
*/
var renderFile = function(file, obj){
	var fn = jade.compile(file);
	return fn(obj || {});
};

/**
*	Quick funciton to end eary
*	@param res | res object
*	@param errCode | statuscode of response
*	@param msg | optional, message to send if any
*/
var abort = function(res, errorCode, msg){
	res.statusCode = errorCode;
	res.end(msg || '');
	process.removeAllListeners('uncaughtException');
};

/**
*	Finish off a response without any JSON
*	@param res | response object
*	@param file | jade string
*/
var sendWithoutJSON = function(res, file){
	file = renderFile(file);
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', file.length);
	res.write(file);
	res.end();
	process.removeAllListeners('uncaughtException');
};

/**
*	Finish off with a response
*	@param res | response object
*	@param file | jade string
*	@param JSONpath | path to JSON string (not an object yet)
*/
var sendWithJSON = function(res, file, JSONpath){
	openFile(JSONpath, function(err, JSONfile){
		var obj;
		if(err){
			abort(res, 500, 'Could not get JSON file');
			return false;
		};
		
		try {
			obj = JSON.parse(JSONfile);
		} catch(e){
			abort(res, 500, 'The JSON file was invalid');
			return false;
		};
		
		file = renderFile(file, obj);
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.write(file);
		res.end();
		process.removeAllListeners('uncaughtException');
	});
};

/**
*	Send the template with a JS file
*	@param res | response object
*	@param file | jade file
*	@param JSpath | path to js file to use
*/
var sendWithJS = function(res, file, JSpath){
	var js, file;
	try {
		js = require('./'+JSpath);
	} catch(e){
		abort(res, 500, 'Trouble getting the JS file');
		return false;
	};

	file = renderFile(file, js);
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', file.length);
	res.write(file);
	res.end();
	process.removeAllListeners('uncaughtException');
};

/**
*	serverHandler
*	@param req | request object
*	@param res | response object
*/
var serverHandler = function(req, res){
	
	var urlInfo = url.parse(req.url),
		query = {},
		path = urlInfo.pathname.slice(1, urlInfo.pathname.length),
		eventer = new events.EventEmitter();
		
	// if you liked it then you should have put a mime on it
	res.mime = mime.lookup(path);

	/**
	*	Parse the query string if there is one
	*/
	if(urlInfo.query){
		var queryBase = urlInfo.query.split('&'),
			subQuery;
		for(var i = 0, len = queryBase.length; i<len; i++){
			subQuery = queryBase[i].split('=');
			query[subQuery[0]] = subQuery[1];
		};
	};
	
	/**
	*	Watch for errors
	*	Stop watching for errors when we find one
	*/
	process.on('uncaughtException', function(err){
		abort(res, 500, err.stack);
	});
	
	/**
	*	Try and get the file
	*/
	openFile(path, function(err, file){
		err ? abort(res, 404, 'Cannot find file \n') : eventer.emit('checkJade', file);
	});
	
	/**
	*	Check to see if the url is for a jade file
	*	Gotta serve them static files also
	*/
	eventer.on('checkJade', function(file){
		res.mime === 'application/octet-stream' && urlInfo.pathname.match('.jade') ? 
			eventer.emit('fileIsJade', file) :
			eventer.emit('fileIsNotJade', file);
	});
	
	/**
	*	Just send a file
	*/
	eventer.on('fileIsNotJade', function(file){
		res.statusCode = 200;
		res.setHeader('Content-Length', file.length);
		res.setHeader('Content-Type', res.mime);
		res.end(file);
		process.removeAllListeners('uncaughtException');
	});
	
	/**
	*	Render that thing
	*/
	eventer.on('fileIsJade', function(file){
		if(query && query.json){
			sendWithJSON(res, file, query.json);
		} if(query && query.js){
			sendWithJS(res, file, query.js);
		} else {
			sendWithoutJSON(res, file);
		};
	});
};

/**
*	Make that server and listen to that thing
*/
server = http.createServer(serverHandler);
server.listen(3000);
console.log('QuickyJade listening on port 3000');
