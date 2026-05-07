const storageKey = "clickforge-account-save-v1";

const defaultProfileSvg = encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><rect width="220" height="220" fill="#2d3035"/><circle cx="110" cy="86" r="46" fill="#c5c8cb"/><path d="M41 204c9-47 44-74 69-74s60 27 69 74" fill="#15171a"/><circle cx="92" cy="91" r="8" fill="#16181b"/><circle cx="128" cy="91" r="8" fill="#16181b"/><path d="M93 119c14 10 28 10 42 0" stroke="#16181b" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M57 90c9-42 35-64 74-57 22 4 37 16 44 37-25-19-51-14-78-4-13 5-25 12-40 24z" fill="#9ea3a8"/><circle cx="180" cy="45" r="12" fill="#b9ff22"/></svg>`);
const defaultClickerSvg = encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260"><rect width="260" height="260" rx="130" fill="#b9ff22"/><circle cx="130" cy="130" r="101" fill="#9cdf16"/><path d="M58 161c34-62 69-93 144-113-18 59-58 113-114 157-12-9-22-23-30-44z" fill="#202328"/><path d="M91 86c24-18 58-31 102-39-18 43-48 82-90 117-19-14-24-42-12-78z" fill="#30343a"/><circle cx="186" cy="72" r="26" fill="#25282d"/><path d="M178 64l24 24M202 64l-24 24" stroke="#b9ff22" stroke-width="10" stroke-linecap="round"/><path d="M34 70c36-31 78-45 126-40" stroke="#e9ff9b" stroke-width="10" stroke-linecap="round" opacity=".55"/><path d="M44 197c43 38 102 44 152 15" stroke="#5f7d09" stroke-width="12" stroke-linecap="round" opacity=".45"/></svg>`);
const clickerPresets = [
  { name: "Neon core", src: defaultClickerSvg },
  { name: "Vault trophy", src: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260"><rect width="260" height="260" rx="130" fill="#202328"/><circle cx="130" cy="130" r="108" fill="#b9ff22"/><path d="M76 62h108v45c0 49-25 77-54 77s-54-28-54-77z" fill="#d9ff6b"/><path d="M80 73H46c2 45 18 73 50 82" fill="none" stroke="#9fd918" stroke-width="17" stroke-linecap="round"/><path d="M180 73h34c-2 45-18 73-50 82" fill="none" stroke="#9fd918" stroke-width="17" stroke-linecap="round"/><path d="M112 181h36v33h45v24H67v-24h45z" fill="#282b30"/><path d="M88 76h84" stroke="#f2ffa8" stroke-width="11" stroke-linecap="round" opacity=".7"/></svg>`) },
  { name: "Prime orb", src: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260"><rect width="260" height="260" rx="130" fill="#15171a"/><circle cx="130" cy="130" r="108" fill="#30343a"/><circle cx="130" cy="130" r="82" fill="#b9ff22"/><circle cx="103" cy="101" r="34" fill="#f3ffb5" opacity=".72"/><path d="M56 151c46 44 104 50 154 14" stroke="#738d14" stroke-width="18" stroke-linecap="round" opacity=".5"/><path d="M42 109c50-43 106-54 170-32" stroke="#dfff72" stroke-width="10" stroke-linecap="round" opacity=".65"/></svg>`) }
];

const fonts = [
  "Inter",
  "Segoe UI",
  "Arial",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Lucida Console",
  "Impact",
  "Palatino Linotype",
  "Garamond",
  "Candara",
  "Calibri",
  "Cambria",
  "Franklin Gothic Medium",
  "Century Gothic",
  "Consolas",
  "Lucida Sans"
];

const themes = [
  "#b9ff22",
  "#7cff6b",
  "#26f2c2",
  "#4da3ff",
  "#ffda4d",
  "#ff7a59",
  "#ff5fb7",
  "#ffffff",
  "#9cffd9",
  "#c8ff4d",
  "#68ff8c",
  "#84a8ff"
];

const upgradeDefinitions = [
  { id: "doubleCore", name: "2x Core", icon: "2x", description: "Doubles every click permanently.", unlockClicks: 80, baseCost: 180, maxLevel: 1, kind: "multiplier", value: 2 },
  { id: "tripleCore", name: "3x Core", icon: "3x", description: "Triples the forge after the first breakthrough.", unlockClicks: 620, baseCost: 1150, maxLevel: 1, kind: "multiplier", value: 3 },
  { id: "sharpTap", name: "Sharp Tap", icon: "+", description: "Adds reliable Flux to every press.", unlockClicks: 160, baseCost: 90, maxLevel: 35, kind: "flat", value: 1.25, scale: 1.28 },
  { id: "echoPulse", name: "Echo Pulse", icon: "◎", description: "Adds a small stacking multiplier to the core.", unlockClicks: 1300, baseCost: 2400, maxLevel: 24, kind: "stackMultiplier", value: 0.18, scale: 1.36 },
  { id: "vaultGear", name: "Vault Gear", icon: "▣", description: "Turns task momentum into stronger clicks.", unlockClicks: 4300, baseCost: 6200, maxLevel: 30, kind: "flat", value: 5, scale: 1.34 },
  { id: "neonCircuit", name: "Neon Circuit", icon: "✦", description: "Every level raises your multiplier ceiling.", unlockClicks: 12000, baseCost: 16000, maxLevel: 18, kind: "stackMultiplier", value: 0.32, scale: 1.42 },
  { id: "passiveArray", name: "Passive Array", icon: "◷", description: "Generates Flux every few seconds.", unlockClicks: 26000, baseCost: 41000, maxLevel: 25, kind: "passive", value: 12, scale: 1.38 },
  { id: "primeEngine", name: "Prime Engine", icon: "◆", description: "A late-game engine with heavy click growth.", unlockClicks: 75000, baseCost: 120000, maxLevel: 16, kind: "stackMultiplier", value: 0.55, scale: 1.48 },
  { id: "millionGate", name: "Million Gate", icon: "M", description: "Built for the long road to one million clicks.", unlockClicks: 250000, baseCost: 420000, maxLevel: 10, kind: "flat", value: 75, scale: 1.55 }
];

let currentUser = null;
let state = createDefaultState();
let tasks = createTasks();
let lastSave = Date.now();
let remoteSaveTimer = null;
let appStarted = false;

const els = {};

document.addEventListener("DOMContentLoaded", async () => {
  bindElements();
  setupAuth();
  setupNavigation();
  setupButtons();
  setupUploads();
  window.addEventListener("beforeunload", persistBeforeUnload);
  await checkSession();
});

function bindElements() {
  [
    "authScreen",
    "authLoginTab",
    "authRegisterTab",
    "loginForm",
    "registerForm",
    "loginUsername",
    "loginPassword",
    "registerUsername",
    "registerPassword",
    "authMessage",
    "loader",
    "app",
    "focusToggle",
    "railGoal",
    "railProgress",
    "dateLine",
    "timeLine",
    "tokenCount",
    "homeTokenCount",
    "shopTokens",
    "clickCount",
    "powerText",
    "profilePower",
    "clickButton",
    "clickerImage",
    "floatLayer",
    "taskName",
    "taskDescription",
    "taskNumber",
    "taskProgressLabel",
    "taskRewardLabel",
    "taskProgressBar",
    "claimTaskButton",
    "buyTaskButton",
    "completedText",
    "levelText",
    "profileLevelBadge",
    "daysText",
    "streakText",
    "weekStrip",
    "friendCount",
    "winRate",
    "profileName",
    "heroProfileImage",
    "profileHandle",
    "profilePageImage",
    "profilePageName",
    "profilePageHandle",
    "profileClicks",
    "profileTokens",
    "profileUpgrades",
    "achievementRow",
    "calendarGrid",
    "upgradeGrid",
    "settingsShortcut",
    "shopShortcut",
    "notifyButton",
    "menuButton",
    "quickMenu",
    "toastStack",
    "copyTagButton",
    "clearProfileImage",
    "clearClickerImage",
    "profileInput",
    "profileInputSettings",
    "clickerInput",
    "clickerPresetGrid",
    "swatchGrid",
    "customColor",
    "applyColorButton",
    "themePreview",
    "fontSelect",
    "saveFontButton",
    "exportButton",
    "headerLogoutButton",
    "logoutButton",
    "resetButton"
  ].forEach(id => els[id] = document.getElementById(id));
}

function setupAuth() {
  els.authLoginTab.addEventListener("click", () => showAuthMode("login"));
  els.authRegisterTab.addEventListener("click", () => showAuthMode("register"));
  els.loginForm.addEventListener("submit", event => {
    event.preventDefault();
    signIn();
  });
  els.registerForm.addEventListener("submit", event => {
    event.preventDefault();
    createAccount();
  });
}

function showAuthMode(mode) {
  const isLogin = mode === "login";
  els.authLoginTab.classList.toggle("is-active", isLogin);
  els.authRegisterTab.classList.toggle("is-active", !isLogin);
  els.loginForm.classList.toggle("is-active", isLogin);
  els.registerForm.classList.toggle("is-active", !isLogin);
  setAuthMessage("");
}

async function checkSession() {
  try {
    const data = await apiRequest("/api/session");
    await launchAuthenticatedApp(data.user, data.saveData);
  } catch (error) {
    els.loader.classList.add("is-auth-wait");
    els.authScreen.classList.remove("is-hidden");
    if (error.status !== 401) {
      setAuthMessage("Start the backend with python server.py, then refresh this page.", "error");
    }
  }
}

async function signIn() {
  const username = els.loginUsername.value.trim();
  const password = els.loginPassword.value;
  if (!username || !password) {
    setAuthMessage("Enter your username and password.", "error");
    return;
  }
  setAuthBusy(els.loginForm, true);
  try {
    const data = await apiRequest("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    await launchAuthenticatedApp(data.user, data.saveData);
  } catch (error) {
    setAuthMessage(error.message || "Username or password is incorrect.", "error");
  } finally {
    setAuthBusy(els.loginForm, false);
  }
}

async function createAccount() {
  const username = els.registerUsername.value.trim();
  const password = els.registerPassword.value;
  if (!username || !password) {
    setAuthMessage("Choose a new username and create a password.", "error");
    return;
  }
  setAuthBusy(els.registerForm, true);
  try {
    const data = await apiRequest("/api/register", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    setAuthMessage("Account created. Opening your vault.", "success");
    await launchAuthenticatedApp(data.user, data.saveData);
  } catch (error) {
    setAuthMessage(error.message || "Could not create that account.", "error");
  } finally {
    setAuthBusy(els.registerForm, false);
  }
}

async function launchAuthenticatedApp(user, saveData) {
  currentUser = user;
  state = loadState(saveData, user.username);
  applyTheme(state.theme);
  applyFont(state.font);
  populateFonts();
  renderSwatches();
  renderClickerPresets();
  buildStaticPanels();
  renderAll();
  updateClock();
  if (!appStarted) {
    setInterval(updateClock, 1000);
    setInterval(passiveTick, 5000);
    appStarted = true;
  }
  els.authScreen.classList.add("is-hidden");
  els.loader.classList.remove("is-auth-wait", "is-done");
  els.app.classList.add("is-hidden");
  setTimeout(() => {
    els.loader.classList.add("is-done");
    els.app.classList.remove("is-hidden");
  }, 3000);
  saveState();
}

function setAuthBusy(form, busy) {
  form.querySelectorAll("input, button").forEach(element => {
    element.disabled = busy;
  });
}

function setAuthMessage(message, type) {
  els.authMessage.textContent = message;
  els.authMessage.classList.toggle("is-error", type === "error");
  els.authMessage.classList.toggle("is-success", type === "success");
}

function setupNavigation() {
  document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.page));
  });
  els.settingsShortcut.addEventListener("click", () => showPage("settings"));
  els.shopShortcut.addEventListener("click", () => showPage("shop"));
  els.menuButton.addEventListener("click", () => els.quickMenu.classList.toggle("is-open"));
  document.addEventListener("click", event => {
    if (!els.quickMenu.contains(event.target) && !els.menuButton.contains(event.target)) {
      els.quickMenu.classList.remove("is-open");
    }
  });
}

