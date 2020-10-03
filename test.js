handleRequest({ 
    "url": "https://example.com/query", 
    "method": "POST", 
    "json": function() { 
        return {"Dept": "Math"}; 
    }, 
    "headers": { 
        "get": function() { 
            return "application/json"; 
        } 
    } 
});