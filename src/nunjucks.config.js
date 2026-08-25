'use strict';

const path = require('path');
const nunjucks = require('nunjucks');

const COMPONENTS_ROOT = path.join(__dirname, 'components');

function configure(options = {}) {
  const loader = new nunjucks.FileSystemLoader(COMPONENTS_ROOT, {
    watch: Boolean(options.watch),
    noCache: Boolean(options.noCache),
  });

  return new nunjucks.Environment(loader, {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
    throwOnUndefined: Boolean(options.throwOnUndefined),
  });
}

module.exports = { configure, COMPONENTS_ROOT };
