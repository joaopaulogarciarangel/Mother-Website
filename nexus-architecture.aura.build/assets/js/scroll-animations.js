window.addEventListener("load", () => {
    gsap.registerPlugin(ScrollTrigger);

    // General GSAP Fade Up Animations
    gsap.utils.toArray('.gsap-fade-up').forEach(element => {
        gsap.fromTo(element,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
              scrollTrigger: {
                  trigger: element,
                  start: "top 85%",
              }
            }
        );
    });

    // Native DOM/GSAP Implementation of the Column Slide & Blur Animation
    document.querySelectorAll('.image-anim-container').forEach(container => {
        if(container.classList.contains('initialized')) return;
        container.classList.add('initialized');

        const img = container.querySelector('img');
        const src = img.src;
        const alt = img.alt;

        // Hide the original image
        img.style.display = 'none';

        // Remove any pre-rendered duplicate nodes to ensure clean execution
        container.querySelectorAll('div.absolute').forEach(el => el.remove());

        const cols = 4;

        for(let i = 0; i < cols; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'absolute inset-0 overflow-hidden';

            // Create vertical slices using clip-path
            const left = (i / cols) * 100;
            const right = 100 - ((i + 1) / cols) * 100;
            wrapper.style.clipPath = `inset(0 ${right}% 0 ${left}%)`;
            wrapper.style.webkitClipPath = `inset(0 ${right}% 0 ${left}%)`;

            const innerImg = document.createElement('img');
            innerImg.src = src;
            innerImg.alt = alt;
            innerImg.className = 'absolute w-full object-cover';

            // Make image taller to prevent empty edges during scroll translation
            innerImg.style.height = '140%';
            innerImg.style.top = '-20%';
            innerImg.style.left = '0';

            wrapper.appendChild(innerImg);
            container.appendChild(wrapper);

            // Y Parallax animation
            gsap.fromTo(innerImg,
                { yPercent: (i % 2 === 0) ? -15 : -5 },
                {
                    yPercent: (i % 2 === 0) ? 15 : 5,
                    ease: "none",
                    scrollTrigger: {
                        trigger: container,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                }
            );

            // Scroll-based Blur effect for columns
            gsap.fromTo(innerImg,
                { filter: "blur(12px) brightness(0.9)" },
                {
                    filter: "blur(0px) brightness(1)",
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: container,
                        start: "top 95%",
                        end: "center center",
                        scrub: true,
                    }
                }
            );
        }
    });
});
