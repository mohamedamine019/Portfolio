// Particle System
function createParticles() {
  const container = document.getElementById("particles-container")
  const particleCount = 50

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.left = Math.random() * 100 + "%"
    particle.style.animationDelay = Math.random() * 20 + "s"
    particle.style.animationDuration = Math.random() * 10 + 10 + "s"
    container.appendChild(particle)
  }
}
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmPf8qzMm7r5w7e8pBNAtgqw9LubBy9_c",
  authDomain: "haicheur-amine-portfolio.firebaseapp.com",
  projectId: "haicheur-amine-portfolio",
  storageBucket: "haicheur-amine-portfolio.firebasestorage.app",
  messagingSenderId: "709687453425",
  appId: "1:709687453425:web:f6e75526aac23a1a33ab50",
  measurementId: "G-288CNZ5BBF"
};

// Initialize Firebase using the global firebase object
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

// Theme Toggle
function initThemeToggle() {
  const themeToggle = document.querySelector(".theme-toggle")
  const lightIcon = document.querySelector(".light-mode")
  const darkIcon = document.querySelector(".dark-mode")

  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("light-theme")
    lightIcon.classList.toggle("active")
    darkIcon.classList.toggle("active")

    // Save theme preference
    const isLight = document.documentElement.classList.contains("light-theme")
    localStorage.setItem("theme", isLight ? "light" : "dark")
  })

  // Load saved theme
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "light") {
    document.documentElement.classList.add("light-theme")
    lightIcon.classList.add("active")
    darkIcon.classList.remove("active")
  }
}

// Mobile Navigation
function initMobileNav() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mobileNav = document.querySelector(".mobile-nav")
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a")

  mobileMenuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("active")
    mobileMenuBtn.classList.toggle("active")
  })

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("active")
      mobileMenuBtn.classList.remove("active")
    })
  })
}

// Smooth Scrolling
function smoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Scroll Animations
function handleScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Add animation classes to elements
  const animatedElements = document.querySelectorAll(
    ".section-title, .project-tile, .skill-category, .timeline-item, .contact-info, .contact-form, .research-card, .blog-card, .testimonial-card",
  )

  animatedElements.forEach((el, index) => {
    el.classList.add("fade-in")
    observer.observe(el)
  })
}

// Stats Counter Animation
function initStatsCounter() {
  const statNumbers = document.querySelectorAll(".stat-number")

  const observerOptions = {
    threshold: 0.5,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target
        const finalValue = Number.parseInt(target.getAttribute("data-count"))
        animateCounter(target, finalValue)
        observer.unobserve(target)
      }
    })
  }, observerOptions)

  statNumbers.forEach((stat) => {
    observer.observe(stat)
  })
}

function animateCounter(element, target) {
  let current = 0
  const increment = target / 50
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current)
  }, 50)
}

// Skills Orbit Interaction
function initSkillsOrbit() {
  const skillIcons = document.querySelectorAll(".skill-icon")

  skillIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      const skillName = this.getAttribute("data-skill")

      // Create tooltip
      const tooltip = document.createElement("div")
      tooltip.className = "skill-tooltip"
      tooltip.textContent = skillName
      tooltip.style.cssText = `
                position: absolute;
                background: var(--glass-bg);
                backdrop-filter: blur(10px);
                border: 1px solid var(--accent-cyan);
                border-radius: 5px;
                padding: 0.5rem 1rem;
                color: var(--text-primary);
                font-size: 0.9rem;
                z-index: 1000;
                pointer-events: none;
                transform: translate(-50%, -120%);
                white-space: nowrap;
            `

      this.appendChild(tooltip)
    })

    icon.addEventListener("mouseleave", function () {
      const tooltip = this.querySelector(".skill-tooltip")
      if (tooltip) {
        tooltip.remove()
      }
    })
  })
}

// Contact Form Handler
// Update the initContactForm function
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  // Create toast notification container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const projectType = form.querySelector('select').value;
    const message = form.querySelector('textarea').value.trim();

    try {
      await db.collection('contacts').add({
        name,
        email,
        projectType,
        message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Show success toast
      showToast('success', '✨ Message Sent Successfully!', 'Thank you for reaching out. I will get back to you soon.');
      form.reset();
    } catch (error) {
      // Show error toast
      showToast('error', '❌ Message Failed to Send', 'Please try again or contact me directly via email.');
      console.error(error);
    }
  });
}

