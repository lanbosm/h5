// �½�server������  
var http = require('http');  
  
var hostname = '127.0.0.1';  
var port = 3000;  
  
var server = http.createServer(function(req, res) {  
    // res.writeHead(200, {'Content-Type': 'text/html'});    
    // res.writeHead(200, {'Content-Type': 'text/plain'});    
    res.statusCode = 200;  
    res.setHeader('Content-Type', 'text/html');  
    // res.getHeader('content-type')  
  
    res.write('<head><meta charset="utf-8"/></head>');  
    // res.charset = 'utf-8';   ����  
  
    var htmlDiv = '<div style="width: 200px;height: 200px;background-color: #f0f;">div</div>';  
    res.write('<b>�װ��ģ��������ɣ�С��ǰ����̵�õ��...</b>');  
    res.write(htmlDiv);  
  
    // �в���=�ȵ��� res.write(data, encoding) ֮���ٵ��� res.end().  
    res.end('<h1>Hello world!</h1>');  
});  
  
server.listen(port, hostname, function() {  
    // hostname��const����ʱ������������д��  
    //console.log('Server running at http://${hostname}:${port}/');  
  
    console.log('Server running at http://%s:%s', hostname, port);  
    // console.log('Server running at http://' + hostname + ':' + port + '/');  
});