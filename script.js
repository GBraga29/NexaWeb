// Menu Mobile Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Anima o ícone do hambúrguer
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Fechar menu ao clicar em um link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Navegação suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Compensar altura da navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Efeito de scroll na navbar - aplicar blur ao rolar
const navbar = document.querySelector('.navbar');
const hero = document.querySelector('.hero');

const updateNavbar = () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
};

// Verificar estado inicial
updateNavbar();

window.addEventListener('scroll', updateNavbar);

// Animação de entrada ao scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animação aos elementos
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.diferencial-card, .produto-card, .cliente-card, .tech-item, .stat-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Validação e envio do formulário
const contatoForm = document.getElementById('contatoForm');

if (contatoForm) {
    contatoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validação básica
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();
        
        if (!nome || !email || !mensagem) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }
        
        // Simulação de envio (aqui você integraria com um backend)
        const btnSubmit = contatoForm.querySelector('button[type="submit"]');
        const originalText = btnSubmit.textContent;
        
        btnSubmit.textContent = 'Enviando...';
        btnSubmit.disabled = true;
        
        // Simular delay de envio
        setTimeout(() => {
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contatoForm.reset();
            btnSubmit.textContent = originalText;
            btnSubmit.disabled = false;
        }, 1500);
    });
}

// Carrossel de imagens do hero
const heroImages = document.querySelectorAll('.hero-image');
let currentImageIndex = 0;

const changeHeroImage = () => {
    // Remove a classe active de todas as imagens
    heroImages.forEach(img => img.classList.remove('active'));
    
    // Adiciona a classe active na próxima imagem
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    heroImages[currentImageIndex].classList.add('active');
};

// Inicia o carrossel a cada 10 segundos
if (heroImages.length > 0) {
    setInterval(changeHeroImage, 10000);
}

// Efeito parallax suave na imagem ativa do hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const activeImage = document.querySelector('.hero-image.active');
    if (activeImage && scrolled < window.innerHeight) {
        activeImage.style.transform = `translateY(${scrolled * 0.3}px) scale(1)`;
    }
});


// Contador animado para estatísticas
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };
    
    updateCounter();
};

// Observar estatísticas e animar quando visíveis
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const statNumber = entry.target.querySelector('.stat-number');
            const numberText = statNumber.textContent;
            const number = parseInt(numberText.replace(/\D/g, ''));
            if (number) {
                statNumber.textContent = '0+';
                setTimeout(() => {
                    animateCounter(statNumber, number);
                }, 200);
            }
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        statsObserver.observe(item);
    });
});

// Carrossel de Produtos
const produtosCarousel = () => {
    const track = document.getElementById('produtosCarousel');
    const cards = track.querySelectorAll('.produto-card-carousel');
    const container = track.parentElement;
    
    if (!track || cards.length === 0) return;
    
    // Começar pelo card central (índice 1)
    let currentIndex = 1;
    let currentOffset = 0; // valor atual do translateX para uso no arraste
    const totalCards = cards.length;
    const gapPx = () => parseInt(getComputedStyle(track).gap, 10) || 32;
    const trackPaddingPx = () => {
        const padding = getComputedStyle(track).paddingLeft;
        return parseInt(padding, 10) || 32;
    };
    
    // Detectar se é mobile (touch) para habilitar arraste
    const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Função para calcular o deslocamento centralizando o card
    const updateCarousel = (disableTransition = false) => {
        if (cards.length === 0) return;
        
        const containerWidth = container.offsetWidth;
        const cardWidth = cards[0].offsetWidth;
        const gap = gapPx();
        const cardWithGap = cardWidth + gap;
        const trackPadding = trackPaddingPx();
        
        // Calcular offset para centralizar o card atual
        const offset = (containerWidth / 2) - (cardWidth / 2) - (currentIndex * cardWithGap) - trackPadding;
        currentOffset = offset;
        
        if (disableTransition) {
            track.style.transition = 'none';
        }
        track.style.transform = `translateX(${offset}px)`;
        if (disableTransition) {
            requestAnimationFrame(() => {
                track.style.transition = '';
            });
        }
        
        // Atualizar classes active
        cards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentIndex) {
                card.classList.add('active');
            }
        });
    };
    
    // --- Arraste em dispositivos móveis ---
    if (isTouchDevice()) {
        let touchStartX = 0;
        let touchStartOffset = 0;
        const minSwipeDistance = 40;
        
        const getTouchX = (e) => e.touches ? e.touches[0].clientX : e.clientX;
        
        const onDragStart = (e) => {
            touchStartX = getTouchX(e);
            touchStartOffset = currentOffset;
            track.style.transition = 'none';
        };
        
        const onDragMove = (e) => {
            const x = getTouchX(e);
            const deltaX = x - touchStartX;
            const containerWidth = container.offsetWidth;
            const cardWidth = cards[0].offsetWidth;
            const gap = gapPx();
            const cardWithGap = cardWidth + gap;
            const trackPadding = trackPaddingPx();
            const maxOffset = (containerWidth / 2) - (cardWidth / 2) - trackPadding;
            const minOffset = maxOffset - (totalCards - 1) * cardWithGap;
            let newOffset = touchStartOffset + deltaX;
            newOffset = Math.min(maxOffset, Math.max(minOffset, newOffset));
            track.style.transform = `translateX(${newOffset}px)`;
        };
        
        const onDragEnd = (e) => {
            const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            const deltaX = x - touchStartX;
            track.style.transition = '';
            if (deltaX < -minSwipeDistance && currentIndex < totalCards - 1) {
                currentIndex++;
                updateCarousel();
            } else if (deltaX > minSwipeDistance && currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            } else {
                updateCarousel();
            }
        };
        
        track.addEventListener('touchstart', onDragStart, { passive: true });
        track.addEventListener('touchmove', onDragMove, { passive: true });
        track.addEventListener('touchend', onDragEnd, { passive: true });
    }
    
    // Adicionar event listeners para clique nos cards
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index !== currentIndex) {
                currentIndex = index;
                updateCarousel();
            }
        });
    });
    
    // Inicializar carrossel
    requestAnimationFrame(() => {
        updateCarousel();
    });
    
    // Recalcular em resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel();
        }, 250);
    });
};

// Inicializar carrossel quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', produtosCarousel);