function setupButtons() {
  els.clickButton.addEventListener("click", handleClick);
  els.claimTaskButton.addEventListener("click", claimCurrentTask);
  els.buyTaskButton.addEventListener("click", buyCurrentTask);
  els.notifyButton.addEventListener("click", () => showToast(`Task ${Math.min(state.completedTasks + 1, 500)} is active. Keep the forge warm.`));
  els.focusToggle.addEventListener("click", () => {
    els.app.classList.toggle("is-focus");
    const active = els.app.classList.contains("is-focus");
    els.focusToggle.querySelector("span:last-child").textContent = active ? "Open" : "Close";
  });
  els.copyTagButton.addEventListener("click", copyTag);
  els.clearProfileImage.addEventListener("click", () => {
    state.profileImage = "";
    saveState();
    renderAll();
    showToast("Profile avatar reset.");
  });
  els.clearClickerImage.addEventListener("click", () => {
    state.clickerImage = "";
    saveState();
    renderAll();
    renderClickerPresets();
    showToast("Clicker image reset.");
  });
  els.applyColorButton.addEventListener("click", () => {
    state.theme = els.customColor.value;
    applyTheme(state.theme);
    saveState();
    renderSwatches();
    showToast("Theme color saved.");
  });
  els.saveFontButton.addEventListener("click", () => {
    state.font = els.fontSelect.value;
    applyFont(state.font);
    saveState();
    showToast("Font saved.");
  });
  els.exportButton.addEventListener("click", exportSave);
  els.headerLogoutButton.addEventListener("click", logout);
  els.logoutButton.addEventListener("click", logout);
  els.resetButton.addEventListener("click", resetProgress);
  document.querySelectorAll(".file-trigger").forEach(button => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.file);
      if (target) target.click();
    });
  });
}

