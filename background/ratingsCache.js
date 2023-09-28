chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        url = `https://planetterp.com/api/v1/professor?name=${request.prof}`

        caches.match(url).then((response) => {
            if (response !== undefined) {
                response.json().then(json => {
                    console.log("serving cached response " + json)
                    sendResponse({error: false, data: json})
                })
            } else {
                console.log("fetching for "+request.prof+" @ url "+`https://planetterp.com/api/v1/professor?name=${request.prof}`)
                fetch(`https://planetterp.com/api/v1/professor?name=${request.prof}`)
                .then((response) => {
                    let responseClone = response.clone();
        
                    caches.open("v1").then((cache) => {
                        var headers = new Headers(responseClone.headers);
					    headers.append('sw-fetched-on', new Date().getTime());
                        responseClone.blob().then(body=>{
                            console.log("putting dateed response")
                            console.log(JSON.stringify(Object.fromEntries(headers)))
                            cache.put(`https://planetterp.com/api/v1/professor?name=${request.prof}`, 
                            new Response(
                                body,
                                {
                                    status: responseClone.status,
                                    statusText: responseClone.statusText,
                                    headers: headers
                                }
                            ));
                        })
                    });
                    response.json().then(json => {
                        sendResponse({error: false, data: json})
                    })
                })
            }
        })
        
        return true;

        /* 
        console.log(url)
        fetch(url).then(response=>{
            console.log("sending data")
            sendResponse({error: false, data: response.json()})
        })
        .catch(e => sendResponse({error: e.message}));
        
        return true;*/

        /*
        try {
            let resp = {error: true};
            sendResponse({})
            attemptGet = await chrome.storage.local.get([request.prof])
            if (attemptGet.profName) {
                console.log(`${request.prof} already recorded!`)
                resp = attemptGet.profName
                sendResponse(resp)
            }
            else {
                console.log(`${request.prof} recording!`)
                x = request.prof
                data = {error: false, average_rating: "BLA", profName: request.prof}
                setData = await chrome.storage.local.set({x: data})
                resp = data
                console.log(`Recorded: ${resp.profName}`)
                sendResponse({error: true})
                console.log("I shouldnt be able to see this message")
            }
            sendResponse(resp)
        } catch (err) {
            console.log(err)
            sendResponse({error: true})
        }
        */

        /*chrome.storage.local.set({"test": true}).then(()=>{
            console.log("DONE, doing search")
            chrome.storage.local.get(["notest"]).then(result=>{
                console.log("test found!: ", result)
            })

        })*/

        // sendResponse({error: true, average_rating: "BLA"});
          
    }
  );