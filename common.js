// Fixed-position elements (the mobile bottom nav) size percentage/left+right
// widths against the layout viewport, which on a desktop browser includes the
// space reserved for the vertical scrollbar - a few px wider than what's
// actually visible (document.documentElement.clientWidth). That mismatch is
// what let the bottom nav (and anything dragged along with it) drift past the
// right edge and reveal blank space. Pin it to the real visible width instead.
// Real phones use overlay scrollbars so this is a no-op there.
function fixMobileNavWidth() {
  var side = document.querySelector('.side');
  if (!side) return;
  if (window.matchMedia('(max-width: 720px)').matches) {
    side.style.width = document.documentElement.clientWidth + 'px';
  } else {
    side.style.width = '';
  }
}
window.addEventListener('resize', fixMobileNavWidth);
document.addEventListener('DOMContentLoaded', fixMobileNavWidth);
fixMobileNavWidth();

// Shared across every page: toast + tiny icon strings.
var ICON = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>',
};

var _toastTimer = null;
function showToast(msg, iconKey) {
  var el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.innerHTML = '<div class="toast-ic">' + (ICON[iconKey] || ICON.check) + '</div><div class="toast-t">' + msg + '</div>';
  el.classList.remove('show');
  void el.offsetWidth; // restart animation
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3200);
}

function notWired(label) {
  showToast((label || 'This action') + ' isn’t wired up in this prototype.', 'info');
}

// Demo user roster — one per pipeline/ops stage, so the prototype can be viewed as any role.
var USERS = {
  hunter:   { name:'R. Suresh',   role:'Hunter',         city:'Bengaluru', initials:'RS', email:'r.suresh@savomart.com',   phone:'+91 98450 11223', grad:'linear-gradient(155deg,#4a7d95,#2c4e60)' },
  bde:      { name:'A. Verma',    role:'BDE',            city:'Bengaluru', initials:'AV', email:'a.verma@savomart.com',    phone:'+91 98802 33445', grad:'linear-gradient(155deg,#3f8a6d,#2c5c48)' },
  siteeval: { name:'K. Bose',     role:'Site Evaluator', city:'Chennai',   initials:'KB', email:'k.bose@savomart.com',     phone:'+91 94440 55667', grad:'linear-gradient(155deg,#a97b4a,#7a5530)' },
  bdm:      { name:'M. Iyer',     role:'BDM',            city:'Bengaluru', initials:'MI', email:'m.iyer@savomart.com',     phone:'+91 99001 77889', grad:'linear-gradient(155deg,#7c4f96,#5a3970)' },
  cxo:      { name:'S. Malhotra', role:'CXO',            city:'Mumbai',    initials:'SM', email:'s.malhotra@savomart.com', phone:'+91 93910 99001', grad:'linear-gradient(155deg,#ad3d3d,#7a2929)' },
  ic:       { name:'V. Sharma',   role:'IC Member',      city:'Mumbai',    initials:'VS', email:'v.sharma@savomart.com',   phone:'+91 99456 22334', grad:'linear-gradient(155deg,#5a7a95,#3a5570)' },
  mxm:      { name:'P. Menon',    role:'MXM',            city:'Bengaluru', initials:'PM', email:'p.menon@savomart.com',    phone:'+91 90030 44556', grad:'linear-gradient(155deg,#3f6e85,#2c4e60)' },
  pm:       { name:'R. Kapoor',   role:'PM',             city:'Bengaluru', initials:'RK', email:'r.kapoor@savomart.com',   phone:'+91 98123 66778', grad:'linear-gradient(155deg,#3f6e85,#2c4e60)' },
};
var USER_ORDER = ['hunter', 'bde', 'siteeval', 'bdm', 'cxo', 'ic', 'mxm', 'pm'];

function getCurrentRole() {
  var r = localStorage.getItem('propflow_user_role');
  return USERS[r] ? r : 'bdm';
}
function setCurrentRole(role) {
  localStorage.setItem('propflow_user_role', role);
  window.location.reload();
}
function getCurrentUser() { return USERS[getCurrentRole()]; }

