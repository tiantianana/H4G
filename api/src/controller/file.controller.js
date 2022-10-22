const uploadFile = require("../middleware/upload");
var cmd = require('node-cmd');
const fs = require('fs');

const upload = async (req, res) => {

    try {
        await uploadFile(req, res);
        console.log('Enviar archivo ' + req.file)
        
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        var pyProcess = cmd.run('python script.py ' + '"'+ req.file.originalname + '"' ,
            
            function (data, err, stderr) {
                if (!err) {
                    console.log('Esperando respuesta...')
                } else {
                    console.log("python script cmd error: " + err)
                }
            }
        );

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });

    } catch (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 4MB!",
            });
        }

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

const getListFiles = (req, res) => {
    const directoryPath = __basedir + "/resources/";

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file
               // url: baseUrl + file,
            });
        });

        res.status(200).send(fileInfos);
    });
};

const download = (req, res) => {
    console.log("downloading...");
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

module.exports = {
    upload,
    getListFiles,
    download,
};
