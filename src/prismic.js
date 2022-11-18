import * as prismic from '@prismicio/client';
export const client = prismic.createClient(
  process.env.REACT_APP_PRISMIC_ENDPOINT,
  {
    accessToken: process.env.REACT_APP_PRISMIC_ACCESS_TOKEN,
  }
);
