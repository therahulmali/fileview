var express = require('express'),
    fs = require("fs"),
    app = express(),
    port = 80,
    path = "/0works/0projects",
    templPath = __dirname + "/../templates/",
    staticFile = "*.(js|css|html|html|jpg|txt|png|psd|gif|jpeg|md|db|DS_Store|svg|ttf|woff2|eot|zip)$";

app.set('view engine', 'pug');
app.use('/theme', express.static('theme'))

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
    res.status(500).send('<h1>Not Found!</h1>');
});

app.listen(port);
console.log("Server is running at " + port);
