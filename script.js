/**
 * Nexora Digital - Script Principal
 * Lo que viene es ahora.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos los módulos
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initTypingEffect();
    initCounterUp();
    initProjectFilters();
    initFAQ();
    initContactForm();
    initExitIntentModal();
    initAutoZajunaActivation();
    initWompiPayment();
});

/* ==========================================================================
   1. NAVBAR & MENU MOVIL
   ========================================================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');

    // Cambiar estilo del navbar al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        highlightActiveNav();
    });

    // Toggle menú móvil
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            body.classList.toggle('nav-open');
        });
    }

    // Cerrar menú móvil al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            body.classList.remove('nav-open');
        });
    });

    // Resaltar elemento activo según el scroll
    function highlightActiveNav() {
        let scrollY = window.scrollY;
        
        document.querySelectorAll('section[id], header[id]').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* ==========================================================================
   2. SMOOTH SCROLL (Desplazamiento Suave)
   ========================================================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Offset para el navbar fijo (80px)
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================================================
   3. ANIMACIONES AL HACER SCROLL
   ========================================================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Dejar de observar una vez animado
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* ==========================================================================
   4. EFECTO DE ESCRITURA (Typing)
   ========================================================================== */
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    
    if (!typingElement) return;

    const phrases = [
        'Software a Medida',
        'E-Commerce Profesional',
        'Automatización con IA',
        'CRM Empresarial',
        'Apps Móviles Nativas'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Borrar
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Escribir
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        // Velocidades
        let typeSpeed = isDeleting ? 40 : 80;
        
        // Final de frase
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pausa al final
            isDeleting = true;
        } 
        // Frase borrada por completo
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pausa antes de la nueva frase
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Iniciar efecto
    setTimeout(type, 1000);
}

/* ==========================================================================
   5. CONTADORES ANIMADOS (CounterUp)
   ========================================================================== */
function initCounterUp() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Constante divisor

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                
                const updateCount = () => {
                    const count = +counter.innerText;
                    // Incremento basado en velocidad
                    const inc = target / speed;
                    
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target + '+';
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/* ==========================================================================
   6. FILTRO DE PROYECTOS
   ========================================================================== */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Eliminar activo de todos
            filterBtns.forEach(b => b.classList.remove('active'));
            // Añadir activo al clickeado
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory.includes(filterValue)) {
                    // Mostrar con retraso escalonado
                    setTimeout(() => {
                        card.classList.remove('hidden');
                    }, index * 50);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ==========================================================================
   7. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
   ========================================================================== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Cerrar todos
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            
            // Si no estaba activo, abrirlo
            if (!isActive) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/* ==========================================================================
   8. FORMULARIO DE CONTACTO (con EmailJS)
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // TODO: El usuario (Jaison) debe configurar esto en EmailJS
    // https://www.emailjs.com/
    // Reemplazar estas llaves con las reales después de crear la cuenta.
    const EMAILJS_PUBLIC_KEY = 'TU_PUBLIC_KEY'; 
    const EMAILJS_SERVICE_ID = 'TU_SERVICE_ID';
    const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID';

    // Iniciar EmailJS si la llave existe (preventivo)
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'TU_PUBLIC_KEY') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(form)) {
            return;
        }

        const submitBtn = document.getElementById('form-submit');
        const btnText = submitBtn.querySelector('.form-btn-text');
        const btnLoading = submitBtn.querySelector('.form-btn-loading');

        // Estado de carga
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';

        // Recoger datos (nombres ofuscados para seguridad anti-infostealer)
        const formData = new FormData(form);
        const templateParams = {
            from_name: formData.get('nxd_u_val'),
            from_email: formData.get('nxd_e_val'),
            phone: formData.get('nxd_p_val'),
            service_type: form.querySelector('#nxd_s_val option:checked').text,
            budget: form.querySelector('#nxd_b_val option:checked').text || 'No especificado',
            message: formData.get('nxd_m_val'),
            to_name: 'Equipo Nexora Digital'
        };

        // Si EmailJS NO está configurado, simulamos el envío para demo
        if (EMAILJS_PUBLIC_KEY === 'TU_PUBLIC_KEY') {
            console.warn("EmailJS no está configurado. Simulando envío para demo...");
            setTimeout(() => {
                handleSuccess();
            }, 2000);
            return;
        }

        // Envío real con EmailJS
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function() {
                handleSuccess();
            }, function(error) {
                handleError(error);
            });

        // Helper functions
        function handleSuccess() {
            showToast('¡Mensaje enviado con éxito! Te contactaremos muy pronto.', 'success');
            form.reset();
            resetButton();
        }

        function handleError(error) {
            console.error('FAILED...', error);
            showToast('Ocurrió un error al enviar el mensaje. Por favor intenta por WhatsApp.', 'error');
            resetButton();
        }

        function resetButton() {
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
        }
    });

    // Validación básica
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, select, textarea');

        // Limpiar errores previos
        form.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));

        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                showError(input, 'Este campo es obligatorio');
                isValid = false;
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                showError(input, 'Ingresa un correo electrónico válido');
                isValid = false;
            } else if (input.hasAttribute('minlength') && input.value.trim().length < input.getAttribute('minlength')) {
                showError(input, `Debe tener al menos ${input.getAttribute('minlength')} caracteres`);
                isValid = false;
            }
        });

        return isValid;
    }

    function showError(input, message) {
        const group = input.closest('.form-group');
        const errorEl = group.querySelector('.form-error');
        group.classList.add('error');
        if (errorEl) errorEl.textContent = message;
    }

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}

/* ==========================================================================
   9. SISTEMA DE TOASTS (Notificaciones)
   ========================================================================== */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation';
    
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);

    // Animación de salida
    setTimeout(() => {
        toast.classList.add('fadeOut');
        setTimeout(() => {
            toast.remove();
        }, 500); // Esperar que termine animación CSS
    }, 4000);
}

