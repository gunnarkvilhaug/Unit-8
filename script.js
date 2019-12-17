function mainConst(doc, overlay, state, loader, uData, bClick, bKey) {
    return () => {
      doc.getElementById("main").addEventListener("click", () => {
        overlay(false);
        state.mClear = false;
        doc.getElementById("userCard").style.display = "none";
      });
      loader(true);
      fetch("https://randomuser.me/api/?results=12&nat=no").then(response => response.json()).then(data => {
        state.user = [...data.results];
        loader(false);
        uData(data.results);
        bClick();
        bKey();
      }).catch(error => console.error(error));
    };
  }
  const stateLarge = {
    user: undefined,sUser:undefined,mClear:undefined,fUser:false,organUser:undefined
  };
  (doc => {
    const couple = (elementToBindTo, eventName, event) => elementToBindTo.addEventListener(eventName, event);
    const upperString = string => string[0].toUpperCase() + string.substr(1);
    const eGrid = user => {
      let gColumn = "";
      gColumn += user.map(
        (user, index) => `<figure class="user-container" id="${index}">
            <div><img src="${user.picture.large}" alt="Picture of user"></div>
            <figcaption><h1>${upperString(user.name.first)} ${upperString(user.name.last)}</h1><h3>${user.email}</h3><h3>${upperString(user.location.city)}</h3>
            </figcaption></figure>`);
      return gColumn.replace(/,/g, "");
    };
    const state = stateLarge;
    const frSearch = event => {
      state.fUser = event.target.value.length > 0;
      state.organUser = state.user.filter(userdata => {
        const fullName = `${userdata.name.first} ${userdata.name.last}`;
        if (fullName.toLowerCase().includes(event.target.value) || userdata.login.username.toLowerCase().includes(event.target.value)) {
          return userdata;
        }
        return null;
      });
      uData(state.organUser);
    };
    const uData = user => {
      doc.getElementById("usersection").innerHTML = eGrid(user);
      bClick();
    };
    const escape = event => {
      if (event.keyCode === 27) {
        state.mClear = false;
        doc.getElementById("userCard").style.display = "none";
        overlay(false);
      }
    };
    const modalWindow = user => {
      const birthDayRaw = new Date(user.dob.date);
      const birthDay = birthDayRaw.toLocaleDateString("NO");
      couple(window, "keydown", escape);
      return `<section class="exit-button" id="exit-button">&times;</section><section class="main-row-container"><section class="left-arrow-container"><i class="left-arrow"></i></section><section class="main-modal-content"><section class="user-img"><img src="${user.picture.large}" alt=""></section><section class="user-main-data"><p class="user-name">${upperString(user.name.first)} ${upperString(user.name.last)}</p><p class="user-mail">${user.email}</p><p class="user-area">${upperString(user.location.city)}</p></section><hr class="modal-divider"><section class="user-details"><p class="user-phone"> Tel: ${user.phone}</p><p class="user-address">${user.location.street.name} ${user.location.street.number}, ${user.location.postcode} ${user.location.city}</p><p class="user-bday">Birthday: ${birthDay}</p></section></section><section class="right-arrow-container"><i class="right-arrow"></i></section></section>`;
    };
    const exitButton = () => {
      doc.getElementById("userCard").style.display = "none";
      state.mClear = false;
      overlay(false);
    };
    const leArrow = () => {
      let currentUser;
      if (state.fUser) {
        currentUser = parseInt(state.sUser, 10) !== 0 ? parseInt(state.sUser, 10) - 1 : state.organUser.length - 1;
      } else {
        currentUser = parseInt(state.sUser, 10) !== 0 ? parseInt(state.sUser, 10) - 1 : state.user.length - 1;
      }
      iData(currentUser);
    };
    const reArrow = () => {
      let currentUser;
      if (state.fUser) {
        currentUser = parseInt(state.sUser, 10) < state.organUser.length - 1 ? parseInt(state.sUser, 10) + 1 : 0;
      } else {
        currentUser = parseInt(state.sUser, 10) < state.user.length - 1 ? parseInt(state.sUser, 10) + 1 : 0;
      }
      iData(currentUser);
    };
    const iData = dataConst(doc, state, modalWindow, couple, leArrow, reArrow, exitButton);
    const cardClickHandler = event => {
      overlay(true);
      if (event.target.id) {
        iData(event.target.id);
      } else if (event.target.parentNode.id) {
        iData(event.target.parentNode.id);
      } else if (event.target.parentNode.parentNode.id) {
        iData(event.target.parentNode.parentNode.id);
      }
    };
    const bClick = () => {
      const userCards = doc.getElementsByClassName("user-container");
      for (let i = 0; i < userCards.length; i++) {
        couple(userCards[i], "click", cardClickHandler, true);
      }
    };
    const bKey = () => {
      const filterInput = doc.getElementById("search");
      couple(filterInput, "keyup", frSearch);
    };
    const windowLoaderTemplate = () => {
      return `<div></div><div></div><div></div><div></div><div></div><div></div<div></div><div></div><div></div><div></div><div></div><div></div></div></div>`;
    };
    const loader = enable => {
      if (enable) {
        doc.getElementById("usersection").innerHTML = windowLoaderTemplate();
      } else {
        doc.getElementById("usersection").innerHTML = "";
      }
    };
    const overlay = enable => {
      if (enable) {
        doc.getElementById("main").classList.add("main");
      } else {
        doc.getElementById("main").classList.remove("main");
      }
    };
    const main = mainConst(doc, overlay, state, loader, uData, bClick, bKey);
    main();
  })(document);
  
  function dataConst(doc, state, modalWindow, couple, leArrow, reArrow, exitButton) {
    return userId => {
      const uModal = doc.getElementById("userCard");
      state.mClear = true;
      state.sUser = userId;
      if (state.organUser) {
        uModal.innerHTML = modalWindow(state.organUser[state.sUser]);
      }
      else {
        uModal.innerHTML = modalWindow(state.user[state.sUser]);
      }
      uModal.style.display = "flex";
      couple(doc.getElementsByClassName("left-arrow")[0], "click", leArrow);
      couple(doc.getElementsByClassName("right-arrow")[0], "click", reArrow);
      couple(doc.getElementById("exit-button"), "click", exitButton);
    };
  }