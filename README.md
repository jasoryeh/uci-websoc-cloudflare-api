# UCI Schedule of Classes/WebSOC API

A more elegant way of reading UCI's schedule of classes, presented to you by json!

This API is live, and published to [https://uci-websoc.jasonho.workers.dev/](https://uci-websoc.jasonho.workers.dev/), and powered by Cloudflare Workers.

Although this API reads directly from the the Schedule of Classes' WebSoc, it does not return values verbatim, and tries to make all data returned consistent by stripping formatting, or likely human-created formatting such as random spaces in places.

## Usage

`GET` [https://uci-websoc.jasonho.workers.dev/](https://uci-websoc.jasonho.workers.dev/)
Shows quick information about the current API status.

`GET` [https://uci-websoc.jasonho.workers.dev/options](https://uci-websoc.jasonho.workers.dev/options)
Shows the options that can be passed via JSON (using `application/json` in `Content-Type`) to /query for course listings.

`GET` [https://uci-websoc.jasonho.workers.dev/options/<param that requires a preset value>](https://uci-websoc.jasonho.workers.dev/options/)
For every option under `preset` in `/query`, these have values that are pre-set and can be retrieved using `/query/<preset>` such as `/query/YearTerm`.
**Note:** This is case sensitive.

`POST` [https://uci-websoc.jasonho.workers.dev/query](https://uci-websoc.jasonho.workers.dev/query)
To query the WebSoc and return it in super beautiful JSON format, send a POST request with JSON body.
**Note:** Keys are case insensitive unlike `/options`


## More Notes

This API has enabled Cross Origin requests, so feel free to use this in your project. However, if this API's return status indicates it is our of requests, please feel free to deploy this on your own Cloudflare Account!