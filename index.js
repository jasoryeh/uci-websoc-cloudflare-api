/* tXML PARSER via https://github.com/TobiasNickel/tXml */
const tXml = require('./tXml');

const API_ENDPOINT = 'https://www.reg.uci.edu/perl/WebSoc';
// test - const API_ENDPOINT = 'https://FineSafeDefinition.jasoryeh.repl.co';
const ROUTE_OPTIONS = '/options';
const ROUTE_QUERY = '/query';

const CF_FETCH_PARAMS = {
  cacheTtl: 60, // things shouldn't update too often.
  cacheEverything: true
};

// comment if test
addEventListener('fetch', event => {
  var a = new Date().getTime();
  try {
    response = handleRequest(event.request);
    response.then(() => { console.log('Async request completion took ' + (new Date().getTime() - a) + 'ms')});
    event.respondWith(response);
  } catch(ex) {
    event.respondWith(r({"error": "There was an exception thrown whilst handling the request.", "details": ex}));
  }
  console.log('Request took ' + (new Date().getTime() - a) + 'ms');
});

const HELPERS = {
  responder: function(json, stat = undefined) {
    return new Response(JSON.stringify(json, null, 4), { 
      headers: { 
        "content-type": "application/json;charset=UTF-8", 
        "Access-Control-Allow-Origin": "*"
      }, 
      status: stat 
    });
  },
  deEncode: function(str) {
    return str ? unescape(str).replaceAll("&amp;", "&").replaceAll("&nbsp; ", "").replaceAll("&nbsp;", "").replaceAll("  ", " ").trim() : undefined;
  },
  reinitDatastore: function(ds) {
    let newDS = {};
    for (key in ds) {
      if(key.startsWith('__')) {
        newDS[key] = ds[key];
      }
    }
    return newDS;
  },
  websoc: {
    isClassComment: function(element, maxDepthSearch = 10) {
      if(element.children && element.children.length >= 1 && maxDepthSearch >= 1) {
        for(testElement of element.children) {
          if(testElement.attributes && testElement.attributes.class && 
              (testElement.attributes.class == 'Pct100' || testElement.attributes.class == 'Comments')) {
            return true;
          } else if(testElement.constructor == Object && this.isClassComment(testElement, maxDepthSearch - 1)) {
            return true;
          }
        }
      }
      return false;
    },
    getAllText: function(element) {
      let resolved = [];
      if(element && element.children && element.children.length > 0) {
        for(let child of element.children) {
          if(typeof(child) == 'string' && HELPERS.deEncode(child).length > 0) {
            resolved.push(child);
          } else {
            for(let e of HELPERS.websoc.getAllText(child)) {
              e = HELPERS.deEncode(e);
              if(e.length > 0) {
                resolved.push(e);
              }
            }
          }
        }
      }
      return resolved;
    }
  }
}

/**
 * Builds information for the WebSoc API paramters.
 * @param {*} type Type of field
 * @param {boolean} hasPreset Values are preset (meaning there is/are dropdown/option constraints on the search page)
 * @param {boolean} hasDefault Has a default value we should use (mostly the default values presented to the user)
 * @param {function} defaultMaker Some defaults must be parsed from the page, we get them using this function
 * @param {function} normalizer Even though the default is the type above, we must normalize them (ex. true (boolean) to "On" (string)) so the remote api is happy
 */
function buildOption(type, hasPreset = false, hasDefault = false, defaultMaker = () => undefined, normalizer = (val) => val) {
  return {
    'type': type,
    'hasPreset': hasPreset,
    'hasDefault': hasDefault,
    'default': defaultMaker,
    'normalize': normalizer
  };
}

const OPTIONS = {
  //'Submit', // dynamic, but are 'Display Web Results' and 'Display Text Results', we also default to web results so we can parse them
  'YearTerm': buildOption(String, true, true, () => "2021-03" /* todo: make this auto. */),
  'ShowComments': buildOption(Boolean, true, true, () => true, (val) => val ? "On" : undefined),
  'ShowFinals': buildOption(Boolean, true, true, () => true, (val) => val ? "On" : undefined),
  'Breadth': buildOption(String, true, true, () => "ANY"), // technically accepts undefined too /f
  'Dept': buildOption(String, true, true, () => "ALL"), // technically accepts undefined too /f
  'CourseNum': buildOption(Array, false, false, () => undefined, (val) => val ? val.join(', ') : undefined),
  'Division': buildOption(String, true, true, () => "ANY"),
  'CourseCodes': buildOption(Array, false, false, () => undefined, (val) => val ? val.join(', ') : undefined),
  'InstrName': buildOption(String),
  'CourseTitle': buildOption(String),
  'ClassType': buildOption(String, true, true, () => "ALL"),
  'Units': buildOption(Array, false, false, () => undefined, (val) => val ? val.join(', ') : undefined),
  'Days': buildOption(Array, false, false, () => undefined, (val) => val ? val.join(', ') : undefined),
  'StartTime': buildOption(String, true), 
  'EndTime': buildOption(String, true),
  'MaxCap': buildOption(Array, false, false, () => undefined, (val) => val ? val.join(', ') : undefined),
  'FullCourses': buildOption(String, true, false, () => "ANY"),
  'FontSize': buildOption(Array, false, false, () => undefined, (val) => val ? val.join(', ') : undefined),
  'CancelledCourses': buildOption(Array, true, true, () => "Exclude"),
  'Bldg': buildOption(String),
  'Room': buildOption(String)
}

