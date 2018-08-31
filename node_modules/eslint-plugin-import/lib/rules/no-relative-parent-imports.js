'use strict';

var _moduleVisitor = require('eslint-module-utils/moduleVisitor');

var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);

var _docsUrl = require('../docsUrl');

var _docsUrl2 = _interopRequireDefault(_docsUrl);

var _path = require('path');

var _importType = require('../core/importType');

var _importType2 = _interopRequireDefault(_importType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  meta: {
    docs: {
      url: (0, _docsUrl2.default)('no-relative-parent-imports')
    },
    schema: [(0, _moduleVisitor.makeOptionsSchema)()]
  },

  create: function noRelativePackages(context) {
    const myPath = context.getFilename();
    if (myPath === '<text>') return {}; // can't cycle-check a non-file

    function checkSourceValue(sourceNode) {
      const depPath = sourceNode.value;
      if ((0, _importType2.default)(depPath, context) === 'parent') {
        context.report({
          node: sourceNode,
          message: 'Relative imports from parent directories are not allowed. ' + `Please either pass what you're importing through at runtime ` + `(dependency injection), move \`${(0, _path.basename)(myPath)}\` to same ` + `directory as \`${depPath}\` or consider making \`${depPath}\` a package.`
        });
      }
    }

    return (0, _moduleVisitor2.default)(checkSourceValue, context.options[0]);
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL25vLXJlbGF0aXZlLXBhcmVudC1pbXBvcnRzLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsInVybCIsInNjaGVtYSIsImNyZWF0ZSIsIm5vUmVsYXRpdmVQYWNrYWdlcyIsImNvbnRleHQiLCJteVBhdGgiLCJnZXRGaWxlbmFtZSIsImNoZWNrU291cmNlVmFsdWUiLCJzb3VyY2VOb2RlIiwiZGVwUGF0aCIsInZhbHVlIiwicmVwb3J0Iiwibm9kZSIsIm1lc3NhZ2UiLCJvcHRpb25zIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7Ozs7O0FBRUFBLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKQyxVQUFNO0FBQ0pDLFdBQUssdUJBQVEsNEJBQVI7QUFERCxLQURGO0FBSUpDLFlBQVEsQ0FBQyx1Q0FBRDtBQUpKLEdBRFM7O0FBUWZDLFVBQVEsU0FBU0Msa0JBQVQsQ0FBNEJDLE9BQTVCLEVBQXFDO0FBQzNDLFVBQU1DLFNBQVNELFFBQVFFLFdBQVIsRUFBZjtBQUNBLFFBQUlELFdBQVcsUUFBZixFQUF5QixPQUFPLEVBQVAsQ0FGa0IsQ0FFUjs7QUFFbkMsYUFBU0UsZ0JBQVQsQ0FBMEJDLFVBQTFCLEVBQXNDO0FBQ3BDLFlBQU1DLFVBQVVELFdBQVdFLEtBQTNCO0FBQ0EsVUFBSSwwQkFBV0QsT0FBWCxFQUFvQkwsT0FBcEIsTUFBaUMsUUFBckMsRUFBK0M7QUFDN0NBLGdCQUFRTyxNQUFSLENBQWU7QUFDYkMsZ0JBQU1KLFVBRE87QUFFYkssbUJBQVMsK0RBQ04sOERBRE0sR0FFTixrQ0FBaUMsb0JBQVNSLE1BQVQsQ0FBaUIsYUFGNUMsR0FHTixrQkFBaUJJLE9BQVEsMkJBQTBCQSxPQUFRO0FBTGpELFNBQWY7QUFPRDtBQUNGOztBQUVELFdBQU8sNkJBQWNGLGdCQUFkLEVBQWdDSCxRQUFRVSxPQUFSLENBQWdCLENBQWhCLENBQWhDLENBQVA7QUFDRDtBQTFCYyxDQUFqQiIsImZpbGUiOiJydWxlcy9uby1yZWxhdGl2ZS1wYXJlbnQtaW1wb3J0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb2R1bGVWaXNpdG9yLCB7IG1ha2VPcHRpb25zU2NoZW1hIH0gZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9tb2R1bGVWaXNpdG9yJ1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCdcbmltcG9ydCB7IGJhc2VuYW1lIH0gZnJvbSAncGF0aCdcblxuaW1wb3J0IGltcG9ydFR5cGUgZnJvbSAnLi4vY29yZS9pbXBvcnRUeXBlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIGRvY3M6IHtcbiAgICAgIHVybDogZG9jc1VybCgnbm8tcmVsYXRpdmUtcGFyZW50LWltcG9ydHMnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW21ha2VPcHRpb25zU2NoZW1hKCldLFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gbm9SZWxhdGl2ZVBhY2thZ2VzKGNvbnRleHQpIHtcbiAgICBjb25zdCBteVBhdGggPSBjb250ZXh0LmdldEZpbGVuYW1lKClcbiAgICBpZiAobXlQYXRoID09PSAnPHRleHQ+JykgcmV0dXJuIHt9IC8vIGNhbid0IGN5Y2xlLWNoZWNrIGEgbm9uLWZpbGVcblxuICAgIGZ1bmN0aW9uIGNoZWNrU291cmNlVmFsdWUoc291cmNlTm9kZSkge1xuICAgICAgY29uc3QgZGVwUGF0aCA9IHNvdXJjZU5vZGUudmFsdWVcbiAgICAgIGlmIChpbXBvcnRUeXBlKGRlcFBhdGgsIGNvbnRleHQpID09PSAncGFyZW50Jykge1xuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZTogc291cmNlTm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiAnUmVsYXRpdmUgaW1wb3J0cyBmcm9tIHBhcmVudCBkaXJlY3RvcmllcyBhcmUgbm90IGFsbG93ZWQuICcgK1xuICAgICAgICAgICAgYFBsZWFzZSBlaXRoZXIgcGFzcyB3aGF0IHlvdSdyZSBpbXBvcnRpbmcgdGhyb3VnaCBhdCBydW50aW1lIGAgK1xuICAgICAgICAgICAgYChkZXBlbmRlbmN5IGluamVjdGlvbiksIG1vdmUgXFxgJHtiYXNlbmFtZShteVBhdGgpfVxcYCB0byBzYW1lIGAgK1xuICAgICAgICAgICAgYGRpcmVjdG9yeSBhcyBcXGAke2RlcFBhdGh9XFxgIG9yIGNvbnNpZGVyIG1ha2luZyBcXGAke2RlcFBhdGh9XFxgIGEgcGFja2FnZS5gLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb2R1bGVWaXNpdG9yKGNoZWNrU291cmNlVmFsdWUsIGNvbnRleHQub3B0aW9uc1swXSlcbiAgfSxcbn1cbiJdfQ==