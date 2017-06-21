import _ from 'lodash';

// Import templates to build them in at compile time
import base from '../client/templates/base.html';

// Object of all templates
export const TEMPLATES = {
  base
};

export default function (req, res, next) {
  res.mustache = function(partial, data, templateData){

    // Get the appropriate template
    let templateFn = res.mustache.template;

    if (!templateFn) {
      throw 'Invalid templates: ' + res.mustache.template;
    }

    // Render the page
    let page = templateFn(_.merge({
      head: '',

      // Render the partial
      body: partial(data),

      // Give the data to the javascript
      script: `window.globalEvents.emit(\
        'receive_data', ${JSON.stringify(data)});`,
    }, templateData));

    res.send(page);
  };

  res.mustache.template = TEMPLATES.base;
  next();
}
