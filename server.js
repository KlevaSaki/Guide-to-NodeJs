var http = require("http");
var url = require("url");
var formidable = require("formidable");
var sys = require("sys");

function start(route, handle){

    function onRequest(req, res){
        var postData = "";
        var pathname = url.parse(req.url).pathname;
        console.log("Request for " + pathname + " received");

        req.setEncoding("utf8");

        req.addListener("data", (postDataChunk) => {
            postData += postDataChunk;
            console.log("Received Post data chunk ' " + postDataChunk + " ' .");
        });


        req.addListener("end", () => {
            route(handle, pathname, res, postData);
        });

        if(req.url == '/upload' && req.method.toLowerCase() == 'post'){
            //parse a file upload

            var form = new formidable.IncomingForm();
            form.parse(req, function(err,fields,files){
                res.writeHead(200, {'Content-type': 'text/plain'});
                res.write('received upload: \n\n');
                res.end(sys.inspect({fields: fields, files: files}))
            });
            return;
        }


        //show a file upload form
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(
            '<form action="/upload" enctype="multipart/form-data" ' +
            'method="post">' +
            '<input type="text" name="title"> <br>' +
            '<input type="file" name="upload" multiple="multiple"><br>' +
            '<input type="submit" value="Upload">' +
            '</form>'
        )

        // route(handle, pathname, res);

        // res.writeHead(200, {"Content-Type" : "text/plain"});
        // var content = route(handle, pathname);
        // res.write(content);
        // res.end();
    };
    
    http.createServer(onRequest).listen(5000);
    
    console.log("Server has started on port 5000");

}

exports.start = start;



