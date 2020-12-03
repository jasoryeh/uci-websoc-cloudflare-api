/* tXML PARSER */
function tXml(b,c){function d(){for(var k=[];b[a];)if(60==b.charCodeAt(a)){if(47===b.charCodeAt(a+1)){a=b.indexOf(">",a);a+1&&(a+=1);break}else if(33===b.charCodeAt(a+1)){if(45==b.charCodeAt(a+2)){for(;-1!==a&&(62!==b.charCodeAt(a)||45!=b.charCodeAt(a-1)||45!=b.charCodeAt(a-2)||-1==a);)a=b.indexOf(">",a+1);-1===a&&(a=b.length)}else if(91===b.charCodeAt(a+2)&&91===b.charCodeAt(a+8)&&"cdata"===b.substr(a+3,5).toLowerCase()){var l=b.indexOf("]]\x3e",a);-1==l?(k.push(b.substr(a+8)),a=b.length):(k.push(b.substring(a+
  9,l)),a=l+3);continue}else for(a+=2;62!==b.charCodeAt(a)&&b[a];)a++;a++;continue}l=g();k.push(l)}else l=a,a=b.indexOf("<",a)-1,-2===a&&(a=b.length),l=b.slice(l,a+1),0<l.trim().length&&k.push(l),a++;return k}function e(){for(var k=a;-1===p.indexOf(b[a])&&b[a];)a++;return b.slice(k,a)}function g(){a++;for(var k=e(),l={},m=[];62!==b.charCodeAt(a)&&b[a];){var f=b.charCodeAt(a);if(64<f&&91>f||96<f&&123>f){var q=e();for(f=b.charCodeAt(a);f&&39!==f&&34!==f&&!(64<f&&91>f||96<f&&123>f)&&62!==f;)a++,f=b.charCodeAt(a);
  if(39===f||34===f){if(f=a+1,a=b.indexOf(b[a],f),f=b.slice(f,a),-1===a)return{tagName:k,attributes:l,children:m}}else f=null,a--;l[q]=f}a++}47!==b.charCodeAt(a-1)?"script"==k?(m=a+1,a=b.indexOf("\x3c/script>",a),m=[b.slice(m,a)],a+=9):"style"==k?(m=a+1,a=b.indexOf("</style>",a),m=[b.slice(m,a)],a+=8):-1==r.indexOf(k)&&(a++,m=d(q)):a++;return{tagName:k,attributes:l,children:m}}function h(){var k=(new RegExp("\\s"+c.attrName+"\\s*=['\"]"+c.attrValue+"['\"]")).exec(b);return k?k.index:-1}c=c||{};var a=
  c.pos||0,p="\r\n\t>/= ",r=c.noChildNodes||["img","br","input","meta","link"],n=null;if(void 0!==c.attrValue)for(c.attrName=c.attrName||"id",n=[];-1!==(a=h());)a=b.lastIndexOf("<",a),-1!==a&&n.push(g()),b=b.substr(a),a=0;else n=c.parseNode?g():d();c.filter&&(n=tXml.filter(n,c.filter));c.setPos&&(n.pos=a);return n}
  tXml.simplify=function(b){var c={};if(!b.length)return"";if(1===b.length&&"string"==typeof b[0])return b[0];b.forEach(function(e){if("object"===typeof e){c[e.tagName]||(c[e.tagName]=[]);var g=tXml.simplify(e.children);c[e.tagName].push(g);Object.keys(e.attributes).length&&(g._attributes=e.attributes)}});for(var d in c)1==c[d].length&&(c[d]=c[d][0]);return c};
  tXml.simplifyLostLess=function(b,c){c=void 0===c?{}:c;var d={};if(!b.length)return"";if(1===b.length&&"string"==typeof b[0])return Object.keys(c).length?{_attributes:c,value:b[0]}:b[0];b.forEach(function(e){if("object"===typeof e){d[e.tagName]||(d[e.tagName]=[]);var g=tXml.simplifyLostLess(e.children||[],e.attributes);d[e.tagName].push(g);Object.keys(e.attributes).length&&(g._attributes=e.attributes)}});return d};
  tXml.filter=function(b,c,d,e){d=void 0===d?0:d;e=void 0===e?"":e;var g=[];b.forEach(function(h,a){"object"===typeof h&&c(h,a,d,e)&&g.push(h);if(h.children){var p=tXml.filter(h.children,c,d+1,(e?e+".":"")+a+"."+h.tagName);g=g.concat(p)}});return g};
  tXml.stringify=function(b){function c(e){if(e)for(var g=0;g<e.length;g++)if("string"==typeof e[g])d+=e[g].trim();else{var h=void 0,a=e[g];d+="<"+a.tagName;for(h in a.attributes)d=null===a.attributes[h]?d+(" "+h):-1===a.attributes[h].indexOf('"')?d+(" "+h+'="'+a.attributes[h].trim()+'"'):d+(" "+h+"='"+a.attributes[h].trim()+"'");d+=">";c(a.children);d+="</"+a.tagName+">"}}var d="";c(b);return d};
  tXml.toContentString=function(b){if(Array.isArray(b)){var c="";b.forEach(function(d){c+=" "+tXml.toContentString(d);c=c.trim()});return c}return"object"===typeof b?tXml.toContentString(b.children):" "+b};tXml.getElementById=function(b,c,d){b=tXml(b,{attrValue:c});return d?tXml.simplify(b):b[0]};tXml.getElementsByClassName=function(b,c,d){b=tXml(b,{attrName:"class",attrValue:"[a-zA-Z0-9- ]*"+c+"[a-zA-Z0-9- ]*"});return d?tXml.simplify(b):b};

