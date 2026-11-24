/**
 * HAMUR KAFALAR - ETKİLEŞİMLİ JAVASCRIPT
 * Görsel Açılır Pencere (Lightbox Modal), Klavye Desteği ve Yumuşak Geçişler
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elemanları
  const cards = document.querySelectorAll('.dough-card');
  const modal = document.getElementById('imageModal');
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalPrevBtn = document.getElementById('modalPrevBtn');
  const modalNextBtn = document.getElementById('modalNextBtn');

  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalBadge = document.getElementById('modalBadge');
  const modalCounter = document.getElementById('modalCounter');
  const modalTags = document.getElementById('modalTags');

  // Kart Verilerini Çıkar
  const galleryItems = Array.from(cards).map((card, idx) => {
    const imgEl = card.querySelector('.card-image-wrap img');
    const badgeEl = card.querySelector('.card-badge');
    const titleEl = card.querySelector('.card-title');
    const textEl = card.querySelector('.card-text');
    const tagEls = card.querySelectorAll('.card-tags .tag');

    return {
      index: idx,
      src: card.getAttribute('data-src') || imgEl.getAttribute('src'),
      alt: imgEl.getAttribute('alt') || 'Hamur Karakteri',
      title: titleEl ? titleEl.textContent.trim() : '',
      description: textEl ? textEl.textContent.trim() : '',
      badgeText: badgeEl ? badgeEl.textContent.trim() : `#${idx + 1}`,
      badgeClass: badgeEl ? badgeEl.className : 'card-badge pink-badge',
      tagsHTML: Array.from(tagEls).map(t => t.outerHTML).join(' ')
    };
  });

  let currentIndex = 0;
  let isModalOpen = false;

  /**
   * Modalı Belirtilen İndeksteki Görsel ile Açar
   * @param {number} index
   */
  function openModal(index) {
    if (index < 0 || index >= galleryItems.length) return;
    currentIndex = index;
    const item = galleryItems[currentIndex];

    // İçeriği Güncelle
    modalImg.src = item.src;
    modalImg.alt = item.alt;
    modalTitle.textContent = item.title;
    modalDesc.textContent = item.description;
    modalBadge.textContent = item.badgeText;
    modalBadge.className = item.badgeClass;
    modalCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
    modalTags.innerHTML = item.tagsHTML;

    // Modalı Aktif Yap
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Sayfa kaydırmasını engelle
    isModalOpen = true;

    // Kapat butonuna odaklan (erişilebilirlik için)
    modalCloseBtn.focus();
  }

  /**
   * Modalı Kapatır
   */
  function closeModal() {
    if (!isModalOpen) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    isModalOpen = false;
  }

  /**
   * Bir Önceki Görsele Geçer
   */
  function prevImage() {
    if (!isModalOpen) return;
    const nextIdx = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openModal(nextIdx);
  }

  /**
   * Bir Sonraki Görsele Geçer
   */
  function nextImage() {
    if (!isModalOpen) return;
    const nextIdx = (currentIndex + 1) % galleryItems.length;
    openModal(nextIdx);
  }

  // Kart Tıklamalarını Dinle
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      openModal(index);
    });

    // Erişilebilirlik: Enter tuşu ile de açılabilmesi için
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${card.querySelector('.card-title')?.textContent || 'Görseli'} büyüt`);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(index);
      }
    });
  });

  // Kapatma Butonu
  modalCloseBtn.addEventListener('click', closeModal);

  // Arka Plana (Backdrop) Tıklayınca Kapat
  modalBackdrop.addEventListener('click', closeModal);

  // Önceki ve Sonraki Butonları
  if (modalPrevBtn) modalPrevBtn.addEventListener('click', prevImage);
  if (modalNextBtn) modalNextBtn.addEventListener('click', nextImage);

  // Klavye Kontrolleri (Escape, Ok Tuşları)
  document.addEventListener('keydown', (e) => {
    if (!isModalOpen) return;

    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    }
  });

  // Sayfa İçi Yumuşak Kaydırma (Smooth Scroll)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
