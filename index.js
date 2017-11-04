var express = require('express'),
    path = require("path"),
    fs = require("fs"),
    app = express(),
    port = 80,
    path = "d:/0projects",
    templPath = __dirname + "/templates/",
    staticFile = "*.(js|css|html|html|jpg|txt|png|psd|gif|jpeg|md|db|DS_Store|svg|ttf|woff2|eot|zip|json)";

app.set('view engine', 'pug');
app.use('/theme', express.static('theme'));

// console.log('///////////////////////////')
// console.log(path)
// app.use(staticFile, express.static(path.join(__dirname, 'public')));

app.get(staticFile, function (req, res) {
    var file = path + req.originalUrl;

    res.sendFile(file);
});

app.get("/*", function (req, res) {
    var reqPath = path + req.path,
        origUrl = req.originalUrl,
        origUrl = origUrl == "/" ? origUrl : (origUrl + "/");

    function getData(err, data) {
        var files = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                var fileName = data[i],
                    filePath = origUrl + fileName;
                try {
                    var fileState = fs.lstatSync(path + filePath);
                    var date = new Date(fileState.mtime);
                    fileState.filePath = filePath;
                    fileState.isFile = fileState.isFile();
                    fileState.fileName = fileName;
                    fileState.modifiedTime = date.toLocaleString();

                    files.push(fileState)
                } catch (error) {

                }
            }

            var json = {
                title: "Works",
                dirname: __filename,
                files: files,
                path: templPath
            };

            res.render(templPath + "page", json);
        }
    }

    fs.readdir(reqPath, getData);
});

app.use(function (err, req, res, next) {
    // console.log(err)
    res.status(500).send('<h1>Not Found!</h1>');
});

app.listen(port);
console.log("Server is running at " + port);


#!/usr/bin/env node

// GET Argument
function getArgs() {
    var PS = process,
        args = PS.argv,
        reg = /^-+(\w+)/ig,
        rls = {};

    if (args) {
        for (var i = 0; i < args.length; i++) {
            var key = args[i],
                value = args[i + 1];

            if (reg.test(key)) {
                rls[RegExp.$1] = value || "";
            }
        }
    }

    if (typeof rls.h == "string") {
        rls.help = 1;
    }
    if (typeof rls.help == "string") {
        rls.help = 1;
    }
    if (!rls.p) {
        rls.p = PS.env.PWD;
    }
    return rls;
}

// RESPOND REQURES
function respondArg(args) {
    var argProcess = {
            p: function (value) {

            }
        },
        help = function () {
            console.log("==========================================");
            console.log("Usage: fileview [options]");
            console.log("");
            console.log("Options:");
            console.log("   -p,                 file path");
            console.log("   -P                  http port");
            console.log("   -h/-help/--help     output usage information");
            console.log("");
            console.log("Examples:");
            console.log("$ fileview -p /projects/example/ -P 8080");
            console.log("==========================================");
        };

    // PROCESS
    if (args) {

        if (args.help) {
            help();
        } else {
            for (var i in args) {
                var ap = argProcess[i];
                ap && ap(args[i]);
            };
        }
    }
}

// readByHttp
function readByHttp(req,res,path, dirRender, fileRender) {
    var errorMsg = ["file or dir is not exist."];
    // Is Exist
    fs.exists(path, (exists) => {
        if (exists) {
            var fsState = fs.lstatSync(path);
            if (fsState.isFile()) {
                // file

            } else {
                // dir
                fs.readdir(path, dirRender);
            }
        } else {
            // throw new Error();
            // console.log(">>>>" + errorMsg[0]);
            res.writeHead(404, {"Content-Type": "text/html"});
            res.write("No found!");
            res.end();
        }
    });
}
// ROUNTER
function router(url) {

}

var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    args = getArgs();

const PORT = 8088;

respondArg(args);

// Create a server
http.createServer(function (req, res) {

    router(req.url)

    var reqPath = args.p + (req.url || ""),
        origUrl = req.originalUrl,
        origUrl = origUrl == "/" ? origUrl : (origUrl + "/");

    console.log("reqPath: " + reqPath);

    readByHttp(req,res,reqPath, function (err, data) {
        var pathObjs = [];

        if (data) {
            for (var i = 0; i < data.length; i++) {
                var pathObj = data[i],
                    OBJState = fs.lstatSync(reqPath + pathObj),
                    objson = {
                        isFile: OBJState.isFile(),
                        path: pathObj,
                        name: pathObj,
                        time: new Date(OBJState.mtime).toLocaleString()
                    };
                pathObjs.push(objson);
            }
            pathObjs = JSON.stringify(pathObjs);
            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(pathObjs);
        }
    });

}).listen(PORT);
console.log('Server running at http://127.0.0.1:' + PORT + '/');
