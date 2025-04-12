// app.config.js
import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    serp_api_key: process.env.SERP_API_KEY,
  },
});
