const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
const port = 8090;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.get("/banners", (req, res) => {
  models.Banner.findAll({
    limit: 2, //2개까지만 보여줌
  })
    .then((result) => {
      res.send({
        banners: result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("에러가 발생했습니다.");
    });
});

app.get("/products", (req, res) => {
  models.Product.findAll({
    //findOne을 사용하면 1개씩 검색 가능
    order: [["createdAt", "DESC"]], //order 정렬을 사용하여 최신순으로 나열
    attributes: ["id", "name", "price", "createdAt", "seller", "imageUrl"], //attributes를 주어서 원하는 컬럼만 검색가능
  })
    .then((result) => {
      console.log("PRODUCTS : ", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("에러 발생");
    });
});
app.post("/products", (req, res) => {
  const body = req.body;
  const { name, description, price, seller, imageUrl } = body;
  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send("모든 필드를 입력해주세요");
  }
  models.Product.create({
    name,
    description,
    price,
    seller,
    imageUrl,
  })
    .then((result) => {
      console.log("상품 생성 결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 업로드에 문제가 발생했습니다");
    });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("PRODUCT : ", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 조회에 에러가 발생했습니다");
    });
});

app.post("/image", upload.single("image"), (req, res) => {
  //image 파일이 들어왔을 때 수행되는 로직
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path, //image의 위치
  });
});

app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다");
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공!");
    })
    .catch((err) => {
      console.error(err);
      console.log("DB 연결 에러ㅠ");
      process.exit();
    });
});