// Add this helper function for creating toasts
function showToast(type, title, message) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  toast.innerHTML = `
    <div class="toast-content">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
    <button class="toast-close">×</button>
  `;

  const toastContainer = document.querySelector('.toast-container');
  toastContainer.appendChild(toast);

  // Add click handler for close button
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 300);
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// Hero CTA Buttons
function initHeroCTA() {
  const primaryButton = document.querySelector(".cta-button.primary")
  const secondaryButton = document.querySelector(".cta-button.secondary")

  primaryButton.addEventListener("click", () => {
    document.querySelector("#projects").scrollIntoView({
      behavior: "smooth",
    })
  })

  secondaryButton.addEventListener("click", () => {
    // Simulate CV download
    const link = document.createElement("a")
    link.href = "#" // Replace with actual CV URL
    link.download = "HAICHEUR_Mohamed_Amine_CV.pdf"
    link.click()
  })
}

// Parallax Effect
function initParallax() {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll(".tesseract")

    parallaxElements.forEach((element) => {
      const speed = 0.5
      element.style.transform = `translate(-50%, -50%) translateY(${scrolled * speed}px)`
    })
  })
}

// Navigation Active State
function updateNavigation() {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav-links a")

  window.addEventListener("scroll", () => {
    let current = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight

      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active")
      }
    })
  })
}

// Typing Effect for Hero
function initTypingEffect() {
  const welcomeText = document.querySelector(".hero-welcome")
  const text = "Welcome to my world – where logic meets creativity."
  let index = 0

  welcomeText.textContent = ""

  function typeWriter() {
    if (index < text.length) {
      welcomeText.textContent += text.charAt(index)
      index++
      setTimeout(typeWriter, 50)
    }
  }

  setTimeout(typeWriter, 2000)
}

// Project Search and Filtering
function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const projectCards = document.querySelectorAll(".project-card")
  const projectsGrid = document.querySelector(".projects-grid")
  const searchInput = document.getElementById("project-search")

  // Function to filter projects
  function filterProjects(category, searchTerm = "") {
    let hasVisibleProjects = false

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ")
      const title = card.dataset.title.toLowerCase()
      const tags = card.dataset.tags.toLowerCase()

      const matchesCategory = category === "all" || categories.includes(category)
      const matchesSearch =
        searchTerm === "" || title.includes(searchTerm.toLowerCase()) || tags.includes(searchTerm.toLowerCase())

      if (matchesCategory && matchesSearch) {
        card.style.display = "block"
        hasVisibleProjects = true

        // Add animation
        setTimeout(() => {
          card.style.opacity = "1"
          card.style.transform = "translateY(0)"
        }, 100)
      } else {
        card.style.display = "none"
        card.style.opacity = "0"
        card.style.transform = "translateY(20px)"
      }
    })

    // Show "No projects found" message if no projects match the filter
    let noProjectsMessage = document.querySelector(".no-projects")

    if (!hasVisibleProjects) {
      if (!noProjectsMessage) {
        noProjectsMessage = document.createElement("div")
        noProjectsMessage.className = "no-projects"
        noProjectsMessage.innerHTML = `
          <h3>No projects found</h3>
          <p>No projects match the selected filter or search term.</p>
        `
        projectsGrid.appendChild(noProjectsMessage)
      }
      noProjectsMessage.style.display = "block"
    } else if (noProjectsMessage) {
      noProjectsMessage.style.display = "none"
    }
  }

  // Add click event to filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      button.classList.add("active")

      // Get filter category
      const filterCategory = button.getAttribute("data-filter")
      const searchTerm = searchInput.value

      // Filter projects
      filterProjects(filterCategory, searchTerm)
    })
  })

  // Add search functionality
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value
    const activeFilter = document.querySelector(".filter-btn.active").getAttribute("data-filter")
    filterProjects(activeFilter, searchTerm)
  })

  // Initialize with "all" filter
  filterProjects("all")

  // Add hover effects to project cards
  projectCards.forEach((card) => {
    // Add floating animation
    card.style.transition =
      "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, opacity 0.5s ease"

    // Random floating animation
    const randomDelay = Math.random() * 2
    card.style.animationDelay = `${randomDelay}s`

    // Add subtle floating effect
    card.addEventListener("mouseenter", () => {
      card.style.boxShadow = "0 15px 30px rgba(0, 255, 255, 0.2)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)"
    })
  })
}

