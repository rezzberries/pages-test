const project = 
{
    name: "Pages Test",
    github: 
    {
        user: "rezzberries",
        repo: "pages-test",
        branch: "master"
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

function getContentsApiUrl(path)
{
    return `https://api.github.com/repos/${project.github.user}/${project.github.repo}/contents/${path}/?ref=${project.github.branch}`
}

async function gatherAvailableVersions(dir)
{
    let versionsRequest = await fetch(getContentsApiUrl(`javadocs/${dir}`));
    let versionDirContents = await versionsRequest.json();

    let versionsList = [];

    for (let version of versionDirContents)
    {
        versionsList.unshift(`<li><a href="${version.path}"><span class="monospace">${version.name}</span></a></li>`)
    }

    return versionsList.join("");
}

async function loadJavadocsList()
{
    let javadocsRequest = await fetch(getContentsApiUrl("javadocs"));
    let javadocsDirContents = await javadocsRequest.json();

    let docsList = [];
    let pendingRequests = [];

    for (let dir of javadocsDirContents)
    {
        if (dir.type !== "dir") { continue; }

        let pending = gatherAvailableVersions(dir.name)
            .then(availableVersions => 
            {
                let html =
                    `<div class="project-card">
                        <div class="project-title">
                            <h2>${dir.name}</h2>
                        </div>
                        <div class="versions-list">
                            <ul>${availableVersions}</ul>
                        </div>
                    </div>`;
                
                docsList.push({name: dir.name, html: html});
            });

        pendingRequests.push(pending);
    }

    await Promise.all(pendingRequests);

    docsList.sort((a, b) => a.name.localeCompare(b.name));
    
    document.getElementById("docs-list").innerHTML = docsList.map(docs => docs.html).join("");
    document.getElementById("loading-display").classList.add("hidden");
}

function index()
{
    const init = () =>
    {
        document.title = project.name + " / Javadocs";

        document.querySelector("#header-text h1 .bold").innerText = project.name;
        document.querySelector("#github-link").href = `https://github.com/${project.github.user}/${project.github.repo}`;

        showErrorByQuery();
        loadJavadocsList();
    }

    document.onreadystatechange = event =>
    {
        if (event.target.readyState === "interactive") { init(); }
    }
}
