const header = document.getElementById('header');
const menuBtn = document.getElementById('menu-btn');
const mainNav = document.getElementById('main-nav');

window.addEventListener(
  'scroll',
  () => header?.classList.toggle('is-scrolled', window.scrollY > 10),
  { passive: true }
);

const setMenuOpen = (open) => {
  mainNav?.classList.toggle('is-open', open);
  menuBtn?.setAttribute('aria-expanded', String(open));
  menuBtn?.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  document.body.classList.toggle('is-menu-open', open);
};

menuBtn?.addEventListener('click', () => {
  setMenuOpen(!mainNav?.classList.contains('is-open'));
});

mainNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 720) setMenuOpen(false);
});

// スクロール連動フェードイン
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
    revealObserver.observe(el);
  });
} else {
  document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
    el.classList.add('is-visible');
  });
}

// 料金プラン切り替え（タブレット・スマホ）
const pricingTabs = document.querySelector('.pricing__tabs');
const pricingIndicator = document.querySelector('.pricing__tabs-indicator');
const pricingTabButtons = pricingTabs?.querySelectorAll('[role="tab"]');
const pricingPanels = document.querySelectorAll('.pricing__grid .pricing__card');
const pricingMq = window.matchMedia('(max-width: 960px)');

const movePricingIndicator = (activeTab) => {
  if (!pricingIndicator || !activeTab || !pricingMq.matches) return;

  const index = [...pricingTabButtons].indexOf(activeTab);
  pricingIndicator.style.transform = `translateX(${index * 100}%)`;
};

const setPricingPlan = (planId) => {
  let activeTab = null;

  pricingTabButtons?.forEach((tab) => {
    const isActive = tab.dataset.plan === planId;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
    if (isActive) activeTab = tab;
  });

  pricingPanels.forEach((panel) => {
    const isActive = panel.dataset.plan === planId;
    panel.classList.toggle('is-active', isActive);
    if (pricingMq.matches) {
      panel.toggleAttribute('hidden', !isActive);
    } else {
      panel.removeAttribute('hidden');
    }
  });

  movePricingIndicator(activeTab);
};

const updatePricingMode = () => {
  if (!pricingTabs || !pricingPanels.length) return;

  if (pricingMq.matches) {
    const activePlan =
      pricingTabs.querySelector('.pricing__tab.is-active')?.dataset.plan || 'light';
    setPricingPlan(activePlan);
    return;
  }

  pricingTabs.querySelectorAll('[role="tab"]').forEach((tab) => {
    tab.setAttribute('aria-selected', 'false');
  });
  pricingPanels.forEach((panel) => {
    panel.classList.add('is-active');
    panel.removeAttribute('hidden');
  });
};

pricingTabs?.querySelectorAll('[role="tab"]').forEach((tab) => {
  tab.addEventListener('click', () => setPricingPlan(tab.dataset.plan));
});

pricingMq.addEventListener('change', updatePricingMode);
window.addEventListener('resize', () => {
  const activeTab = pricingTabs?.querySelector('.pricing__tab.is-active');
  if (activeTab) movePricingIndicator(activeTab);
});
updatePricingMode();

// FAQ アコーディオン
document.querySelectorAll('.faq__q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isOpen = item?.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });
});

// お問い合わせフォーム
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const name = data.get('name');
  const email = data.get('email');
  const message = data.get('message');

  if (!name || !email || !message) {
    alert('お名前、メールアドレス、ご相談内容は必須です。');
    return;
  }

  const subject = encodeURIComponent(`【Dohi Web Design】お問い合わせ - ${name}様`);
  const body = encodeURIComponent(
    [
      `お名前: ${name}`,
      `メールアドレス: ${email}`,
      `店舗名・事業名: ${data.get('shop') || '未記入'}`,
      `代表者名: ${data.get('representative') || '未記入'}`,
      `ご予算: ${data.get('budget') || '未選択'}`,
      '',
      '【ご相談内容】',
      message,
      '',
      '【希望のサイトイメージ】',
      data.get('image') || '未記入',
      '',
      '【参考サイトURL・SNS】',
      data.get('reference') || '未記入',
    ].join('\n')
  );

  window.location.href = `mailto:dohi.webc@gmail.com?subject=${subject}&body=${body}`;
});
