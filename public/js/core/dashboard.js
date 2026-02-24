// TAB SWITCHING

const navItems = document.querySelectorAll(".nav__item");
const tabs = document.querySelectorAll(".tab");
const pageTitle = document.querySelector(".page-title");

navItems.forEach(item => {

    item.addEventListener("click", e => {

        e.preventDefault();

        const target = item.dataset.tab;

        navItems.forEach(i => i.classList.remove("active"));
        tabs.forEach(t => t.classList.remove("active"));

        item.classList.add("active");

        const tab = document.getElementById(target);

        if (tab) {
            tab.classList.add("active");
        }

        pageTitle.textContent = item.textContent;

    });

});