const API_ENDPOINT = 'https://www.reg.uci.edu/perl/WebSoc';
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

function rs(json, stat = undefined) {
  return new Response(JSON.stringify(json, null, 4), { headers: { "content-type": "application/json;charset=UTF-8", "Access-Control-Allow-Origin": "*"}, status: stat })
}

function deEncode(str) {
  return str ? unescape(str).replaceAll("&amp;", "&").replaceAll("&nbsp; ", "").replaceAll("&nbsp;", "").replaceAll("  ", " ").trim() : undefined;
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
    return rs(OPTION_ROUTES); // list information about query options
  } else {
    // show options for ones with preset options
    for (let v of OPTION_ROUTES['preset']) {
      if(subroute.toLowerCase() == ('/' + v.toLowerCase())) {
        let search_page = await (await fetch(API_ENDPOINT, { cf: CF_FETCH_PARAMS })).text();
        let options = tXml(search_page, {attrName: 'name', attrValue: v})[0].children;   
        let data = {};
        for (let item of options) {
          data[deEncode(item.attributes.value)] = deEncode(item.children[0])
        }
        return rs(data);
      }
    }
    return rs({"error": "Invalid query option: " + subroute});
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
    return rs({ 
      "error": "An error occurred when sending your request to the remote API.", 
      "message": tXml(courses, {attrName: 'style', attrValue: 'color: red; font-weight: bold;'})[0].children 
    });
  }

  // parse
  let courselist = tXml.getElementsByClassName(courses, 'course-list')[0];
  let courseResults = {}; // returned to user
  let tableRows = courselist.children[0].children;

  let collectedData = {};
  let rowAlignmentData = {};
  let d_get = function(type) {
    return collectedData[type] ? collectedData[type] : null;
  }
  let rdata_get = function(type, rowChildren) {
    rad_idx = rowAlignmentData[type];
    return typeof(rad_idx) == 'number' ? (rowChildren[rad_idx] ? rowChildren[rad_idx].children[0] : null) : null;
  }
  let res_child = function(element) {
    let tmp = element;
    while (tmp && tmp.children && tmp.children.length > 0) {
      tmp = tmp.children[0];
    }
    return tmp;
  }

  let tableRowsLength = tableRows.length;
  for (let rowidx = 0; rowidx < tableRowsLength; rowidx++) {
    let row = tableRows[rowidx];
    let rowClass = row.attributes.class;
    let bgColor = row.attributes.bgcolor;
    if (rowClass) {
      if (!rowClass.includes("-bar")) {
        collectedData[row.attributes.class] = row;
      }
      continue;
    } else if (bgColor == "#E7E7E7") {
      rowAlignmentData = {};
      let size = row.children.length;
      for (let idx = 0; idx < size; idx++) {
        rowAlignmentData[row.children[idx].children[0]] = idx;
      }
      continue;
    } else if (bgColor == '#fff0ff') {
      let work = row.children[0].children;
      if (work.length >= 2 && work[1] && work[1].attributes) {
        if(work[1].attributes.class && work[1].attributes.class == 'Pct100') {
          collectedData['course-comment'] = work[1].children[0].children[0].children;
        } else if(work[1].attributes.face/* && work[1].attributes.face == 'sans-serif'*/) {
          collectedData['course-title-id'] = deEncode(work[0]);
          collectedData['course-title'] = work[1].children[0].children[0];
        }
      }
    } else {
      if(row.attributes.length <= 0) { continue; } // course comment for previous row
      let courseComments = null;
      if (tableRowsLength != (rowidx + 1)) {
        let followingRow = tableRows[rowidx + 1];
        if (followingRow.attributes.length <= 0 || followingRow.attributes.bgcolor == '#FFFFCC' 
            || (followingRow.children.length > 0 && followingRow.children[0].children[0] == '&nbsp;') ) {
          courseComments = followingRow.children;
          rowidx++; // makes sure to skip row following
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
      let statusObj = rdata_get('Status', rowChildren);
      let websiteObj = rdata_get('Web', rowChildren);
      let timeObj = rdata_get('Time', rowChildren);
      let textbooksObj = rdata_get('Textbooks', rowChildren);
      let placeObj = rdata_get('Place', rowChildren);
      let rstrObj = deEncode(rdata_get('Rstr', rowChildren));
      let wlObj = rdata_get('WL', rowChildren);
      courseResults[rdata_get('Code', rowChildren)] = {
        'college': deEncode(res_child(d_get('college-title'))),
        'department': deEncode(res_child(d_get('dept-title'))),
        'course_number': d_get('course-title-id'),
        'name': deEncode(d_get('course-title')),
        'type': rdata_get('Type', rowChildren),
        'section': rdata_get('Sec', rowChildren),
        'units': rdata_get('Units', rowChildren),
        'instructor': rdata_get('Instructor', rowChildren),
        'time': timeObj ? deEncode(timeObj).replaceAll("- ", "-").replaceAll(" -", "-") : null,
        'place': res_child(placeObj),
        'final': deEncode(rdata_get('Final', rowChildren)),
        'max': rdata_get('Max', rowChildren),
        'enrolled': rdata_get('Enr', rowChildren),
        'newonlys': rdata_get('Nor', rowChildren),
        'waitlist': wlObj, // debatable - wlObj == 'n/a' ? null : wlObj,
        'required': rdata_get('Req', rowChildren),
        'restrictions': rstrObj.length == 0 ? null : rstrObj,
        'textbooks': textbooksObj ? deEncode(textbooksObj.attributes.href) : null,
        'website': deEncode((websiteObj && websiteObj.attributes) ? websiteObj.attributes.href : websiteObj),
        'status': res_child(statusObj)
      };
    }
  }
  return rs(courseResults);
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
      return rs({ "error": "Invalid content type. Current support is only for json." }, 406);
    }
    return await route_query(( (jsn) => { let procd = {}; for (let key in (jsn || {})) { procd[key.toLowerCase()] = jsn[key]; return procd; } } )(await request.json()));
  } else {
    return rs({
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