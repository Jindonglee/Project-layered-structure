module.exports = {
  apps: [
    {
      name: "app",
      script: "src/app.js",
      instances: 2,
      exec_mode: "cluster",
    },
  ],
};
