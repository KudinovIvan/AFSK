let getLinks = async () => {
    let Url = clean_root_url() + 'api/v1/urls/';

    let Headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + get_cookie("access")
    };

    let response = await fetch(Url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: Headers,
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    })

    if (!response.ok) {
        await reload_to_page("")
    }

    return await response.json();
}

let feed_content_disposition = async () => {
    await getLinks().then(res => {
            let feed_template = document.getElementById('feed_template').content;
            for (let elem in res) {
                if (res.hasOwnProperty(elem)) {
                    let feed_template_node = document.importNode(feed_template, true)
                    feed_template_node.querySelector(".link").textContent = res[elem].name;
                    feed_template_node.querySelector(".link").href = res[elem].url;
                    document.getElementById("feed").appendChild(feed_template_node);
                }
            }
    })
}

document.addEventListener("DOMContentLoaded", async () => {
    if (get_cookie("access") === null && get_cookie("refresh") !== null){
        await updateAccessToken();
    }
    await feed_content_disposition();
});

