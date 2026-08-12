const { app } = require("./src/app");

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Chess backend listening on http://localhost:${port}`);
});
