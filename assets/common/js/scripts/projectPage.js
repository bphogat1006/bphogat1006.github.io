
var projName = location.href.split("name=")[1]
var thisProject = getProject(projName)

// set page title
document.getElementById("projectTitle").innerHTML = thisProject.title

// load p5 script
var script = document.createElement('script')
script.src = "../js/p5/"+projName+"/sketch.js"
document.head.appendChild(script);

// edit buttons
var buttons = document.getElementsByTagName('i')
for(var i=0; i < buttons.length; i++) {
  // change color
  buttons[i].style.color = thisProject.colorTheme
}
// home button
document.getElementById("home").onclick = function() {
  window.history.back()
}
// info button
document.getElementById("info").onclick = function() {
  window.alert(thisProject.extraInfo)
}
// refresh buton
document.getElementById("refresh").onclick = function() {
  location.reload()
}
// src code button
document.getElementById("source_code").onclick = function() {
  window.open(script.src)
}