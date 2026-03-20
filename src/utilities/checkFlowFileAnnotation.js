import _ from 'lodash';

import isFlowFile from './isFlowFile';
import isNoFlowFile from './isNoFlowFile';

export default (cb, context) => {
  const checkThisFile = (!_.get(context, 'settings[\'ft-flow\'].onlyFilesWithFlowAnnotation') && !isNoFlowFile(context)) || isFlowFile(context);

  if (!checkThisFile) {
    return () => {};
  }

  return cb(context);
};
