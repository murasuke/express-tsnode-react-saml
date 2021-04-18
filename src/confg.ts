import dotenv from 'dotenv';

dotenv.config();

['APP_PORT',
'API_SERVER',
].forEach( (item) => {
  if (!process.env[item]) {
    console.error(`${item} should define in env.`);
    process.exit(1);
  }
});

const appConfig = {
  appPort: process.env.APP_PORT,
  apiServer: process.env.API_SERVER,
};

export default appConfig;