function setupUploads() {
  els.profileInput.addEventListener("change", event => readImage(event, value => {
    state.profileImage = value;
    saveState();
    renderAll();
    showToast("Profile avatar updated.");
  }));
  els.profileInputSettings.addEventListener("change", event => readImage(event, value => {
    state.profileImage = value;
    saveState();
    renderAll();
    showToast("Profile avatar updated.");
  }));
  els.clickerInput.addEventListener("change", event => readImage(event, value => {
    state.clickerImage = value;
    saveState();
    renderAll();
    renderClickerPresets();
    showToast("Clicker image updated.");
  }));
}

function handleClick(event) {
  const value = getClickPower();
  state.clicks += value;
  state.tokens += value;
  state.totalPresses += 1;
  state.lastPlayed = new Date().toISOString();
  els.clickButton.classList.add("is-pressed");
  setTimeout(() => els.clickButton.classList.remove("is-pressed"), 110);
  spawnFloat(value, event);
  if (state.totalPresses % 25 === 0) showToast(`${formatNumber(state.totalPresses)} presses logged.`);
  saveStateSoft();
  renderAll();
}

function spawnFloat(value, event) {
  const rect = els.floatLayer.getBoundingClientRect();
  const xBase = event.clientX ? event.clientX - rect.left - rect.width / 2 : 0;
  const yBase = event.clientY ? event.clientY - rect.top - rect.height / 2 : 0;
  const valueEl = document.createElement("span");
  valueEl.className = "float-value";
  valueEl.textContent = `+${formatNumber(value)}`;
  valueEl.style.setProperty("--x", `${xBase + randomBetween(-34, 34)}px`);
  valueEl.style.setProperty("--y", `${yBase + randomBetween(-22, 22)}px`);
  valueEl.style.setProperty("--drift", `${randomBetween(-55, 55)}px`);
  els.floatLayer.appendChild(valueEl);
  setTimeout(() => valueEl.remove(), 920);
}

