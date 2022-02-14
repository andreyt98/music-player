const menuIcon = document.querySelector(".menu-icon");
const menu = document.querySelector(".aside");

menuIcon.addEventListener("click", function () {
  menu.classList.toggle("aside-active");
});