const OPTION_ROUTES = {
  'all': Object.keys(OPTIONS),
  'preset': (() => { let arr = []; for (k in OPTIONS) { if(OPTIONS[k].hasPreset) { arr.push(k); } }; return arr;})(),
  'any': (() => { let arr = []; for (k in OPTIONS) { if(!OPTIONS[k].hasPreset) { arr.push(k); } }; return arr;})(),
  "_docs": {
    "all": "All available fields that can be passed to /query",
    "preset": "All fields that need to be check against /options/<item> to be used in /query",
    "any": "All fields that are up to the user, but follows the same needs as WebSoc's search tool's restrictions"
  }
}

async function route_options(subroute) {
  if(subroute == '' || subroute == '/' || (subroute.length > 1 && !subroute.startsWith('/'))) {
    return HELPERS.responder(OPTION_ROUTES); // list information about query options
  } else {
    // show options for ones with preset options
    for (let v of OPTION_ROUTES['preset']) {
      if(subroute.toLowerCase() == ('/' + v.toLowerCase())) {
        let search_page = await (await fetch(API_ENDPOINT, { cf: CF_FETCH_PARAMS })).text();
        let options = tXml(search_page, {attrName: 'name', attrValue: v})[0].children;   
        let data = {};
        for (let item of options) {
          data[HELPERS.deEncode(item.attributes.value)] = HELPERS.deEncode(item.children[0])
        }
        return HELPERS.responder(data);
      }
    }
    return HELPERS.responder({"error": "Invalid query option: " + subroute});
  }
}