// Testimonials Slider
function initTestimonialsSlider() {
  const track = document.querySelector(".testimonials-track")
  const prevBtn = document.querySelector(".testimonial-prev")
  const nextBtn = document.querySelector(".testimonial-next")
  const dots = document.querySelectorAll(".dot")
  let currentSlide = 0
  const totalSlides = dots.length

  function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide)
    })
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides
    updateSlider()
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
    updateSlider()
  }

  nextBtn.addEventListener("click", nextSlide)
  prevBtn.addEventListener("click", prevSlide)

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index
      updateSlider()
    })
  })

  // Auto-play slider
  setInterval(nextSlide, 5000)
}

// Project Modal
function initProjectModal() {
  const modal = document.querySelector(".project-modal")
  const modalClose = document.querySelector(".modal-close")
  const projectCards = document.querySelectorAll(".project-card")

  modalClose.addEventListener("click", () => {
    modal.classList.remove("active")
  })

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active")
    }
  })

  projectCards.forEach((card) => {
    card.addEventListener("dblclick", () => {
      // Open modal with project details
      modal.classList.add("active")
      // You can populate modal content here
    })
  })
}

// Add touch support for mobile devices
function initTouchSupport() {
  const projectCards = document.querySelectorAll(".project-card")

  // Touch support for project cards
  projectCards.forEach((card) => {
    let touchStartTime = 0

    card.addEventListener("touchstart", (e) => {
      touchStartTime = Date.now()
    })

    card.addEventListener("touchend", (e) => {
      const touchDuration = Date.now() - touchStartTime

      // If it's a quick tap (less than 300ms), toggle the card
      if (touchDuration < 300) {
        e.preventDefault()
        card.classList.toggle("touched")

        // Remove touched class from other cards
        projectCards.forEach((otherCard) => {
          if (otherCard !== card) {
            otherCard.classList.remove("touched")
          }
        })
      }
    })
  })

  // Close touched cards when tapping outside
  document.addEventListener("touchstart", (e) => {
    if (!e.target.closest(".project-card")) {
      projectCards.forEach((card) => {
        card.classList.remove("touched")
      })
    }
  })
}

// Responsive navigation handling
function handleResponsiveNav() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mobileNav = document.querySelector(".mobile-nav")
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav-links a")

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      mobileNav.classList.remove("active")
      mobileMenuBtn.classList.remove("active")
    }
  })

  // Close mobile nav when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        mobileNav.classList.remove("active")
        mobileMenuBtn.classList.remove("active")
      }
    })
  })
}

// Responsive skills orbit
function handleResponsiveSkillsOrbit() {
  const skillsOrbit = document.querySelector(".skills-orbit")

  function adjustOrbitSize() {
    const screenWidth = window.innerWidth
    let orbitSize = 400

    if (screenWidth <= 480) {
      orbitSize = 220
    } else if (screenWidth <= 576) {
      orbitSize = 250
    } else if (screenWidth <= 768) {
      orbitSize = 280
    } else if (screenWidth <= 992) {
      orbitSize = 320
    } else if (screenWidth <= 1200) {
      orbitSize = 350
    }

    if (skillsOrbit) {
      skillsOrbit.style.width = `${orbitSize}px`
      skillsOrbit.style.height = `${orbitSize}px`
    }
  }

  adjustOrbitSize()
  window.addEventListener("resize", adjustOrbitSize)
}

// Responsive testimonials
function handleResponsiveTestimonials() {
  const testimonialCards = document.querySelectorAll(".testimonial-card")

  function adjustTestimonialPadding() {
    const screenWidth = window.innerWidth

    testimonialCards.forEach((card) => {
      if (screenWidth <= 480) {
        card.style.padding = "1rem"
      } else if (screenWidth <= 768) {
        card.style.padding = "1.5rem 1rem"
      } else {
        card.style.padding = "3rem"
      }
    })
  }

  adjustTestimonialPadding()
  window.addEventListener("resize", adjustTestimonialPadding)
}

// Responsive particle system
function handleResponsiveParticles() {
  const container = document.getElementById("particles-container")

  function adjustParticleCount() {
    const screenWidth = window.innerWidth
    let particleCount = 50

    if (screenWidth <= 480) {
      particleCount = 20
    } else if (screenWidth <= 768) {
      particleCount = 30
    } else if (screenWidth <= 992) {
      particleCount = 40
    }

    // Clear existing particles
    container.innerHTML = ""

    // Create new particles with adjusted count
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.left = Math.random() * 100 + "%"
      particle.style.animationDelay = Math.random() * 20 + "s"
      particle.style.animationDuration = Math.random() * 10 + 10 + "s"
      container.appendChild(particle)
    }
  }

  adjustParticleCount()
  window.addEventListener("resize", adjustParticleCount)
}

