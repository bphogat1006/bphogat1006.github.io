
function createProjectItem(link, title, description) {
  var project = document.createElement("div")
  var mLink = document.createElement("a")
  var mTitle = document.createElement("h4")
  var mDescription = document.createElement("p")

  project.className = "project-list-item"
  mLink.href = "assets/common/html/projectPage.html?name="+link
  mLink.appendChild(document.createTextNode(title))
  mTitle.innerHTML = mLink.outerHTML
  mDescription.innerHTML = description

  project.appendChild(mTitle)
  project.appendChild(mDescription)

  return project
}


var projectsContainer = document.getElementById("project-list")
for(var i=0; i < projectInfo.length; i++) {
  var proj = createProjectItem(projectInfo[i].name, projectInfo[i].title, projectInfo[i].description)
  if(i < projectInfo.length-1) {
    proj.style.borderBottom="2px solid black"
  }
  projectsContainer.appendChild(proj)
}