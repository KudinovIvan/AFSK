let sendLoginRequest = async () => {
    let Url = root_url + 'api/auth/jwt/login/'

    let Headers = {
        'Content-Type': 'application/json',
    };

    let Body = {
        "username": await document.getElementById('InputLogin').value,
        "password": await document.getElementById('InputPassword').value
    };

    let response = await fetch(Url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: Headers,
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(Body)
    })


    let is_success = true;

    if (!response.ok) {
        document.getElementById('formValidate').textContent = 'Произошла ошибка, проверьте логин или пароль';
        is_success = false;
    }

    return {
        response: await response.json(),
        username: Body.username,
        success: is_success
    }
}

let login = async () => {
    let received_tokens = await sendLoginRequest().then(res => {
        return res
    })

    if (received_tokens.success === true) {
        await set_cookie("access", received_tokens.response.access, 0, 0, 1/24);
        await set_cookie("refresh", received_tokens.response.refresh, 0, 0, 10);
        await set_cookie("is_admin", received_tokens.response.is_admin, 0, 0, 10);
        await set_cookie("username", received_tokens.username);
        await reload_to_page("links")
    } else {
        await reload_to_page("login")
    }
}


