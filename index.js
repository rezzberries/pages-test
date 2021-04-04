const project = 
{
    name: "Pages Test",
    github: 
    {
        user: "rezzberries",
        repo: "pages-test"
    }
};

function getQueryByName(name, url = window.location.search)
{
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    let results = regex.exec(url);

    if (!results) { return null; }
    if (!results[2]) { return ""; }

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function redirect404()
{
    if (getQueryByName("redirected")) { return; }

    let redirect = `/?redirected&error=404#${window.location.pathname}`;
    if (window.location.hostname.includes("github.io")) { redirect = `/${project.github.repo}${redirect}`; }

    console.log(`404. Redirecting to: ${redirect}`);
    window.location.href = redirect;
}

function showErrorByQuery()
{
    let error = getQueryByName("error");
    if (!error) { return; }

    let errorDisplay = document.getElementById("error-display");
    errorDisplay.classList.remove("hidden");

    let html = `<h1>${error}</h1>`;

    if (error === "404")
    {
        html += `<p>Unknown Page: <span class="monospace">${window.location.hostname + window.location.hash.replace(/^#/, "")}</span></p>`;
    }

    errorDisplay.innerHTML = html;
}

function index()
{
    const init = () =>
    {
        document.title = project.name + " / Javadocs";

        document.querySelector("#header-text h1 .bold").innerText = project.name;
        document.querySelector("#github-link").href = `https://github.com/${project.github.user}/${project.github.repo}`;
        
        showErrorByQuery();
    }

    document.onreadystatechange = event =>
    {
        if (event.target.readyState === "interactive") { init(); }
    }
}