function claimCurrentTask() {
  const task = getCurrentTask();
  if (!task) {
    showToast("The million-click path is complete.");
    return;
  }
  const progress = getTaskProgress(task);
  if (progress.current < progress.target) {
    showToast("This task is not ready yet.");
    els.claimTaskButton.classList.add("is-disabled");
    setTimeout(() => els.claimTaskButton.classList.remove("is-disabled"), 260);
    return;
  }
  completeTask(task, false);
}

function buyCurrentTask() {
  const task = getCurrentTask();
  if (!task) {
    showToast("Every task is already complete.");
    return;
  }
  if (task.number === 500) {
    showToast("The Million Gate cannot be boosted. Reach 1,000,000 clicks to finish.");
    return;
  }
  const cost = getTaskBuyCost(task);
  if (state.tokens < cost) {
    showToast(`Need ${formatNumber(cost - state.tokens)} more Flux to boost.`);
    els.buyTaskButton.classList.add("is-disabled");
    setTimeout(() => els.buyTaskButton.classList.remove("is-disabled"), 260);
    return;
  }
  state.tokens -= cost;
  completeTask(task, true);
}

function completeTask(task, bought) {
  state.completedTasks = Math.min(500, state.completedTasks + 1);
  state.tokens += task.reward;
  state.completedTaskIds[task.id] = true;
  saveState();
  renderAll();
  showToast(bought ? `Boosted through task ${task.number}. Next goal revealed.` : `Task ${task.number} complete. +${formatNumber(task.reward)} Flux.`);
}

function passiveTick() {
  if (!currentUser) return;
  const passive = getPassivePower();
  if (passive <= 0) return;
  state.tokens += passive;
  saveStateSoft();
  renderAll();
  showToast(`Passive array generated +${formatNumber(passive)} Flux.`);
}

function buyUpgrade(id) {
  const upgrade = upgradeDefinitions.find(item => item.id === id);
  if (!upgrade) return;
  const level = state.upgrades[id] || 0;
  if (level >= upgrade.maxLevel) {
    showToast("This upgrade is already maxed.");
    return;
  }
  if (state.clicks < upgrade.unlockClicks) {
    showToast(`Unlocks at ${formatNumber(upgrade.unlockClicks)} clicks.`);
    return;
  }
  const cost = getUpgradeCost(upgrade, level);
  if (state.tokens < cost) {
    showToast(`Need ${formatNumber(cost - state.tokens)} more Flux.`);
    return;
  }
  state.tokens -= cost;
  state.upgrades[id] = level + 1;
  saveState();
  renderAll();
  showToast(`${upgrade.name} upgraded.`);
}

