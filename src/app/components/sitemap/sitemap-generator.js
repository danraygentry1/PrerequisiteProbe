require('@babel/register')({
});

const Sitemap = require('react-router-sitemap').default;
const router = require('./sitemap-routes').default;


function generateSitemap() {
  return (
    new Sitemap(router)
      .build('https://www.ptschoolprobe.com/')
      .save('./sitemap.xml')
  );
}

generateSitemap();
