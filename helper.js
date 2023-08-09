const removeChars = ['- ',',',"'","!","&","?","/",'"',"(",")"]
function makeURLFriendly(text) {
    let output = text
    if (output !== undefined) {
        for (let i = 0; i < removeChars.length; i++) {
            output = output.replaceAll(removeChars[i], '')
        }
        output = output.replaceAll(' ', '_')
        
        output = output.toLowerCase()
    } else output = ''
    return output
}

function redirectToHttps() {
    if (window.location.href.search('sharkside.ca') !== -1) {
        if (window.location.href.search('https') === -1) {
            let newURL = window.location.href.replace('http','https')
            location.replace(newURL)
        }
    }
}

function cleanLinks() {
    if (window.location.href.search('sharkside.ca') !== -1) {
        // live site
        let links = document.getElementsByTagName('a')
        for (let i = 0; i < links.length; i++) {
            if (links[i].href.search('.html') !== -1) {                
                links[i].href = links[i].href.replace('.html','')
            }

            if (links[i].href.search('/index') !== -1) {
                links[i].href = links[i].href.replace('/index', '')
            }
        }
    }
}