function showPage(page) {
  els.quickMenu.classList.remove("is-open");
  document.querySelectorAll("[data-page-panel]").forEach(panel => {
    panel.classList.toggle("is-active", panel.dataset.pagePanel === page);
  });
  document.querySelectorAll(".nav-button").forEach(button => {
    button.classList.toggle("is-active", button.dataset.page === page);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAll() {
  const profileImage = state.profileImage || defaultProfileSvg;
  const clickerImage = state.clickerImage || defaultClickerSvg;
  const clickPower = getClickPower();
  const level = getLevel();
  const upgradeLevels = getUpgradeLevelTotal();
  const username = currentUser ? currentUser.username : "Mr.Bobrovsky";
  const handle = `@${username}`;
  els.profileName.textContent = username;
  els.profileHandle.textContent = handle;
  els.profilePageName.textContent = username;
  els.profilePageHandle.textContent = handle;
  els.heroProfileImage.src = profileImage;
  els.profilePageImage.src = profileImage;
  els.clickerImage.src = clickerImage;
  els.tokenCount.textContent = formatNumber(state.tokens);
  els.homeTokenCount.textContent = formatNumber(state.tokens);
  els.shopTokens.textContent = formatNumber(state.tokens);
  els.clickCount.textContent = formatNumber(state.clicks);
  els.powerText.textContent = `+${formatNumber(clickPower)}`;
  els.profilePower.textContent = `+${formatNumber(clickPower)}`;
  els.completedText.textContent = `${state.completedTasks} / 500`;
  els.levelText.textContent = level;
  els.profileLevelBadge.textContent = level;
  els.daysText.textContent = getDaysSinceStart();
  els.streakText.textContent = getDaysSinceStart();
  els.friendCount.textContent = `${14 + Math.min(85, Math.floor(level * 1.4))} online`;
  els.winRate.textContent = `${Math.min(99, 70 + Math.floor(state.completedTasks / 22))}%`;
  els.profileClicks.textContent = formatNumber(state.clicks);
  els.profileTokens.textContent = formatNumber(state.tokens);
  els.profileUpgrades.textContent = upgradeLevels;
  renderTask();
  renderUpgrades();
  renderAchievements();
}

function renderTask() {
  const task = getCurrentTask();
  if (!task) {
    els.taskName.textContent = "Million Gate complete";
    els.taskDescription.textContent = "You completed all 500 tasks and reached the final long-term milestone.";
    els.taskNumber.textContent = "✓";
    els.taskProgressLabel.textContent = "500 / 500";
    els.taskRewardLabel.textContent = "Vault complete";
    els.taskProgressBar.style.width = "100%";
    els.railGoal.textContent = "Complete";
    els.railProgress.style.width = "100%";
    els.claimTaskButton.textContent = "Completed";
    els.buyTaskButton.textContent = "Vault complete";
    return;
  }
  const progress = getTaskProgress(task);
  const percent = Math.min(100, progress.current / progress.target * 100);
  const buyCost = getTaskBuyCost(task);
  els.taskName.textContent = task.name;
  els.taskDescription.textContent = task.description;
  els.taskNumber.textContent = task.number;
  els.taskProgressLabel.textContent = `${formatNumber(progress.current)} / ${formatNumber(progress.target)}`;
  els.taskRewardLabel.textContent = `Reward ${formatNumber(task.reward)} Flux`;
  els.taskProgressBar.style.width = `${percent}%`;
  els.railGoal.textContent = `Task ${task.number} / 500`;
  els.railProgress.style.width = `${percent}%`;
  els.claimTaskButton.textContent = progress.current >= progress.target ? "Claim task" : "Not ready";
  els.buyTaskButton.textContent = task.number === 500 ? "Reach 1M to finish" : `Boost ${formatNumber(buyCost)} Flux`;
}

function renderUpgrades() {
  els.upgradeGrid.innerHTML = "";
  const visible = upgradeDefinitions.filter((upgrade, index) => state.clicks >= upgrade.unlockClicks || index < 3 || upgradeDefinitions[index - 1] && state.clicks >= upgradeDefinitions[index - 1].unlockClicks);
  visible.forEach(upgrade => {
    const level = state.upgrades[upgrade.id] || 0;
    const locked = state.clicks < upgrade.unlockClicks;
    const maxed = level >= upgrade.maxLevel;
    const cost = getUpgradeCost(upgrade, level);
    const card = document.createElement("article");
    card.className = `upgrade-card${locked ? " is-locked" : ""}`;
    const action = locked
      ? `<span class="lock-label">Unlocks at ${formatNumber(upgrade.unlockClicks)} clicks</span>`
      : maxed
        ? `<span class="lock-label">Max level</span>`
        : `<button class="primary-button" type="button" data-upgrade="${upgrade.id}">Buy ${formatNumber(cost)} Flux</button>`;
    card.innerHTML = `
      <div>
        <div class="upgrade-icon">${upgrade.icon}</div>
        <h3>${upgrade.name}</h3>
        <p>${upgrade.description}</p>
      </div>
      <div>
        <div class="upgrade-meta">
          <span>Level ${level} / ${upgrade.maxLevel}</span>
          <span>${getUpgradeEffectText(upgrade, level)}</span>
        </div>
        ${action}
      </div>
    `;
    els.upgradeGrid.appendChild(card);
  });
  els.upgradeGrid.querySelectorAll("[data-upgrade]").forEach(button => {
    button.addEventListener("click", () => buyUpgrade(button.dataset.upgrade));
  });
}

function renderAchievements() {
  const data = [
    { icon: "2x", name: state.upgrades.doubleCore ? "Double core online" : "Double core locked" },
    { icon: "500", name: `${state.completedTasks} tasks cleared` },
    { icon: "1M", name: state.clicks >= 1000000 ? "Million gate opened" : `${formatNumber(Math.max(0, 1000000 - state.clicks))} clicks to 1M` }
  ];
  els.achievementRow.innerHTML = "";
  data.forEach(item => {
    const achievementEl = document.createElement("div");
    achievementEl.className = "achievement";
    achievementEl.innerHTML = `<span>${item.icon}</span><strong>${item.name}</strong>`;
    els.achievementRow.appendChild(achievementEl);
  });
}

function buildStaticPanels() {
  buildWeekStrip();
  buildCalendar();
}

function buildWeekStrip() {
  els.weekStrip.innerHTML = "";
  const now = new Date();
  const dayIndex = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayIndex);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  labels.forEach((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const tile = document.createElement("div");
    tile.className = `day-tile${index === dayIndex ? " is-active" : ""}${index < dayIndex ? " is-lit" : ""}`;
    tile.innerHTML = `<i></i><span>${label}</span><strong>${date.getDate()}</strong>`;
    els.weekStrip.appendChild(tile);
  });
}

function buildCalendar() {
  els.calendarGrid.innerHTML = "";
  const lit = Math.min(42, getDaysSinceStart() + Math.floor(state.completedTasks / 12));
  for (let i = 1; i <= 42; i += 1) {
    const cell = document.createElement("div");
    cell.className = `calendar-cell${i <= lit ? " is-lit" : ""}`;
    cell.textContent = i;
    els.calendarGrid.appendChild(cell);
  }
}

function populateFonts() {
  els.fontSelect.innerHTML = "";
  fonts.forEach(font => {
    const option = document.createElement("option");
    option.value = font;
    option.textContent = font;
    option.style.fontFamily = `"${font}", sans-serif`;
    if (font === state.font) option.selected = true;
    els.fontSelect.appendChild(option);
  });
  els.fontSelect.onchange = () => {
    state.font = els.fontSelect.value;
    applyFont(state.font);
    saveState();
  };
}

function renderSwatches() {
  els.swatchGrid.innerHTML = "";
  themes.forEach(color => {
    const button = document.createElement("button");
    button.className = `swatch${normalizeHex(color) === normalizeHex(state.theme) ? " is-active" : ""}`;
    button.type = "button";
    button.style.setProperty("--swatch", color);
    button.setAttribute("aria-label", `Use ${color}`);
    button.addEventListener("click", () => {
      state.theme = color;
      els.customColor.value = color;
      applyTheme(color);
      saveState();
      renderSwatches();
      showToast("Theme color saved.");
    });
    els.swatchGrid.appendChild(button);
  });
  els.customColor.value = normalizeHex(state.theme);
  els.themePreview.style.color = state.theme;
}

function renderClickerPresets() {
  els.clickerPresetGrid.innerHTML = "";
  clickerPresets.forEach(preset => {
    const button = document.createElement("button");
    button.className = `preset-button${state.clickerImage === preset.src || !state.clickerImage && preset.src === defaultClickerSvg ? " is-active" : ""}`;
    button.type = "button";
    button.setAttribute("aria-label", `Use ${preset.name}`);
    button.innerHTML = `<img src="${preset.src}" alt="${preset.name}">`;
    button.addEventListener("click", () => {
      state.clickerImage = preset.src === defaultClickerSvg ? "" : preset.src;
      saveState();
      renderAll();
      renderClickerPresets();
      showToast(`${preset.name} selected.`);
    });
    els.clickerPresetGrid.appendChild(button);
  });
}

function createTasks() {
  const result = [];
  let lastClickTarget = 0;
  for (let i = 1; i <= 500; i += 1) {
    const curve = Math.pow(i / 500, 2.22);
    const clickTarget = Math.max(lastClickTarget + 1, Math.round(12 + curve * 999988));
    lastClickTarget = clickTarget;
    let type = "clicks";
    let target = clickTarget;
    let name = `Reach ${formatNumber(clickTarget)} clicks`;
    let description = `Push your central forge to ${formatNumber(clickTarget)} total clicks.`;
    if (i % 11 === 0) {
      type = "upgrades";
      target = Math.max(1, Math.floor(i / 7));
      name = `Install ${target} upgrade levels`;
      description = `Buy enough shop upgrades to reach ${target} total upgrade levels.`;
    } else if (i % 6 === 0) {
      type = "tokens";
      target = Math.max(25, Math.round(clickTarget * 0.42));
      name = `Bank ${formatNumber(target)} Flux`;
      description = `Hold ${formatNumber(target)} Flux tokens inside your local vault.`;
    }
    result.push({
      id: `task-${i}`,
      number: i,
      type,
      target,
      reward: Math.max(12, Math.round(14 + Math.pow(i, 1.42) * 2.8)),
      name,
      description
    });
  }
  result[499].type = "clicks";
  result[499].target = 1000000;
  result[499].name = "Open the Million Gate";
  result[499].description = "Reach 1,000,000 total clicks to complete the final long-term milestone.";
  result[499].reward = 250000;
  return result;
}

function getCurrentTask() {
  return tasks[state.completedTasks] || null;
}

function getTaskProgress(task) {
  let current = state.clicks;
  if (task.type === "tokens") current = state.tokens;
  if (task.type === "upgrades") current = getUpgradeLevelTotal();
  return { current: Math.floor(current), target: task.target };
}

function getTaskBuyCost(task) {
  const progress = getTaskProgress(task);
  const remainingRatio = Math.max(0.15, 1 - Math.min(1, progress.current / progress.target));
  return Math.ceil((task.reward * 2.6 + task.number * 8) * remainingRatio);
}

function getClickPower() {
  let flat = 1;
  let multiplier = 1;
  upgradeDefinitions.forEach(upgrade => {
    const level = state.upgrades[upgrade.id] || 0;
    if (!level) return;
    if (upgrade.kind === "multiplier") multiplier *= Math.pow(upgrade.value, level);
    if (upgrade.kind === "flat") flat += upgrade.value * level;
    if (upgrade.kind === "stackMultiplier") multiplier *= 1 + upgrade.value * level;
  });
  multiplier *= 1 + Math.min(1.75, state.completedTasks / 500);
  return Math.max(1, Math.floor(flat * multiplier));
}

function getPassivePower() {
  const upgrade = upgradeDefinitions.find(item => item.kind === "passive");
  const level = state.upgrades[upgrade.id] || 0;
  if (!level) return 0;
  return Math.floor(level * upgrade.value * (1 + state.completedTasks / 600));
}

function getUpgradeCost(upgrade, level) {
  const scale = upgrade.scale || 1;
  return Math.ceil(upgrade.baseCost * Math.pow(scale, level));
}

function getUpgradeEffectText(upgrade, level) {
  if (upgrade.kind === "multiplier") return level ? `${upgrade.value}x active` : `${upgrade.value}x`;
  if (upgrade.kind === "flat") return `+${formatNumber(Math.floor(upgrade.value * level))}`;
  if (upgrade.kind === "stackMultiplier") return `+${Math.round(upgrade.value * level * 100)}%`;
  if (upgrade.kind === "passive") return `${formatNumber(getPassivePower())} / 5s`;
  return "";
}

function getUpgradeLevelTotal() {
  return Object.values(state.upgrades).reduce((sum, value) => sum + Number(value || 0), 0);
}

function getLevel() {
  return Math.max(1, Math.floor(Math.sqrt(state.clicks / 95)) + Math.floor(state.completedTasks / 10) + 1);
}

function getDaysSinceStart() {
  const started = new Date(state.startedAt);
  const diff = Date.now() - started.getTime();
  return Math.max(1, Math.floor(diff / 86400000) + 1);
}

function updateClock() {
  const now = new Date();
  els.dateLine.textContent = now.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
  els.timeLine.textContent = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  els.toastStack.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-8px)";
  }, 2600);
  setTimeout(() => toast.remove(), 3100);
}

