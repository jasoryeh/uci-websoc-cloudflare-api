/* tXML PARSER via https://github.com/TobiasNickel/tXml */
var tXml=function(){function q(b,c){function d(h){for(var m=[];b[a];)if(60==b.charCodeAt(a)){if(47===b.charCodeAt(a+1)){var f=a+2;a=b.indexOf(">",a);if(-1==b.substring(f,a).indexOf(h))throw h=b.substring(0,a).split("\n"),Error("Unexpected close tag\nLine: "+(h.length-1)+"\nColumn: "+(h[h.length-1].length+1)+"\nChar: "+b[a]);a+1&&(a+=1);break}else if(33===b.charCodeAt(a+1)){if(45==b.charCodeAt(a+2)){for(f=a;-1!==a&&(62!==b.charCodeAt(a)||45!=b.charCodeAt(a-1)||45!=b.charCodeAt(a-2)||-1==a);)a=b.indexOf(">",
a+1);-1===a&&(a=b.length);!0===c.keepComments&&m.push(b.substring(f,a+1))}else if(91===b.charCodeAt(a+2)&&91===b.charCodeAt(a+8)&&"cdata"===b.substr(a+3,5).toLowerCase()){f=b.indexOf("]]\x3e",a);-1==f?(m.push(b.substr(a+9)),a=b.length):(m.push(b.substring(a+9,f)),a=f+3);continue}else{f=a+1;a+=2;for(var n=!1;(62!==b.charCodeAt(a)||!0===n)&&b[a];)91===b.charCodeAt(a)?n=!0:!0===n&&93===b.charCodeAt(a)&&(n=!1),a++;m.push(b.substring(f,a))}a++;continue}f=g();m.push(f);"?"===f.tagName[0]&&(m.push.apply(m,
f.children),f.children=[])}else f=a,a=b.indexOf("<",a)-1,-2===a&&(a=b.length),f=b.slice(f,a+1),0<f.trim().length&&m.push(f),a++;return m}function e(){for(var h=a;-1===r.indexOf(b[a])&&b[a];)a++;return b.slice(h,a)}function g(){a++;for(var h=e(),m={},f=[];62!==b.charCodeAt(a)&&b[a];){var n=b.charCodeAt(a);if(64<n&&91>n||96<n&&123>n){n=e();for(var k=b.charCodeAt(a);k&&39!==k&&34!==k&&!(64<k&&91>k||96<k&&123>k)&&62!==k;)a++,k=b.charCodeAt(a);if(39===k||34===k){if(k=a+1,a=b.indexOf(b[a],k),k=b.slice(k,
a),-1===a)return{tagName:h,attributes:m,children:f}}else k=null,a--;m[n]=k}a++}47!==b.charCodeAt(a-1)?"script"==h?(f=a+1,a=b.indexOf("\x3c/script>",a),f=[b.slice(f,a)],a+=9):"style"==h?(f=a+1,a=b.indexOf("</style>",a),f=[b.slice(f,a)],a+=8):-1===x.indexOf(h)?(a++,f=d(h)):a++:a++;return{tagName:h,attributes:m,children:f}}function l(){var h=(new RegExp("\\s"+c.attrName+"\\s*=['\"]"+c.attrValue+"['\"]")).exec(b);return h?h.index:-1}c=c||{};var a=c.pos||0,r="\r\n\t>/= ",x=c.noChildNodes||["img","br",
"input","meta","link"],p=null;if(void 0!==c.attrValue)for(c.attrName=c.attrName||"id",p=[];-1!==(a=l());)a=b.lastIndexOf("<",a),-1!==a&&p.push(g()),b=b.substr(a),a=0;else p=c.parseNode?g():d("");c.filter&&(p=t(p,c.filter));c.setPos&&(p.pos=a);return p}function v(b){var c={};if(!b.length)return"";if(1===b.length&&"string"==typeof b[0])return b[0];b.forEach(function(e){if("object"===typeof e){c[e.tagName]||(c[e.tagName]=[]);var g=v(e.children);c[e.tagName].push(g);Object.keys(e.attributes).length&&
(g._attributes=e.attributes)}});for(var d in c)1==c[d].length&&(c[d]=c[d][0]);return c}function w(b,c){c=void 0===c?{}:c;var d={};if(!b.length)return d;if(1===b.length&&"string"==typeof b[0])return Object.keys(c).length?{_attributes:c,value:b[0]}:b[0];b.forEach(function(e){if("object"===typeof e){d[e.tagName]||(d[e.tagName]=[]);var g=w(e.children||[],e.attributes);d[e.tagName].push(g);Object.keys(e.attributes).length&&(g._attributes=e.attributes)}});return d}function t(b,c,d,e){d=void 0===d?0:d;e=
void 0===e?"":e;var g=[];b.forEach(function(l,a){"object"===typeof l&&c(l,a,d,e)&&g.push(l);if(l.children){var r=t(l.children,c,d+1,(e?e+".":"")+a+"."+l.tagName);g=g.concat(r)}});return g}function u(b){if(Array.isArray(b)){var c="";b.forEach(function(d){c+=" "+u(d);c=c.trim()});return c}return"object"===typeof b?u(b.children):" "+b}return{parse:q,simplify:v,simplifyLostLess:w,filter:t,stringify:function(b){function c(e){if(e)for(var g=0;g<e.length;g++)if("string"==typeof e[g])d+=e[g].trim();else{var l=
void 0,a=e[g];d+="<"+a.tagName;for(l in a.attributes)d=null===a.attributes[l]?d+(" "+l):-1===a.attributes[l].indexOf('"')?d+(" "+l+'="'+a.attributes[l].trim()+'"'):d+(" "+l+"='"+a.attributes[l].trim()+"'");d+=">";c(a.children);d+="</"+a.tagName+">"}}var d="";c(b);return d},toContentString:u,getElementById:function(b,c,d){b=q(b,{attrValue:c});return d?tXml.simplify(b):b[0]},getElementsByClassName:function(b,c,d){b=q(b,{attrName:"class",attrValue:"[a-zA-Z0-9- ]*"+c+"[a-zA-Z0-9- ]*"});return d?tXml.simplify(b):
b}}}();

//const API_ENDPOINT = 'https://www.reg.uci.edu/perl/WebSoc';
// test - 
const API_ENDPOINT = 'https://FineSafeDefinition.jasoryeh.repl.co';
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