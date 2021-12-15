// @flow
import fs from 'fs';
import path from 'path';
import glob from 'glob';
import _ from 'lodash';

export const getRules = (): Array<Array<string>> => {
  const rulesFiles = glob.sync(path.resolve(__dirname, '../rules/*.js'));

  const rulesNames = rulesFiles
    .map((file) => path.basename(file, '.js'))
    .map((name) => [name, _.kebabCase(name)]);

  return rulesNames;
};

export const isFile = (filepath: string): boolean => {
  try {
    return fs.statSync(filepath).isFile();
  } catch {
    return false;
  }
};
