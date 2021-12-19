/* eslint-disable no-param-reassign */
// @flow
const fs = require('fs');
const path = require('path');
const { range } = require('lodash');

const readmeDir = '../.README';

const generateHeader = (value) => {
  const name = value.replace(/[#]/g, '').trim();
  const headingSize = value.split('#').length - 1;

  return `<a name="${name.toLowerCase().replace(/ /g, '-').replace(/`/g, '')}"></a>
${range(0, headingSize).map(() => '#').join('')} ${name}`;
};

fs.readFile(path.resolve(__dirname, readmeDir, 'README.md'), 'utf-8', (err, content) => {
  if (err) {
    console.error(err);
  }

  const gitdownContents = '{"gitdown": "contents"}';
  const gitdownRulePrefix = '{"gitdown": "include", "file": ';
  const ruleStrings = content.split('\n').filter((o) => o.startsWith(gitdownRulePrefix));

  // Go through each rule template and replace with the rule content
  ruleStrings.forEach((rule) => {
    const ruleObj = JSON.parse(rule);
    const ruleContent = fs.readFileSync(path.resolve(__dirname, readmeDir, ruleObj.file), 'utf-8');

    content = content.replace(rule, ruleContent);
  });

  // For each title transform to allow for linking
  content = content.split('\n').map((o) => {
    if (!o.startsWith('##')) return o;

    return generateHeader(o);
  }).join('\n');

  // With all titles create the table of contents
  const titles = content.split('\n').filter((o) => o.startsWith('##'));
  const tableOfContents = titles.reduce((acc, cur) => {
    const name = cur.replace(/[#]/g, '').trim();
    const link = `[${name}](#${name.toLowerCase().replace(/`/g, '').replace(' ', '-')})`;
    if (cur.startsWith('## ')) {
      return `${acc}* ${link}\n`;
    }
    if (cur.startsWith('### ')) {
      return `${acc}  * ${link}\n`;
    }
    return acc;
  }, '');
  content = content.replace(gitdownContents, tableOfContents);

  fs.writeFile('./README.md', content, (writeErr) => {
    if (writeErr) {
      console.error(writeErr);
    }
  });
});
