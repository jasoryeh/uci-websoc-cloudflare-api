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

const SEARCH_PAGE_URL = 'https://www.reg.uci.edu/perl/WebSoc';
const ROUTE_OPTIONS = '/options';
const ROUTE_QUERY = '/query';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

function rs(json, stat) {
  return new Response(JSON.stringify(json, null, 4), { headers: { "content-type": "application/json;charset=UTF-8", "Access-Control-Allow-Origin": "*"}, status: stat })
}

function r(json) {
  return new Response(JSON.stringify(json, null, 4), { headers: { "content-type": "application/json;charset=UTF-8", "Access-Control-Allow-Origin": "*" } });
}

function deEncode(str) {
  return unescape(str).replaceAll("&amp;", "&").replaceAll("&nbsp; ", "").replaceAll("&nbsp;", "").replaceAll("  ", " ").trim();
}

function selectorToData(parsed) {
  var data = {};
  for(let x = 0; x < parsed.length; x ++) {
    item = parsed[x];
    data[deEncode(item.attributes.value)] = deEncode(item.children[0]);
  }
  return data;
}

const OPTION_DEFAULTS = {
  'YearTerm': '2020-92', // todo: make this automatically update
  'ShowComments': undefined,
  'ShowFinals': "On",
  'Breadth': undefined,
  'Dept': undefined,
  'CourseNum': undefined,
  'Division': undefined,
  'CourseCodes': undefined,
  'InstrName': undefined,
  'CourseTitle': undefined,
  'ClassType': undefined,
  'Units': undefined,
  'Days': undefined,
  'StartTime': undefined,
  'EndTime': undefined,
  'MaxCap': undefined,
  'FullCourses': undefined,
  'FontSize': undefined,
  'CancelledCourses': undefined,
  'Bldg': undefined,
  'Room': undefined,
  'Submit': 'Display Web Results'
};

