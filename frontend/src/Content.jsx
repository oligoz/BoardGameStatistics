import { use, useEffect } from "react";
import App from "./App";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import "./js/main.js";
import useUserStore from "./store/userStore.js";

function Content() {
  const fetchUser = useUserStore((state) => state.fetchUser);

  function adjustContentHeight() {
    let contentMain = document.getElementById("main-content");
    let contentWrapper = document.getElementById("content-wrapper");
    let navbar = document.getElementById("navbar");
    let contentWrapperHeight = contentWrapper.clientHeight;
    let navbarHeight = navbar.clientHeight;

    contentMain.style.height = contentWrapperHeight - navbarHeight + "px";
  }

  useEffect(() => {
    window.addEventListener("resize", () => {
      adjustContentHeight();
    });

    adjustContentHeight();
    fetchUser();
  }, []);

  return (
    <div className="app-container d-flex">
      <SideBar />
      <div
        id="content-wrapper"
        className="content-wrapper overflow-auto flex-grow-1 vh-100"
      >
        <NavBar />
        <div id="main-content" className="content">
          <App />
        </div>
      </div>
    </div>
  );
}

export default Content;