// Master pipeline properties — each sits at one stage; getRoleSections() derives every
// role's Needs Attention / On Hold / Upcoming / Pipeline view from this single list.
var STAGE_ORDER = ['bde', 'siteeval', 'bdm', 'cxo', 'ic', 'approved'];
var MASTER = [
  { code:'BLR1046', name:'Marathahalli Bridge',   stage:'bde',      thumb:'linear-gradient(135deg,#a9c9d1,#4a7d95)' },
  { code:'BLR1047', name:'Jayanagar 9th Block',   stage:'bde',      held:true, thumb:'linear-gradient(135deg,#c9b3a7,#a9724a)' },
  { code:'BLR1044', name:'Koramangala 5th Block', stage:'siteeval', thumb:'linear-gradient(135deg,#d1c398,#a98f4a)' },
  { code:'CHN1031', name:'T Nagar Cross',         stage:'siteeval', held:true, thumb:'linear-gradient(135deg,#c9a7c2,#8a5fa8)' },
  { code:'BLR1041', name:'Whitefield Main Road',  stage:'bdm',      thumb:'linear-gradient(135deg,#8fb0bf,#4a7d95)' },
  { code:'BLR1042', name:'HSR Layout Sector 3',   stage:'bdm',      held:true, thumb:'linear-gradient(135deg,#c9a97e,#a97b4a)' },
  { code:'CHN1028', name:'Anna Nagar West',       stage:'cxo',      thumb:'linear-gradient(135deg,#9fc2a6,#4a7d5a)' },
  { code:'HYD1019', name:'Kondapur Main Road',    stage:'cxo',      held:true, thumb:'linear-gradient(135deg,#c9c2a3,#a9974a)' },
  { code:'HYD1015', name:'Gachibowli Circle',     stage:'ic',       thumb:'linear-gradient(135deg,#a7b8c9,#5a7a95)' },
  { code:'CHN1030', name:'Velachery Bypass',      stage:'approved', thumb:'linear-gradient(135deg,#93c2b0,#3f8a6d)' },
];
var STAGE_LABELS = { bde:'BDE Pending', siteeval:'Site Eval', bdm:'BDM Pending', cxo:'CXO Pending', ic:'IC Pending', approved:'IC Approved' };
var NOTES = {
  bde:      function () { return 'Sent to BDE — awaiting review'; },
  siteeval: function () { return 'Site Evaluation in progress'; },
  bdm:      function () { return 'Sent to BDM — awaiting review'; },
  cxo:      function () { return 'With CXO for max rent / deposit approval'; },
  ic:       function () { return 'With IC for final approval'; },
  approved: function () { return 'IC approved — ready for Launch Flow'; },
};

function pipelineSections(role) {
  var idx = STAGE_ORDER.indexOf(role);
  var need = MASTER.filter(function (r) { return r.stage === role && !r.held; });
  var hold = MASTER.filter(function (r) { return r.stage === role && r.held; });
  var prev = STAGE_ORDER[idx - 1];
  var next = prev ? MASTER.filter(function (r) { return r.stage === prev && !r.held; }) : [];
  var pipe = MASTER.filter(function (r) { return STAGE_ORDER.indexOf(r.stage) > idx; });
  function toRow() {
    return function (r) {
      var note = r.held ? 'Paused at ' + STAGE_LABELS[r.stage].replace(' Pending', '') + ' — can resume anytime' : (NOTES[r.stage] ? NOTES[r.stage](r) : '');
      return { code:r.code, name:r.name, thumb:r.thumb, status: r.held ? 'hold' : r.stage, note: note };
    };
  }
  return { need: need.map(toRow()), hold: hold.map(toRow()), next: next.map(toRow()), pipe: pipe.map(toRow()) };
}

