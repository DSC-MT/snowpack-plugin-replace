const pkg = require('./package.json');

const supportExt = ['.js', '.css', '.html', '.json', '.txt']

module.exports = function (snowpackConfig, pluginOptions) {
  return {
    name: pkg.name,
    transform({ id, contents, fileExt }) {
      if(!supportExt.includes(fileExt)) {
        // Skip not support version
        return contents;
      }

      const list = pluginOptions.list || [];
      for (let item of list) {
        const file = item.file;
        if(typeof file === 'string') {
          // If specify file path. check it
          if(file !== id) {
            continue;
          }
        }

        let str = item.from;
        if(str === undefined || str === null) {
          continue;
        }

        const replaceValue = item.to;
        if(replaceValue === undefined || replaceValue === null) {
          continue;
        }

        if (Array.isArray(replaceValue)) {
          const sourceCode = replaceValue[0]
          // console.log('sourceCode', sourceCode)
          // console.log('arguments', { 0: replaceValue[1], 1: {item, list}, 2: {id, contents, fileExt}, 3: {snowpackConfig, pluginOptions}})
          // extremelty expensive:
          replaceValue = new Function(sourceCode)(replaceValue[1], {item, list}, {id, contents, fileExt}, {snowpackConfig, pluginOptions})
          // console.log('replaceValue', replaceValue)
        }

/**
 * String.prototype.replaceAll() polyfill
 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!String.prototype.replaceAll) {
	String.prototype.replaceAll = function(str, newStr){

		// If a regex pattern
		if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
			return this.replace(str, newStr);
		}

		// If a string
		return this.replace(new RegExp(str, 'g'), newStr);

	};
}

        // contents = contents.replace(str, replaceValue);
        contents = contents.replaceAll(str, replaceValue);
        // console.log('replaced ' + str + ' with ' + replaceValue)
        
      }
      return contents;
    },
  };
};
