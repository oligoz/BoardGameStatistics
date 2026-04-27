export const centerContent = () => {
  let contentMain = document.getElementById("main-content");
  let centerContent = document.getElementById("center-content");

  if (centerContent) {
    centerContent.style.height = contentMain.clientHeight + "px";
    centerContent.classList.add("align-content-center");
  }
};
