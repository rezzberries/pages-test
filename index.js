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