const OPTION_ROUTES = {
  'all': [ // all request fields
    //'Submit', // dynamic, but are 'Display Web Results' and 'Display Text Results', we also default to web results so we can parse them
    'YearTerm', // dynamic
    'ShowComments',
    'ShowFinals',
    'Breadth', // dynamic
    'Dept', // dynamic
    'CourseNum',
    'Division', // dynamic
    'CourseCodes',
    'InstrName',
    'CourseTitle',
    'ClassType', // dynamic
    'Units',
    'Days',
    'StartTime', // maybe
    'EndTime', // maybe
    'MaxCap',
    'FullCourses', // dynamic
    'FontSize',
    'CancelledCourses', // dynamic
    'Bldg',
    'Room'
  ],
  'preset': [ // request fields where inputs are pre-determined
    'YearTerm',
    'Breadth',
    'Dept',
    'Division',
    'ClassType',
    'StartTime',
    'EndTime',
    'FullCourses',
    'CancelledCourses',
  ],
  'any': [ // request fields where data is up to the user
    'ShowComments',
    'ShowFinals',
    'CourseNum',
    'CourseCodes',
    'InstrName',
    'CourseTitle',
    'Units',
    'Days',
    'MaxCap',
    'FontSize',
    'Bldg',
    'Room'
  ],
  "_docs": {
    "all": "All available fields that can be passed to /query",
    "preset": "All fields that need to be check against /query/<item> to be used in /query",
    "any": "All fields that are up to the user, but follows the same needs as WebSoc's search tool's restrictions"
  }
};

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let route = new URL(request.url).pathname;

  if(route.startsWith(ROUTE_OPTIONS)) {
    let subroute1 = route.replace(ROUTE_OPTIONS, '');
    if(subroute1 == '/' || subroute1 == '') {
      // Notify api that these are the current request options
      return r(OPTION_ROUTES);
    } else {
      for(let i = 0; i < OPTION_ROUTES.preset.length; i++) {
        let field = OPTION_ROUTES.preset[i];
        if( subroute1.toLowerCase() == ('/' + field.toLowerCase()) ) {
          let search_page = await (await fetch(SEARCH_PAGE_URL, {
            cf: {
              cacheTtl: 60, // this shouldn't update too often
              cacheEverything: true
            }
          })).text();
          let options = tXml(search_page, {attrName: 'name', attrValue: field})[0].children;
          return r(selectorToData(options));
        }
      }
    }
  } else if(route.startsWith(ROUTE_QUERY)) {
    if(request.method == 'POST') {
      let request_contenttype = request.headers.get("content-type") || "";
      
      let form = [ /* form data here */ ];
      if(request_contenttype.includes("application/json")) {
        let request_jsondata = await request.json();
        let processed_jsondata = {};
        for(let key in request_jsondata) {
          processed_jsondata[key.toLowerCase()] = request_jsondata[key];
        }

        if(request_jsondata && processed_jsondata) {
          for(let item of OPTION_ROUTES.all) {
            let fKey = encodeURIComponent(item);
            let fValue = encodeURIComponent(processed_jsondata[item.toLowerCase()] || OPTION_DEFAULTS[item]);
            if(fValue != 'undefined') {
              form.push(fKey + "=" + fValue);
            }
          }
        }
      } else {
        return rs({ "error": "Invalid content type. Current support is only for json." }, 406);
      }

      let courses = await (await fetch(SEARCH_PAGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        cf: {
          cacheTtl: 60, // this shouldn't update too often either
          cacheEverything: true
        },
        body: form.join("&")
      })).text();

      // check that we first used enough paramters
      let paramcheck = tXml(courses, {attrName: 'style', attrValue: 'color: red; font-weight: bold;'});
      if(paramcheck.length > 0) { // not enough query fields
        return r({ "error": "An error occurred.", "message": paramcheck[0].children[0].trim() });
      } else {
        let courselist = tXml.getElementsByClassName(courses, 'course-list')[0];
        let table = courselist.children[0];
        let courseResults = {};

        let current_college = null;
        let current_dept = null;
        let current_course_num = null;
        let current_course_name = null;
        for(let item of table.children) { // uci is super dumb for organizing stuff without labels so here we gooo
          if(item.attributes.class == 'college-title') {
            current_college = item.children[0].children[0];
          } else if(item.attributes.class == 'dept-title') {
            current_dept = item.children[0].children[0];
          } else if(item.children[0].attributes.class == 'CourseTitle') {
            current_course_num = deEncode(item.children[0].children[0]);
            current_course_name = deEncode(item.children[0].children[1].children[0].children[0]);
          } else if(item.attributes.bgcolor == "#FFFFCC") {
            let children = item.children;
            
            let statusObj = children[15].children[0];
            let websiteObj = children[14].children[0];
            courseResults[deEncode(children[0].children[0])] = {
              'college': deEncode(current_college),
              'department': deEncode(current_dept),
              'course_number': deEncode(current_course_num),
              'name': deEncode(current_course_name),
              'type': deEncode(children[1].children[0]),
              'section': deEncode(children[2].children[0]),
              'units': deEncode(children[3].children[0]),
              'instructor': deEncode(children[4].children[0]),
              'time': deEncode(children[5].children[0]).replaceAll("- ", "-").replaceAll(" -", "-"),
              'place': deEncode(children[6].children[0]),
              'final': deEncode(children[7].children[0]),
              'max': deEncode(children[8].children[0]),
              'enrolled': deEncode(children[9].children[0]),
              'waitlist': deEncode(children[10].children[0]),
              'required': deEncode(children[11].children[0]),
              'restrictions': deEncode(children[12].children[0]),
              'textbooks': deEncode(children[13].children[0].attributes.href),
              'website': deEncode((websiteObj && websiteObj.attributes) ? websiteObj.attributes.href : websiteObj),
              'status': deEncode((statusObj.children ? (statusObj.children[0].children ? statusObj.children[0].children[0] : statusObj.children[0]) : statusObj))
            };
            console.log(websiteObj);
          }
          // e7e7e7 is column titles
        }

        return r(courseResults);
      }
    } else {
      return rs({ "error": "Invalid request method. Only POST is accepted." }, 405);
    }
  } else {
    return r({
      "message": "UCI WebReg Schedule of Classes API v0.1",
      "by": "Github: @jasoryeh",
      "_docs": {
        "usage": {
          "Querying Courses": "/query",
          "Course Query Options": "/options",
          "Restrictions": [
            "Content-Type when POSTing to /query must be in JSON"
          ]
        }
      }
    })
  }
  //return new Response(search);
}
