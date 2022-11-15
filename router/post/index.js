const express = require("express");
const fs = require("fs");
const matter = require("gray-matter");
const postsDirectory = `${process.cwd()}/_post`;

const router = express.Router();

router.get("/", (req, res) => {
  res.send("post 다아아아아아ㅏㅇ");
});

router.get("/all", (req, res) => {
  const postData = getChildPost(postsDirectory);

  //하위 디렉토리   조회용 재귀 함수
  function getChildPost(path) {
    const result = fs.readdirSync(path);

    return result.reduce((sum, current) => {
      const isPost = current.includes(".md");

      if (isPost) {
        const notExt = current.replace(".md", "");

        const result = fs.readFileSync(`${path}/${current}`, {
          encoding: "utf-8",
        });

        const convertedData = matter(result);
        // let convertedData = matter(result);
        // if (convertedData.data.thumbnail) {
        //   convertedData.data.thumbnail = `${convertedData.data.thumbnail}`;
        // } else {
        //   convertedData.data.thumbnail = ``;
        // }

        sum.push({
          type: "post",
          title: notExt,
          path: `${path.replace(postsDirectory, "")}/${notExt}`,

          data: {
            ...convertedData.data,
            content: convertedData.content,
          },
        });
      } else {
        sum.push({
          type: "directory",
          title: current,
          children: getChildPost(`${path}/${current}`),
        });
      }

      return sum;
    }, []);
  }
  res.json(postData);
});

module.exports = router;
