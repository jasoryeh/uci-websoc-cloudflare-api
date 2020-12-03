# 📙 UCI Schedule of Classes WebSOC API

🎉 A more elegant way of reading UCI's schedule of classes, presented to you in JSON!

This API is live, and published to [https://uci-websoc.jasonho.workers.dev/](https://uci-websoc.jasonho.workers.dev/), and powered by Cloudflare Workers, it should be up for as long as I have a Cloudflare account and have quota to use.

Although this API reads directly from the the Schedule of Classes' WebSoc, it does not return values verbatim, and tries to make all data returned consistent by stripping formatting, or likely human-created formatting such as random spaces in places.

## Usage

`GET` [https://uci-websoc.jasonho.workers.dev/](https://uci-websoc.jasonho.workers.dev/)
Shows quick information about the current API status.

`GET` [https://uci-websoc.jasonho.workers.dev/options](https://uci-websoc.jasonho.workers.dev/options)
Shows the options that can be passed via JSON (using `application/json` in `Content-Type`) to /query for course listings.

`GET` [https://uci-websoc.jasonho.workers.dev/options/your_param](https://uci-websoc.jasonho.workers.dev/options/)
For every option under `preset` in `/query`, these have values that are pre-set and can be retrieved using `/query/<preset>` such as `/query/YearTerm`.
**Note:** This is case sensitive.

`POST` [https://uci-websoc.jasonho.workers.dev/query](https://uci-websoc.jasonho.workers.dev/query)
To query the WebSoc and return it in super beautiful JSON format, send a POST request with JSON body.
**Note:** Keys are case insensitive unlike `/options`


# More Notes

This API has enabled Cross Origin requests, so feel free to use this in your project. However, if this API's return status indicates it is our of requests, please feel free to deploy this on your own Cloudflare Account!

### Projects Used
☁️ [`Cloudflare Workers`](https://workers.cloudflare.com/) from Cloudflare - A serverless, fast, and free service running apps like ours on their global network.

🤠 [`Wrangler`](https://github.com/cloudflare/wrangler) CLI for managing and developing Cloudflare workers.

📄 [`tXML`](https://github.com/TobiasNickel/tXml) by @TobiasNickel - A extremely small and tiny XML parser that we include in this worker to do the heavy lifting of parsing and reading values from WebSoc.