function readImage(event, callback) {
  const file = event.target.files[0];
  event.target.value = "";
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("Please choose an image file.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function copyTag() {
  const tag = currentUser ? `@${currentUser.username}` : "@mr.bobrovsky";
  if (navigator.clipboard) {
    navigator.clipboard.writeText(tag).then(() => showToast("Profile tag copied."));
  } else {
    showToast(tag);
  }
}

function exportSave() {
  const data = JSON.stringify(state);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(data).then(() => showToast("Save data copied to clipboard."));
  } else {
    window.prompt("ClickForge save data", data);
    showToast("Save data opened for manual copy.");
  }
}

function resetProgress() {
  const confirmed = window.confirm("Reset this account's ClickForge progress and customization?");
  if (!confirmed) return;
  if (currentUser) localStorage.removeItem(getAccountStorageKey(currentUser.username));
  state = createDefaultState();
  applyTheme(state.theme);
  applyFont(state.font);
  populateFonts();
  renderSwatches();
  renderClickerPresets();
  buildStaticPanels();
  renderAll();
  saveState();
  showToast("Progress reset.");
}

async function logout() {
  await syncRemoteSave();
  try {
    await apiRequest("/api/logout", { method: "POST", body: JSON.stringify({}) });
  } catch {
  }
  currentUser = null;
  state = createDefaultState();
  els.app.classList.add("is-hidden");
  els.loader.classList.add("is-auth-wait", "is-done");
  els.authScreen.classList.remove("is-hidden");
  els.loginPassword.value = "";
  els.registerPassword.value = "";
  showAuthMode("login");
  setAuthMessage("Signed out. Sign in again to reuse your saved account.", "success");
}

