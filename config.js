const { Sequelize } = require("sequelize");
const fs = require("fs");
require("dotenv").config();
const toBool = (x) => x === "true";
const DATABASE_URL = process.env.DATABASE_URL || "./assets/database.db";
module.exports = {
  ANTILINK: toBool(process.env.ANTI_LINK) || false,
  LOGS: toBool(process.env.LOGS) || true,
  ANTILINK_ACTION: process.env.ANTI_LINK || "kick",
  SESSION_ID: process.env.SESSION_ID || "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS05Hd3gzMXZYRHk3RkF5RkxpaUN5VnpiVUdNMEJ1M21zdUIxeThSNFJGVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMXVvaDh1Z1RzdkdjQjYrU2NEYzMwa0ZjMlo1SnJuR2VXYnRHK0tpYVNWbz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJJQWhscnE1NVgwZERlcm5sbWkwcUltTk0zbFd4Qk1VNDhQMDJvdFJGY0drPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ4UmVEUzNydVJpWm9SQktYSWtaaVVuNDAzbGdpaUVoSlZqOWpiU05mUjNRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik1ORW9jWlpIWGJhVG1Fbi9FVmcyd083T1FlNHpzMUxxOG1HbENGbENrRjA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjVNUnFsMXdyYytCMkh2QThISG9kTlY0UkJnejdaYXZ3R3hicndhL1lZZ1E9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNkhWWUYvYXZ0RXVpY0IwTk44czBVcnljSjNTTTNXdEZ3TjFVSDVTcTNIRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSWZadUxHUU5oWWZRV2pxdkhpWDEwbTk4VTc3NHZDelVGTThZMitHUElCWT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjFPRlFjTGppaERhOW1TRHI5REVYN2hVYVp2STd3Q0JxOWhJUlJFVERHbUhWc2xoZDBsU0FNdnNOR3BSZnNTWUJQbkRuUnkwd2VnMVgxZ0d0ZnREOWhRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTgsImFkdlNlY3JldEtleSI6IklWdE1FVzdHY1k0T1ZuQmZMTmFFMHZmTGFiUUFBdGRlS1V3aHNnUVJPOFk9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6ImNYazUyZkJhUkpLUno4dnJKNUFlUGciLCJwaG9uZUlkIjoiYWY4MTAxNDMtNDE4Yi00YzA0LWE0NmItZTJkYThhNjI3MTc5IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJocE5RUjM2VFdXNFRWVDFhWlNtRGI4dWlwOD0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJOaCtHdndvc2xlaURyaFZJQXBOMW43UjhHQ009In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiRFQ5Q1hBUUQiLCJtZSI6eyJpZCI6IjIzNDcwMTMxNTkyNDQ6NTNAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoi4ZWZ4oGgKOKBoMKg4oGgwqDigaDigKLigaDCoOKBoOKAv+KBoMKg4oGg4oCi4oGgwqDigaDCoOKBoCnigaDhlZcifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ09DNW1KWUdFTFRXamJZR0dBa2dBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6InZTZnp5SFFXbXFmbWVnSGRvdXpYRXhBbDM2MGUrd2lKVXZGcThvNlp6RzQ9IiwiYWNjb3VudFNpZ25hdHVyZSI6IlNUVVFSdjRtYm1obEpJTUN3SnhFYXJFd3FQQ1dJWWp1d1dVUkhKWHA0VlY2bXl4bUdkS2RyNDhmck9FbGFUVG1uZTFadXh4eVArS0ZvNEZqcXVPakJnPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJRNkZTcFdSYVc0clFxODcxS3cya2VTOTFZSU93Y001UnhibCt3VHFpTFBianB2eC9YUnM0bjJ2T1Y3dHZJM2daZHZJY3pSbmthZVREdFBTdXlWQ0ZoQT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjIzNDcwMTMxNTkyNDQ6NTNAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCYjBuODhoMEZwcW41bm9CM2FMczF4TVFKZCt0SHZzSWlWTHhhdktPbWN4dSJ9fV0sInBsYXRmb3JtIjoic21iYSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyNDA4MzAxMH0=",
  LANG: process.env.LANG || "EN",
  AUTH_TOKEN: "",
  HANDLERS:
    process.env.HANDLER === "false" || process.env.HANDLER === "null"
      ? "^"
      : "[,]",
  RMBG_KEY: process.env.RMBG_KEY || false,
  BRANCH: "main",
  WARN_COUNT: 3,
  PACKNAME: process.env.PACKNAME || "XMirage",
  WELCOME_MSG: process.env.WELCOME_MSG || "Hi @user Welcome to @gname",
  GOODBYE_MSG: process.env.GOODBYE_MSG || "Hi @user It was Nice Seeing you",
  AUTHOR: process.env.AUTHOR || "XMirage",
  SUDO:
    process.env.SUDO || "2347013159244,2348160247341",
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
  OWNER_NAME: process.env.OWNER_NAME || "Mirage_Tech",
  HEROKU: toBool(process.env.HEROKU) || false,
  BOT_NAME: process.env.BOT_NAME || "X-Mirage",
  AUTO_READ: toBool(process.env.AUTO_READ) || false,
  AUTO_STATUS_READ: toBool(process.env.AUTO_STATUS_READ) || true,
  PROCESSNAME: process.env.PROCESSNAME || "x-mirage",
  WORK_TYPE: process.env.WORK_TYPE || "public",
  SESSION_URL: process.env.SESSION_URL || "",
  DELETED_LOG: toBool(process.env.DELETED_LOG) || false,
  DELETED_LOG_CHAT: process.env.DELETED_LOG_CHAT || false,
  REMOVEBG: process.env.REMOVEBG || false,
  DATABASE_URL: "postgresql://miracle32669_outlook:PbkUOk85gTwksHFhEbFt6A@puddle-meerkat-15347.8nj.gcp-europe-west1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full",
  STATUS_SAVER: toBool(process.env.STATUS_SAVER) || false,
  DATABASE:
    DATABASE_URL === "./assets/database.db"
      ? new Sequelize({
          dialect: "sqlite",
          storage: DATABASE_URL,
          logging: false,
        })
      : new Sequelize(DATABASE_URL, {
          dialect: "postgres",
          ssl: true,
          protocol: "postgres",
          dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
          },
          logging: false,
        }),
};
