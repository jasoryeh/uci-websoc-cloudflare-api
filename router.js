const config = require('./config');
const txml = require('./tXml');
const WSP = require('./websoc_params');
const WebsocketResults = require('./websoc_results');

const FETCH_PARAMS = config.cache;

async function FETCH_PARAMS_WITH_KEY(data) {
    if(FETCH_PARAMS) {
        let copy = {
            ...FETCH_PARAMS,
            cacheKey: await sha256(data)
        };
        return copy;
    }
    return undefined;
}

async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);
  
    // hash the message
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
  
    // convert bytes to hex string
    const hashHex = hashArray.map(b => ("00" + b.toString(16)).slice(-2)).join("");
    console.log("request sha: " + hashHex);
    return hashHex;
}

function formatResponse(json, stat = 200) {
    return new Response(JSON.stringify(json, null, 4), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      },
      status: stat
    });
}

function errorResponse(reason, status = 400) {
    return formatResponse({
        "error": reason
    }, status);
}

function route(request, requestRoute, routes) {
    console.log("Route to " + requestRoute);
    for (let r in routes) {
        if (r == requestRoute) {
            console.log("    ...final " + r);
            return routes[r](request);
        }
    }
    return errorResponse("Unknown endpoint.", 404);
}

async function handleQuery(request) {
    if (request.method != 'POST') {
        return errorResponse("Invalid request method!", 405);
    }
    if ((request.headers.get('content-type') || '').includes('json')) {
        return errorResponse("Invalid content type.", 406);
    }

    let jsonBody = await request.json();
    for (let k in jsonBody) {
        jsonBody[k.toLowerCase()] = jsonBody[k];
    }

    let formBody = [];
    for (let item in WSP) {
        try {
            let proc = WSP[item].handle(jsonBody[item]);
            if (proc) {
                formBody.push(encodeURI(item) + "=" + encodeURI(proc));
            }
        } catch(ex) {
            return errorResponse("Failed to parse " + item);
        }
    }

    let finalFormBody = formBody.join("&");
    let courses = await (await fetch(config.websoc_endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        cf: await FETCH_PARAMS_WITH_KEY(finalFormBody),
        body: finalFormBody
    })).text();
    
    let parsed = txml().parse(courses);

    let process = new WebsocketResults(parsed);
    return process;
}

const routes = {
    "/": async function(request) {
        return formatResponse({
            "message": "UCI WebReg Schedule of Classes API v" + config.version,
            "by": config.authors,
            "routes": {
                "/options": "See JSON POST request body options.",
                "/query": "WebSOC request in JSON.",
                "/courses": "WebSOC request with courses extracted.",
            }
        });
    },
    "/favicon.ico": async (request) => {
        return new Response("");
    },
    "/options": async (request) => {
        let subroute = new URL(request.url).pathname.replace("/options", '');
        if (subroute.length <= 0 || subroute.replace("/", '').length <= 0) {
            return formatResponse(Object.keys(WSP));
        }

        let subRoutes = {};
        for (let sr in WSP) {
            subRoutes["/" + sr] = async (request) => {
                /* TODO: Parse form page, and return options
                let fetch_page = await fetch(API_ENDPOINT, {
                    cf: FETCH_PARAMS
                });
                let page = await fetch_page.text();
                let form_item = SimpleXMLParser(search_page, {
                    attrName: 'name',
                    attrValue: option_key
                });
        
                if (!form_item || form_item.length == 0 || !form_item[0].children) {
                    return HELPERS.handleRequest({
                        "error": "Option lookup failed!"
                    });
                }*/
        
                let options = {};
                for (item of form_item[0].children) {
                    options[item.attributes.value] = item.children[0];
                }

                let opts = WSP[sr];
                let defVal = opts.default();
                return {
                    default: (defVal || null)
                };
            };
        }

        return route(request, subroute, subRoutes);
    },
    "/query": async (request) => {
        return formatResponse(
            await handleQuery(request)
        );
    },
    "/courses": async (request) => {
        return formatResponse(
            (await handleQuery(request)).getCourses()
        );
    },
    "/test": async (request) => {
        return formatResponse({});
    }
};

module.exports = {
    route: async function(request) {
        let rr = new URL(request.url).pathname;
        return route(request, rr, routes);
    },
    formatResponse: formatResponse,
    errorResponse: errorResponse
}