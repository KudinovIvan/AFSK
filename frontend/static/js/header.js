let navbar_title_disposition = async () => {
    let navbar_template = document.getElementById('navbar_template').content;
    navbar_template.querySelector(".username").textContent += get_cookie("username");
    document.getElementById("user-greeting-text").appendChild(navbar_template);

    if (get_cookie("is_admin") === 'true') {
        let navbar_admin_buttons = document.getElementById('navbar-admin-template').content;
        document.getElementById("admin-header").appendChild(navbar_admin_buttons);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await navbar_title_disposition();
});
