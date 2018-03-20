let crypto = require('crypto');
let os = require('os');
let fs = require('fs');
exports.encrypt = function (str, secret) {
    let cipher = crypto.createCipher('aes192', secret);
    let enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
};

exports.decrypt = function (str, secret) {
    let decipher = crypto.createDecipher('aes192', secret);
    let dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

exports.md5 = function (str) {
    let md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
};

exports.randomString = function (size) {
    size = size || 6;
    let code_string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let max_num = code_string.length + 1;
    let new_pass = '';
    while (size > 0) {
        new_pass += code_string.charAt(Math.floor(Math.random() * max_num));
        size --;
    }
    return new_pass;
};


let platform = os.platform();

let createFile = function (filepath, size, callback) {
    let cb = function (err) {
        callback && callback();
    };
    if (fs.existsSync(filepath)) {
        cb('file existed.');
    } else {
        let cmd;
        switch (platform) {
        case 'win32':
            cmd = 'fsutil file createnew ' + filepath + ' ' + size;
            break;
        case 'darwin':
        case 'linux':
            cmd = 'dd if=/dev/zero of=' + filepath + ' count=1 bs=' + size;
            break;
        }
        let exec = require('child_process').exec;
        exec(cmd, function (err, stdout, stderr) {
            cb(err);
        });
    }
};

exports.createFile = createFile;


exports.saveFileWithStream=function(filePath, fileData) {
    return new Promise((resolve, reject) => {
        // 块方式写入文件
        const wstream = fs.createWriteStream(filePath);

        wstream.on('open', () => {
            const blockSize = 128;
            const nbBlocks = Math.ceil(fileData.length / (blockSize));
            for (let i = 0; i < nbBlocks; i += 1) {
                const currentBlock = fileData.slice(
                    blockSize * i,
                    Math.min(blockSize * (i + 1), fileData.length),
                );
                wstream.write(currentBlock);
            }

            wstream.end();
        });
        wstream.on('error', (err) => { reject(err); });
        wstream.on('finish', () => { resolve('done'); });
    });
}