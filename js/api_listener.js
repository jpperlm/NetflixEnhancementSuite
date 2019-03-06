chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.cs_request_type == 'omdb_title') {
        const url = 'https://www.perlmanlabs.com/api/omdb/';
        // const url = "http://localhost:8080/api/omdb/";
        fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            title: request.title,
          }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }).then((response) =>{
          return response.json();
        }).then((res)=>{
          sendResponse(res);
        });
        return true;
      }
    }
);