/* ==========================================================================
   10. WOW FACTOR (Interactive Particles & Dynamic Glow)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Glow Cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // 2. tsParticles (Neural Network / Constellation effect)
    function loadParticlesSafe() {
        if (typeof tsParticles !== 'undefined') {
            tsParticles.load("tsparticles", {
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "grab" },
                        resize: true
                    },
                    modes: {
                        grab: { distance: 140, links: { opacity: 1 } }
                    }
                },
                particles: {
                    color: { value: "#f97316" }, // Naranja primario
                    links: {
                        color: "#f97316",
                        distance: 150,
                        enable: true,
                        opacity: 0.3,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1.5,
                        direction: "none",
                        random: false,
                        straight: false,
                        outModes: { default: "bounce" }
                    },
                    number: {
                        density: { enable: true, area: 800 },
                        value: 50
                    },
                    opacity: { value: 0.5 },
                    shape: { type: "circle" },
                    size: { value: { min: 1, max: 3 } }
                },
                detectRetina: true
            });
        } else {
            setTimeout(loadParticlesSafe, 150);
        }
    }
    loadParticlesSafe();
});

/* ==========================================================================
   11. EXIT INTENT MODAL
   ========================================================================== */
function initExitIntentModal() {
    let modalShown = false;
    const leadModal = document.getElementById('leadModal');
    const closeModal = document.getElementById('closeModal');

    if (!leadModal || !closeModal) return;

    document.addEventListener('mouseleave', function(e) {
        if (e.clientY < 0 && !modalShown) {
            leadModal.classList.add('active');
            modalShown = true;
        }
    });

    closeModal.addEventListener('click', function() {
        leadModal.classList.remove('active');
    });
}

/* ==========================================================================
   12. GENERADOR Y ACTIVADOR AUTÓNOMO DE LICENCIAS (AUTOZAJUNA PRO)
   ========================================================================== */