function saveStateSoft() {
  if (Date.now() - lastSave > 650) {
    saveState();
  }
}

function saveState() {
  lastSave = Date.now();
  if (!currentUser) return;
  localStorage.setItem(getAccountStorageKey(currentUser.username), JSON.stringify(state));
  queueRemoteSave();
}

function loadState(saveData, username) {
  const defaults = createDefaultState();
  try {
    let saved = saveData;
    if (typeof saved === "string") saved = JSON.parse(saved);
    if (!saved && username) {
      const raw = localStorage.getItem(getAccountStorageKey(username));
      if (raw) saved = JSON.parse(raw);
    }
    if (!saved || typeof saved !== "object") return defaults;
    return { ...defaults, ...saved, upgrades: saved.upgrades || {}, completedTaskIds: saved.completedTaskIds || {} };
  } catch {
    return defaults;
  }
}

function queueRemoteSave() {
  clearTimeout(remoteSaveTimer);
  remoteSaveTimer = setTimeout(syncRemoteSave, 350);
}

async function syncRemoteSave() {
  if (!currentUser) return;
  clearTimeout(remoteSaveTimer);
  remoteSaveTimer = null;
  try {
    await apiRequest("/api/save", {
      method: "POST",
      body: JSON.stringify({ saveData: state })
    });
  } catch {
    showToast("Database save is temporarily unavailable.");
  }
}

