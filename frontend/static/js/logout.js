let clean_cookie = async () => {
    await delete_cookie("access");
    await delete_cookie("username");
    await delete_cookie("refresh");
    await delete_cookie("is_admin");
}


let logout = async () => {
    await clean_cookie().then(()=>{
        reload_to_page('');
    })
}



