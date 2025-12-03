module.exports = {
  apps: [
    {
      name: "resonac-monitoring-app",
      cwd: "C:/toho/project/resonac/frontend",
      script: "npm",
      args: "run start",
      interpreter: "node",       // <-- wajib
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
}
