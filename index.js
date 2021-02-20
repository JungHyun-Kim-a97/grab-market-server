var http = require("http"); //node 내장 모듈 불러옴
var hostname = "127.0.0.1"; // localhost와 동일
var port = 8090;

const server = http.createServer(function (req, res) {
  const path = req.url; // req.url에는 port와 ip번호를 제외한 url이 들어가게 됩니다.
  const method = req.method;

  if (path === "/products") {
    // 아티클 정보를 받아오는 요청
    if (method === "GET") {
      res.writeHead(200, { "Content-type": "application/json" }); // 200은 status 코드
      const products = res.end(
        JSON.stringify([
          {
            name: "농구공",
            price: 5000,
          },
        ]);
      );
      res.end(products);
    } else if (method === "POST") {
        res.end("생성되었습니다");
    }
  }
});

server.listen(port, hostname);
{
  /*listen은 기다리다 라는 뜻으로 port, hostname을 기다리고 있다 라는 뜻을 가짐*/
}

console.log("grab market server on!");
