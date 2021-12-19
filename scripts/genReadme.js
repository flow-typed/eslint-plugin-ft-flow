/* eslint-disable no-param-reassign */
// @flow
const fs = require('fs');
const path = require('path');
const { range } = require('lodash');

const readmeDir = '../.README';

fs.readFile(path.resolve(__dirname, readmeDir, 'README.md'), 'utf-8', (err, content) => {
  if (err) {
    console.error(err);
  }

  const gitdownPrefix = '{"gitdown": "include", "file": ';
  const ruleStrings = content.split('\n').filter((o) => o.startsWith(gitdownPrefix));

  const titles = [];

  const generateHeader = (value) => {
    const name = value.replace(/[#]/g, '').trim();
    const headingSize = value.split('#').length - 1;

    return `<a name="${name.toLowerCase().replace(/ /g, '-').replace(/`/g, '')}"></a>
${range(0, headingSize).map(() => '#').join('')} ${name.replace('`', '<code>').replace('`', '</code>')}`;
  };

  content = content.split('\n').map((o) => {
    if (!o.startsWith('##')) return o;

    return generateHeader(o);
  }).join('\n');

  ruleStrings.forEach((rule) => {
    const ruleObj = JSON.parse(rule);
    let ruleContent = fs.readFileSync(path.resolve(__dirname, readmeDir, ruleObj.file), 'utf-8');

    const lines = ruleContent.split('\n');
    ruleContent = lines.map((o) => {
      if (!o.startsWith('##')) return o;
      return generateHeader(o);
    }).join('\n');

    titles.push(lines[0].replace(/[`]/g, ''));
    content = content.replace(rule, ruleContent);
  });

  const tableOfContents = titles.reduce((acc, cur) => {
    const name = cur.replace(/[# ]/g, '');
    if (cur.startsWith('## ')) {
      return `${acc}* [\`${name}\`](#rules-${name})\n`;
    }
    if (cur.startsWith('### ')) {
      return `${acc}  * [\`${name}\`](#rules-${name})\n`;
    }
    return '';
  }, '');
  content = content.replace('{"gitdown": "contents"}', tableOfContents);

  fs.writeFile('./README.md', content, (writeErr) => {
    if (writeErr) {
      console.error(writeErr);
    }
  });
});
