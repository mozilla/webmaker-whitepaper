// hat-tip to [Kent Brewster](https://gist.github.com/kentbrew), mod to allow 
// commandline usage: `node server.js {port} {rootdir}`

// hey, everybody! it's a tiny Web server!

// INSTALL: `npm install mime colors`

// instead of a bunch of foo = reqire("foo")
// list our required modules and loop through
var r = [ "fs", "http", "mime", "path", "url", "colors" ];
for (var i = 0; i < r.length; i++) {
	global[r[i]] = require(r[i]);
}

// some constants
var option = {
	"port": process.argv[2] || 8000,
	"dir": process.argv[3] || "./",
	"grunt": process.argv[4] || false
};

// the main thing
var server = http.createServer( function(request, response) {
	// extract the pathname from the request URL
	var pathname = url.parse(request.url).pathname;
	
	// add the home directory, /public or whatever
	var filename = path.join(process.cwd(), option.dir, pathname);
	
	// if the requested path has no file extension, assume it's a directory
	// caution: if you are shipping an API, this is the wrong thing to do
	if (!path.extname(filename)) {
		filename = filename + '/index.html';
	}
	
	// does this path exist?
	fs.exists(filename, function(gotPath) {
		// no, bail out
		if (!gotPath) {
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found");
			response.end();
			console.warn('[server] '.cyan + '[404] '.red + request.url.red);
			return;
		}

		// still here? filename is good
		// look up the mime type by file extension
		response.writeHead(200, {'Content-Type': mime.lookup(filename)});
		
		// read and pass the file as a stream. Not really sure if this is better,
		// but it feels less block-ish than reading the whole file
		// and we get to do awesome things with listeners
		fs.createReadStream(filename, {
			'flags': 'r',
			'encoding': 'binary',
			'mode': 0666,
			'bufferSize': 4 * 1024
		}).addListener( "data", function(chunk) {
			response.write(chunk, 'binary');
		}).addListener( "close",function() {
			response.end();
			console.log('[server] '.cyan + '[200] '.green + request.url.green);
		});
	});
});

// fire it up
server.listen(option.port);
console.log('[server] '.cyan + 'Listening at http://127.0.0.1:' + option.port + '\n');

// lets spawn a grunt watch process too :)
if(option.grunt){
	try {
		var spawn     = require('child_process').spawn,
			gruntinit = spawn('grunt'),
		    grunt     = spawn('grunt', ['watch']);

		gruntinit.stdout.on('data', function (data) {
		  console.log('[gruntinit] '.cyan + data);
		});

		gruntinit.stderr.on('data', function (data) {
		  console.log('[gruntinit] '.cyan + data);
		});

		gruntinit.on('close', function (code) {
		  console.log('[gruntinit] '.cyan + 'exited with code ' + code);
		});

		grunt.stdout.on('data', function (data) {
		  console.log('[grunt] '.cyan + data);
		});

		grunt.stderr.on('data', function (data) {
		  console.log('[grunt] '.cyan + data);
		});

		grunt.on('close', function (code) {
		  console.log('[grunt] '.cyan + 'exited with code ' + code);
		});
	} catch(e) {
		// do nothing if no grunt
	}
}
