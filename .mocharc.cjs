module.exports = {
  exit: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  parallel: !!process.env.PARALLEL,
  reporter: "spec",
  color: !!!process.env.CI,
  require: ["@babel/register", "coffeescript/register"],
  ignore: "node_modules",
  extension: "js,coffee",
};