function initAutoZajunaActivation() {
    const form = document.getElementById('license-activation-form');
    const licenseType = document.getElementById('license_type');
    const paymentGroup = document.getElementById('group_payment_code');
    const resultBox = document.getElementById('license-result-box');
    const btnSubmit = document.getElementById('btn-generate-license');
    const tokenText = document.getElementById('generated-token-text');
    const tokenHwid = document.getElementById('token-hwid-text');
    const btnCopy = document.getElementById('btn-copy-token');

    if (!form) return;

    const SUPABASE_URL = "https://npvjuhpyqnfltedpxwze.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdmp1aHB5cW5mbHRlZHB4d3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0ODI3ODMsImV4cCI6MjA5MTA1ODc4M30.MMsuoaWu_SBgAb4iFVFiZjj2KLPVIqqU8Hg7wtiqlao";

    // Ocultar/Mostrar campo de código de pago según tipo
    if (licenseType && paymentGroup) {
        licenseType.addEventListener('change', () => {
            if (licenseType.value === 'trial') {
                paymentGroup.style.display = 'none';
            } else {
                paymentGroup.style.display = 'flex';
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const rawHwid = document.getElementById('client_hwid').value.trim().toUpperCase();
        const doc = document.getElementById('client_doc').value.trim();
        const type = licenseType ? licenseType.value : 'paid';
        const paymentCode = document.getElementById('client_payment_code') ? document.getElementById('client_payment_code').value.trim() : '';

        // Formato estándar de HWID
        let hwid = rawHwid;
        if (!hwid.startsWith('AZ-') && /^\d+$/.test(hwid)) {
            hwid = 'AZ-' + hwid;
        }

        if (!hwid) {
            alert('Por favor ingresa el ID de tu equipo (Ej: AZ-211929767875277).');
            return;
        }

        // Estado de carga
        const originalBtnText = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando con Servidor Cloud...';

        try {
            // Calcular fecha de expiración
            const days = (type === 'trial') ? 7 : 30;
            const expDate = new Date();
            expDate.setDate(expDate.getDate() + days);

            // Generar clave serial única: AZ-XXXXXXXX-XXXX
            const randomPart1 = Math.random().toString(16).substring(2, 10).toUpperCase();
            const randomPart2 = Math.random().toString(16).substring(2, 6).toUpperCase();
            const token = `AZ-${randomPart1}-${randomPart2}`;

            // Registrar en Supabase Cloud
            const response = await fetch(`${SUPABASE_URL}/rest/v1/licencias_autozajuna`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    token: token,
                    fecha_expiracion: expDate.toISOString(),
                    activo: true,
                    hwid: hwid,
                    usuario_zajuna: doc + (paymentCode ? ` [Pago: ${paymentCode}]` : '')
                })
            });

            if (!response.ok) {
                throw new Error(`Error en servidor: ${response.status}`);
            }

            // Mostrar resultado exitoso
            tokenText.textContent = token;
            tokenHwid.textContent = hwid;
            resultBox.style.display = 'block';

            // Scroll suave hacia el resultado
            resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

            btnSubmit.innerHTML = '<i class="fa-solid fa-check"></i> ¡Licencia Generada con Éxito!';
            setTimeout(() => {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalBtnText;
            }, 3000);

        } catch (error) {
            console.error('Error generando licencia:', error);
            alert('Ocurrió un problema conectando con el servidor de licencias. Por favor verifica tu conexión o contáctanos por WhatsApp.');
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalBtnText;
        }
    });

    // Botón copiar token
    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            const token = tokenText.textContent;
            navigator.clipboard.writeText(token).then(() => {
                const originalHtml = btnCopy.innerHTML;
                btnCopy.innerHTML = '<i class="fa-solid fa-check"></i> ¡Copiado!';
                btnCopy.style.background = '#34d399';
                setTimeout(() => {
                    btnCopy.innerHTML = originalHtml;
                    btnCopy.style.background = '';
                }, 2000);
            });
        });
    }
}

/* ==========================================================================
   13. PASARELA DE PAGOS WOMPI (AUTOZAJUNA PRO)
   ========================================================================== */
