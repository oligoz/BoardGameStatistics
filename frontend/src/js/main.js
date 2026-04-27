function adjustContentHeight() {
  let contentMain = document.getElementById("main-content");
  let contentWrapper = document.getElementById("content-wrapper");
  let navbar = document.getElementById("navbar");

  let contentWrapperHeight = contentWrapper.clientHeight;
  let navbarHeight = navbar.clientHeight;

  contentMain.style.height = contentWrapperHeight - navbarHeight + "px";
}

window.addEventListener("resize", () => {
  adjustContentHeight();
});