// Responsive modal handling
function handleResponsiveModal() {
  const modal = document.querySelector(".project-modal")
  const modalContent = document.querySelector(".modal-content")

  function adjustModalSize() {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    if (modalContent) {
      if (screenWidth <= 768) {
        modalContent.style.maxWidth = "95vw"
        modalContent.style.maxHeight = "95vh"
        modalContent.style.margin = "2.5vh auto"
      } else {
        modalContent.style.maxWidth = "90vw"
        modalContent.style.maxHeight = "90vh"
        modalContent.style.margin = "5vh auto"
      }
    }
  }

  adjustModalSize()
  window.addEventListener("resize", adjustModalSize)
}

// Responsive font scaling
function handleResponsiveFonts() {
  function adjustFontSizes() {
    const screenWidth = window.innerWidth
    const root = document.documentElement

    if (screenWidth <= 360) {
      root.style.fontSize = "14px"
    } else if (screenWidth <= 480) {
      root.style.fontSize = "15px"
    } else if (screenWidth <= 768) {
      root.style.fontSize = "16px"
    } else {
      root.style.fontSize = "16px"
    }
  }

  adjustFontSizes()
  window.addEventListener("resize", adjustFontSizes)
}

// Responsive image loading
function handleResponsiveImages() {
  const images = document.querySelectorAll("img")

  images.forEach((img) => {
    img.addEventListener("load", () => {
      img.style.opacity = "1"
    })

    img.addEventListener("error", () => {
      img.style.opacity = "0.5"
      img.alt = "Image not available"
    })
  })
}

// Performance optimization for mobile
function optimizeForMobile() {
  const isMobile = window.innerWidth <= 768

  if (isMobile) {
    // Reduce animation complexity on mobile
    const tesseract = document.querySelector(".tesseract")
    if (tesseract) {
      tesseract.style.animationDuration = "30s" // Slower animation
    }

    // Disable parallax on mobile for better performance
    const parallaxElements = document.querySelectorAll(".tesseract")
    parallaxElements.forEach((element) => {
      element.style.transform = "translate(-50%, -50%)"
    })
  }
}

// Initialize all functions
document.addEventListener("DOMContentLoaded", () => {
  createParticles()
  initThemeToggle()
  initMobileNav()
  smoothScroll()
  handleScrollAnimations()
  initStatsCounter()
  initSkillsOrbit()
  initContactForm()
  initHeroCTA()
  initParallax()
  updateNavigation()
  initTypingEffect()
  initProjectFilters()
  initTestimonialsSlider()
  initProjectModal()

  // Add loading animation
  document.body.style.opacity = "0"
  setTimeout(() => {
    document.body.style.transition = "opacity 1s ease"
    document.body.style.opacity = "1"
  }, 100)

  // Add new responsive functions
  initTouchSupport()
  handleResponsiveNav()
  handleResponsiveSkillsOrbit()
  handleResponsiveTestimonials()
  handleResponsiveParticles()
  handleResponsiveModal()
  handleResponsiveFonts()
  handleResponsiveImages()
  optimizeForMobile()
})

// Performance optimization
window.addEventListener("load", () => {
  // Remove loading states
  document.body.classList.add("loaded")
})

// Resize handler
window.addEventListener("resize", () => {
  // Recalculate particle positions if needed
  const particles = document.querySelectorAll(".particle")
  particles.forEach((particle) => {
    particle.style.left = Math.random() * 100 + "%"
  })
})

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.querySelector(".project-modal")
    const mobileNav = document.querySelector(".mobile-nav")

    if (modal.classList.contains("active")) {
      modal.classList.remove("active")
    }

    if (mobileNav.classList.contains("active")) {
      mobileNav.classList.remove("active")
      document.querySelector(".mobile-menu-btn").classList.remove("active")
    }
  }
})

// Handle orientation changes
window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    handleResponsiveSkillsOrbit()
    handleResponsiveTestimonials()
    handleResponsiveParticles()
    optimizeForMobile()
  }, 100)
})

// Handle viewport changes (for mobile browsers with dynamic viewport)
const vh = window.innerHeight * 0.01
document.documentElement.style.setProperty("--vh", `${vh}px`)

window.addEventListener("resize", () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty("--vh", `${vh}px`)
})
