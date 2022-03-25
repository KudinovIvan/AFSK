document.addEventListener("DOMContentLoaded",  async () => {
    if (get_cookie("refresh") === null) {
        await reload_to_page('login');
    } else if (get_cookie("refresh") !== null){
        await updateAccessToken();
        await reload_to_page('links');
    }
})