function persistBeforeUnload() {
  if (!currentUser) return;
  localStorage.setItem(getAccountStorageKey(currentUser.username), JSON.stringify(state));
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify({ saveData: state })], { type: "application/json" });
    navigator.sendBeacon("/api/save", blob);
  }
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  let data = {};
  try {
    data = await response.json();
  } catch {
  }
  if (!response.ok) {
    const error = new Error(data.message || "Request failed.");
    error.status = response.status;
    throw error;
  }
  return data;
}

function getAccountStorageKey(username) {
  return `${storageKey}:${String(username || "guest").toLowerCase()}`;
}

function createDefaultState() {
  return {
    clicks: 0,
    tokens: 0,
    totalPresses: 0,
    completedTasks: 0,
    completedTaskIds: {},
    upgrades: {},
    theme: "#b9ff22",
    font: "Inter",
    profileImage: "",
    clickerImage: "",
    startedAt: new Date().toISOString(),
    lastPlayed: new Date().toISOString()
  };
}

function applyTheme(color) {
  const normalized = normalizeHex(color);
  const rgb = hexToRgb(normalized);
  document.documentElement.style.setProperty("--accent", normalized);
  document.documentElement.style.setProperty("--accent-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
  document.documentElement.style.setProperty("--accent-dark", shadeHex(normalized, -28));
  if (els.customColor) els.customColor.value = normalized;
  if (els.themePreview) els.themePreview.style.color = normalized;
}

function applyFont(font) {
  document.documentElement.style.setProperty("--font-family", `"${font}", "Segoe UI", Arial, sans-serif`);
  if (els.fontSelect) els.fontSelect.value = font;
}

function formatNumber(value) {
  const rounded = Math.floor(Number(value) || 0);
  return rounded.toLocaleString();
}

function randomBetween(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function encodeSvg(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function normalizeHex(hex) {
  if (!hex || typeof hex !== "string") return "#b9ff22";
  let value = hex.trim();
  if (!value.startsWith("#")) value = `#${value}`;
  if (value.length === 4) {
    value = `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : "#b9ff22";
}

function hexToRgb(hex) {
  const clean = normalizeHex(hex).slice(1);
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function shadeHex(hex, percent) {
  const rgb = hexToRgb(hex);
  const factor = percent / 100;
  const channel = value => Math.max(0, Math.min(255, Math.round(value + value * factor)));
  return `#${[channel(rgb.r), channel(rgb.g), channel(rgb.b)].map(value => value.toString(16).padStart(2, "0")).join("")}`;
}
