module.exports = {
  apps: [
    {
      name: "niulai",
      script: "npm",
      args: "run start",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: "3050"
      }
    }
  ]
};