// Roles outside the core BDE→IC pipeline get a hand-built view instead of the algorithm above.
var CUSTOM_SECTIONS = {
  hunter: {
    need: [{ code:'BLR1039', name:'Indiranagar 100ft Rd', status:'rejected', thumb:'linear-gradient(135deg,#c9a3a3,#a34a4a)', note:'Rejected by BDM — landlord terms unacceptable. Resubmit if terms change.' }],
    hold: [{ code:'BLR1049', name:'Whitefield Tech Park', status:'hold', thumb:'linear-gradient(135deg,#c2c9a7,#8a944a)', note:'Paused — landlord unresponsive since 30 Aug' }],
    next: [],
    pipe: [
      { code:'BLR1041', name:'Whitefield Main Road', status:'bdm', thumb:'linear-gradient(135deg,#8fb0bf,#4a7d95)', note:'You sourced this 12 Aug — now with BDM' },
      { code:'BLR1044', name:'Koramangala 5th Block', status:'siteeval', thumb:'linear-gradient(135deg,#d1c398,#a98f4a)', note:'You sourced this — now in Site Evaluation' },
      { code:'CHN1030', name:'Velachery Bypass', status:'approved', thumb:'linear-gradient(135deg,#93c2b0,#3f8a6d)', note:'You sourced this — IC approved 5 Sep' },
    ],
  },
  mxm: {
    need: [
      { code:'BLR1041', name:'Whitefield Main Road', status:'catchment_prog', thumb:'linear-gradient(135deg,#8fb0bf,#4a7d95)', note:'Catchment in progress — 3 of 40 cells surveyed' },
      { code:'BLR1044', name:'Koramangala 5th Block', status:'catchment_new', thumb:'linear-gradient(135deg,#d1c398,#a98f4a)', note:'Eligible for Catchment Report — not started' },
    ],
    hold: [{ code:'CHN1028', name:'Anna Nagar West', status:'hold', thumb:'linear-gradient(135deg,#9fc2a6,#4a7d5a)', note:'Catchment paused — assigned MXE unavailable' }],
    next: [{ code:'BLR1046', name:'Marathahalli Bridge', status:'bde', thumb:'linear-gradient(135deg,#a9c9d1,#4a7d95)', note:'Becomes catchment-eligible once it reaches BDM Review' }],
    pipe: [{ code:'CHN1030', name:'Velachery Bypass', status:'catchment_done', thumb:'linear-gradient(135deg,#93c2b0,#3f8a6d)', note:'Catchment Report completed 20 Aug' }],
  },
  pm: {
    need: [{ code:'BLR1041', name:'Whitefield Main Road', status:'llsow_pending', thumb:'linear-gradient(135deg,#8fb0bf,#4a7d95)', note:'LL SoW — 1 scope item awaiting your acceptance' }],
    hold: [{ code:'HYD1015', name:'Gachibowli Circle', status:'hold', thumb:'linear-gradient(135deg,#a7b8c9,#5a7a95)', note:'LL SoW paused — landlord renegotiating signage clause' }],
    next: [{ code:'BLR1044', name:'Koramangala 5th Block', status:'llsow_upcoming', thumb:'linear-gradient(135deg,#d1c398,#a98f4a)', note:'Will reach LL SoW once CXO approves' }],
    pipe: [{ code:'CHN1030', name:'Velachery Bypass', status:'hoto_done', thumb:'linear-gradient(135deg,#93c2b0,#3f8a6d)', note:'HOTO completed 28 Aug' }],
  },
};

function getRoleSections(role) { return CUSTOM_SECTIONS[role] || pipelineSections(role); }

// Compact stats widget injected into the sidebar (below nav, above the identity block),
// showing the current user's Needs Attention / On Hold / Next / Pipeline counts at a glance.
function renderSideStats() {
  var host = document.getElementById('sideStats');
  if (!host) return;
  var s = getRoleSections(getCurrentRole());
  var rows = [
    ['Needs Attention', s.need.length, '#d99a3a'],
    ['On Hold', s.hold.length, '#b788d1'],
    ['Next in Line', s.next.length, '#7fa8c9'],
    ['Pipeline', s.pipe.length, '#6fc79a'],
  ];
  host.innerHTML = '<div class="sidestats-label">Quick Stats</div>' + rows.map(function (r) {
    return '<div class="sidestats-row"><span class="sidestats-dot" style="background:' + r[2] + ';"></span><span class="sidestats-k">' + r[0] + '</span><span class="sidestats-v">' + r[1] + '</span></div>';
  }).join('');
}

var ICON2 = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
};

