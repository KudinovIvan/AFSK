let clean_root_url = () => {
    return window.location.protocol + "//" + window.location.host + "/"

}

let root_url = clean_root_url();

let reload_to_page = (url) => {
    document.location.href = clean_root_url() + url;
}

let get_cookie = (cookie_name) => {
    let results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

    if (results) {
        return (unescape(results[2]));
    } else {
        return null;
    }
}

let set_cookie = (name, value, exp_y, exp_m, exp_d, path, domain, secure) => {
    let cookie_string = name + "=" + escape(value);
    if (exp_y) {
        let expires = new Date(exp_y, exp_m, exp_d);
        cookie_string += "; expires=" + expires.toGMTString();
    }
    if (path)
        cookie_string += "; path=" + escape(path);
    if (domain)
        cookie_string += "; domain=" + escape(domain);
    if (secure)
        cookie_string += "; secure";
    document.cookie = cookie_string;
}

let delete_cookie = (cookie_name) => {
    let cookie_date = new Date();  // Текущая дата и время
    cookie_date.setTime(cookie_date.getTime() - 1);
    document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
}

let updateAccessToken = async () => {
    let sendRequest = async () => {
        let Url = root_url + 'api/auth/jwt/refresh/'

        let Headers = {
            'Content-Type': 'application/json',
        };

        let Body = {
            "refresh": get_cookie("refresh")
        };

        const response = await fetch(Url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: Headers,
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(Body)
        })

        if (!response.ok) {
            await reload_to_page('login');
        }

        return await response.json();
    }
    await sendRequest().then(res => {
        set_cookie("access", res.access, 0, 0, 1/24);
    })
}