async function route_query(json) {
  let form = [];
  for (let item of OPTION_ROUTES.all) {
    let spec = OPTIONS[item];
    let specDefaultValue = spec['default']();
    let jsonValue = json[item.toLowerCase()];
    if (jsonValue || specDefaultValue) {
      form.push(encodeURIComponent(item) + "=" + encodeURIComponent(jsonValue || specDefaultValue));
    }
  }

  let courses = await (await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    cf: CF_FETCH_PARAMS,
    body: form.join("&")
  })).text();//*/
  
  // check failures
  if(courses.includes('<div style="color: red; font-weight: bold;">')) {
    // only scan for that line, which appears to be only line to show errors before wasting time and parsing.
    return HELPERS.responder({ 
      "error": "An error occurred when sending your request to the remote API.", 
      "message": tXml(courses, {attrName: 'style', attrValue: 'color: red; font-weight: bold;'})[0].children 
    });
  }

  // parse
  let courselist = tXml.getElementsByClassName(courses, 'course-list')[0];
  let courseResults = {}; // returned to user
  let tableRows = courselist.children[0].children;

  let collectedData = {
    __get: function(type) {
      return this[type] ? this[type] : null;
    }
  };
  let rowAlignmentData = {
    __resolve: function(type, inRow) {
      let rad_idx = this[type];
      return typeof(rad_idx) == 'number' ? (inRow[rad_idx] ? inRow[rad_idx].children[0] : null) : null;
    }
  };

  let tableRowsLength = tableRows.length;
  for (let rowidx = 0; rowidx < tableRowsLength; rowidx++) { // surprisingly, everything is on one table.
    let row = tableRows[rowidx];
    let rowClass = row.attributes.class;
    let bgColor = row.attributes.bgcolor;
    if (rowClass) {
      if (!rowClass.includes("-bar")) {  // decoration/separators
        collectedData[row.attributes.class] = row;
      }
      continue;
    } else if (bgColor == "#E7E7E7") {  // table head, helps us find the data so we don't hardcode the table column indices
      rowAlignmentData = HELPERS.reinitDatastore(rowAlignmentData);
      let size = row.children.length;
      for (let idx = 0; idx < size; idx++) {
        rowAlignmentData[row.children[idx].children[0]] = idx;
      }
      continue;
    } else if (bgColor == '#fff0ff') { // can be anything from a course comment to the course title+id
      let work = row.children[0].children;
      if (work.length >= 2 && work[1] && work[1].attributes) {
        if(work[1].attributes.face) { // fonts indicate course name
          collectedData['course-title-id'] = HELPERS.deEncode(work[0]);
          collectedData['course-title'] = work[1].children[0].children[0];
        } else if(HELPERS.websoc.isClassComment(work[1])) { // scans for comments
          collectedData['course-comment'] = work[1].children[0].children[0].children;
        }
      }
    } else {
      if(HELPERS.websoc.isClassComment(row)) { continue; } // skip if comment
      let classComments = null;
      if (tableRowsLength != (rowidx + 1)) {
        let followingRow = tableRows[rowidx + 1];
        if(HELPERS.websoc.isClassComment(followingRow)) {
          classComments = HELPERS.websoc.getAllText(followingRow);
        }
      }
      /**
       * Available/known columns
       * Code
       * Type
       * Sec
       * Units
       * Instructor
       * Time
       * Place
       * Final
       * Max
       * Enr
       * Req
       * Nor
       * Rstr
       * Textbooks
       * Web
       * Status
       */
      let rowChildren = row.children;
      let statusObj = rowAlignmentData.__resolve('Status', rowChildren);
      let websiteObj = rowAlignmentData.__resolve('Web', rowChildren);
      let timeObj = rowAlignmentData.__resolve('Time', rowChildren);
      let textbooksObj = rowAlignmentData.__resolve('Textbooks', rowChildren);
      let placeObj = rowAlignmentData.__resolve('Place', rowChildren);
      let rstrObj = HELPERS.deEncode(rowAlignmentData.__resolve('Rstr', rowChildren));
      let wlObj = rowAlignmentData.__resolve('WL', rowChildren);
      courseResults[rowAlignmentData.__resolve('Code', rowChildren)] = {
        'college': HELPERS.deEncode(HELPERS.websoc.getAllText(collectedData.__get('college-title'))),
        'department': HELPERS.deEncode(HELPERS.websoc.getAllText(collectedData.__get('dept-title'))),
        'course_number': collectedData.__get('course-title-id'),
        'name': HELPERS.deEncode(collectedData.__get('course-title')),
        'type': rowAlignmentData.__resolve('Type', rowChildren),
        'section': rowAlignmentData.__resolve('Sec', rowChildren),
        'units': rowAlignmentData.__resolve('Units', rowChildren),
        'instructor': rowAlignmentData.__resolve('Instructor', rowChildren),
        'time': timeObj ? HELPERS.deEncode(timeObj).replaceAll("- ", "-").replaceAll(" -", "-") : null,
        'place': HELPERS.websoc.getAllText(placeObj),
        'final': HELPERS.deEncode(rowAlignmentData.__resolve('Final', rowChildren)),
        'max': rowAlignmentData.__resolve('Max', rowChildren),
        'enrolled': rowAlignmentData.__resolve('Enr', rowChildren),
        'newonlys': rowAlignmentData.__resolve('Nor', rowChildren),
        'waitlist': wlObj, // debatable - wlObj == 'n/a' ? null : wlObj,
        'required': rowAlignmentData.__resolve('Req', rowChildren),
        'restrictions': rstrObj ? rstrObj.length == 0 ? null : rstrObj : null,
        'textbooks': textbooksObj ? HELPERS.deEncode(textbooksObj.attributes.href) : null,
        'website': HELPERS.deEncode((websiteObj && websiteObj.attributes) ? websiteObj.attributes.href : websiteObj),
        'status': HELPERS.websoc.getAllText(statusObj),
        'class_comments': classComments
      };
    }
  }
  return HELPERS.responder(courseResults);
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let route = new URL(request.url).pathname;

  if(route.startsWith(ROUTE_OPTIONS)) {
    return await route_options(route.replace(ROUTE_OPTIONS, ''))
  } else if (route.startsWith(ROUTE_QUERY)) {
    if(!(request.method == 'POST' && (request.headers.get('content-type') || '').includes('json'))) {
      return HELPERS.responder({ "error": "Invalid content type. Current support is only for json." }, 406);
    }
    return await route_query(( (jsn) => { 
      let procd = {};
      for (let key in (jsn || {})) {
        procd[key.toLowerCase()] = jsn[key];
      }
      return procd;
    } )(await request.json()));
  } else {
    return HELPERS.responder({
      "message": "UCI WebReg Schedule of Classes API v0.2",
      "by": "Github: @jasoryeh",
      "_docs": {
        "usage": {
          "Querying Courses": "/query",
          "Course Query Options": "/options",
          "Restrictions": [
            "Method for requests to /query must be POST",
            "Content-Type must be in application/json"
          ]
        }
      }
    });
  }
}