// Fully repaints the user-menu dropdown (identity, city access, app access,
// notification toggle, switch-user list) for the current demo user, and the
// sidebar identity chip. Rebuilding from scratch means the same JS drives the
// menu on every page regardless of that page's static markup.
function renderUserMenu(dd) {
  var u = getCurrentUser();

  var sideAv = document.querySelector('.sidebottom .av');
  if (sideAv) { sideAv.style.background = u.grad; sideAv.textContent = u.initials; }
  var sideName = document.querySelector('.sidebottom .who-name');
  if (sideName) sideName.textContent = u.name;
  var sideRole = document.querySelector('.sidebottom .who-role');
  if (sideRole) sideRole.textContent = u.role + ' · ' + u.city;

  if (!dd) return;
  var current = getCurrentRole();
  var notifyOn = localStorage.getItem('propflow_notify') !== 'off';

  dd.innerHTML =
    '<div class="usermenu-greet">Hi, ' + u.name + '</div>' +
    '<div class="usermenu-info">' +
      '<div class="usermenu-info-row">' + ICON2.phone + '<span>' + u.phone + '</span></div>' +
      '<div class="usermenu-info-row">' + ICON2.mail + '<span>' + u.email + '</span></div>' +
      '<div class="usermenu-info-row">' + ICON2.pin + '<span>' + u.city + '</span></div>' +
    '</div>' +
    '<div class="usermenu-section-label">App access</div>' +
    '<div class="usermenu-access-row"><span>PropFlow</span><span class="usermenu-pill">' + u.role + '</span></div>' +
    '<div class="usermenu-toggle-row">' +
      '<span class="usermenu-toggle-label">' + ICON2.bell + 'Notifications</span>' +
      '<span class="usermenu-toggle' + (notifyOn ? ' on' : '') + '" id="usermenuNotifyToggle"></span>' +
    '</div>' +
    '<div class="usermenu-switch">' +
      '<div class="usermenu-switch-label">Switch user (demo)</div>' +
      '<div class="usermenu-switch-list">' +
        USER_ORDER.map(function (key) {
          var uu = USERS[key];
          var on = key === current ? ' on' : '';
          return '<div class="usermenu-switch-btn' + on + '" data-role="' + key + '"><span class="av" style="background:' + uu.grad + ';">' + uu.initials + '</span><span><span class="swn">' + uu.name + '</span><span class="swr">' + uu.role + '</span></span></div>';
        }).join('') +
      '</div>' +
    '</div>' +
    '<button class="usermenu-out" id="userMenuSignOut">Sign out</button>';

  Array.prototype.forEach.call(dd.querySelectorAll('.usermenu-switch-btn'), function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      setCurrentRole(btn.getAttribute('data-role'));
    });
  });
  var toggle = dd.querySelector('#usermenuNotifyToggle');
  if (toggle) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var on = toggle.classList.toggle('on');
      localStorage.setItem('propflow_notify', on ? 'on' : 'off');
      showToast('Notifications ' + (on ? 'on' : 'off'), 'info');
    });
  }
  var out = dd.querySelector('#userMenuSignOut');
  if (out) out.addEventListener('click', function () { notWired('Sign out'); });
}

// Hunter is a submit-and-track role: only "For you" (Your Submissions + New Property)
// and their own submission's pages are in scope. No real auth here — this just hides
// the nav and bounces a Hunter back to "For you" if they land on a page outside that set.
var HUNTER_ALLOWED_PAGES = ['inbox.html', 'new-property.html', 'property-new.html', 'property.html', 'media-upload.html', ''];
var HUNTER_HIDDEN_NAV_HREFS = ['dashboard.html', 'catchment-reports.html', 'bde-stats.html'];
function applyRoleAccess() {
  if (getCurrentRole() !== 'hunter') return;
  HUNTER_HIDDEN_NAV_HREFS.forEach(function (href) {
    var el = document.querySelector('.nitem[href="' + href + '"]');
    if (el) el.style.display = 'none';
  });
  var page = location.pathname.split('/').pop();
  if (HUNTER_ALLOWED_PAGES.indexOf(page) === -1) {
    window.location.replace('inbox.html');
  }
}

// Shared top-right user menu: call once per page after the DOM is in place.
function initUserMenu() {
  applyRoleAccess();
  renderSideStats();
  var btn = document.getElementById('userMenuBtn');
  var dd = document.getElementById('userMenuDd');
  renderUserMenu(dd);
  if (!btn || !dd) return;
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    dd.classList.toggle('open');
  });
  document.addEventListener('click', function (e) {
    if (!dd.contains(e.target) && e.target !== btn) dd.classList.remove('open');
  });
}

// Sticky sub-nav scrollspy: highlights the active section link as the page scrolls,
// and smooth-scrolls to a section when its sub-nav link is clicked.
function initSubnav(sectionIds) {
  var links = {};
  sectionIds.forEach(function (id) {
    var link = document.querySelector('.subnav a[href="#' + id + '"]');
    if (link) {
      links[id] = link;
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });
  function onScroll() {
    var pos = window.scrollY + 120;
    var activeId = sectionIds[0];
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= pos) activeId = id;
    });
    sectionIds.forEach(function (id) {
      if (links[id]) links[id].classList.toggle('on', id === activeId);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