function initWompiPayment() {
    const wompiButtons = document.querySelectorAll('.btn-wompi-pay');
    if (!wompiButtons.length) return;

    const WOMPI_PUB_KEY = 'pub_prod_4WXcd1RM8SRyvmZ6UfENB58W7sZ3dKwf';
    const WOMPI_INTEGRITY_SECRET = 'prod_integrity_HawPeHqtztV5rRqGdlhXC8wRWRtck2L0';

    // 1. Función para calcular la firma de integridad SHA-256
    async function calculateIntegritySignature(reference, amountInCents, currency = 'COP') {
        const text = `${reference}${amountInCents}${currency}${WOMPI_INTEGRITY_SECRET}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // 2. Manejar clicks en botones de pago Wompi
    wompiButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const plan = btn.getAttribute('data-plan') || 'profesional';
            const name = btn.getAttribute('data-name') || 'AutoZajuna Pro';
            const amount = parseInt(btn.getAttribute('data-amount') || '150000', 10);
            const amountInCents = amount * 100;
            const reference = `AZ_${plan.toUpperCase()}_${Date.now()}`;

            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Abriendo Wompi...';

            try {
                const signature = await calculateIntegritySignature(reference, amountInCents, 'COP');

                // Asegurar que WidgetCheckout esté listo
                const CheckoutConstructor = window.WidgetCheckout || (typeof WidgetCheckout !== 'undefined' ? WidgetCheckout : null);

                if (!CheckoutConstructor) {
                    throw new Error('El script de Wompi aún no ha terminado de cargar. Por favor recarga la página o inténtalo de nuevo.');
                }

                const redirectUrl = `${window.location.origin}${window.location.pathname}`;

                const checkoutConfig = {
                    currency: 'COP',
                    amountInCents: amountInCents,
                    reference: reference,
                    publicKey: WOMPI_PUB_KEY,
                    redirectUrl: redirectUrl,
                    signature: {
                        integrity: signature
                    }
                };

                const checkout = new CheckoutConstructor(checkoutConfig);

                checkout.open(function (result) {
                    btn.disabled = false;
                    btn.innerHTML = originalText;

                    const transaction = result?.transaction;
                    if (transaction && transaction.status === 'APPROVED') {
                        // Pre-llenar formulario de activación con el comprobante de Wompi
                        const paymentCodeInput = document.getElementById('client_payment_code');
                        const licenseTypeSelect = document.getElementById('license_type');
                        
                        if (licenseTypeSelect) licenseTypeSelect.value = 'paid';
                        if (paymentCodeInput) {
                            paymentCodeInput.value = `WOMPI-${transaction.id}`;
                        }

                        // Scroll hacia el activador
                        const activationSec = document.getElementById('activacion-autozajuna');
                        if (activationSec) {
                            activationSec.scrollIntoView({ behavior: 'smooth' });
                        }

                        alert(`🎉 ¡Pago de ${name} Aprobado Exitosamente (Ref: ${transaction.id})!\n\nPor favor ingresa tu ID de Máquina en el formulario de abajo para generar tu clave serial.`);
                    } else if (transaction && transaction.status === 'DECLINED') {
                        alert('❌ La transacción fue rechazada por el banco. Por favor intenta con otro medio de pago.');
                    }
                });

            } catch (err) {
                console.error('Error al iniciar Wompi Checkout:', err);
                alert('No se pudo abrir el checkout de pagos. Puedes escribirnos a WhatsApp para pagar directamente.');
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        });
    });

    // 4. Si el usuario regresa de una redirección de Wompi con parámetros (?id=...)
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const wompiTransactionId = urlParams.get('id');
        if (wompiTransactionId) {
            const paymentCodeInput = document.getElementById('client_payment_code');
            const licenseTypeSelect = document.getElementById('license_type');
            if (licenseTypeSelect) licenseTypeSelect.value = 'paid';
            if (paymentCodeInput) {
                paymentCodeInput.value = `WOMPI-${wompiTransactionId}`;
            }
            const activationSec = document.getElementById('activacion-autozajuna');
            if (activationSec) {
                setTimeout(() => activationSec.scrollIntoView({ behavior: 'smooth' }), 500);
            }
        }
    } catch (e) {
        // Ignorar si falla lectura de URL
    }
}


