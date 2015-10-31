/**
 * Module Dependencies
 */
var Duo = require('duo');
var babel = require('duo-babel');
var path = require('path');
var fs = require('fs');
var join = path.join;

/**
 * Paths
 */
var out = join('./dist', 'app.js');

/**
 * Initialize `duo`
 */
var duo = Duo(__dirname)
  .development(true)
  .use(babel())
  .entry('./app/app.jsx');

/**
 * Run `duo`
 */

duo.run(function(err, results) {
  if (err) throw err;
  fs.writeFileSync(out, results.code);
  var len = Buffer.byteLength(results.code);
  console.log('all done, wrote %dkb', len / 1024 | 0);
});