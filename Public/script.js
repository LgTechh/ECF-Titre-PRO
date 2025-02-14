document.addEventListener('DOMContentLoaded', async() => {
    let events = [];

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:3001/data/events.json');
            const data = await response.json();
            return data.events;
        } catch (error) {
            console.error('Erreur de chargement des données', error);
            return [];
        }
    };

    events = await fetchEvents();

    events.forEach(event => {
        const div = document.createElement('div');
        div.classList.add('event-marker', event.category, event.shape);
        div.setAttribute('data-event-id', event.id);

        const friseContainer = document.querySelector('.frise_container')
        friseContainer.appendChild(div);
    });

    setupEventListeners();

    const toggleView = () => {
        const pageIntro = document.querySelector('.pageIntro');
        const pageFrise = document.querySelector('.pageFrise');


        pageIntro.classList.add("fade-out");

        pageIntro.addEventListener('animationend', () => {

            pageIntro.style.display = "none";
            pageIntro.classList.remove("fade-out");

            pageFrise.style.display = "flex";
            pageFrise.classList.add("fade-in");

            setTimeout(() => {
                pageFrise.classList.add("visible");
            }, 50);

        });
    };

    const launchSite = document.querySelector('.startSite');
    launchSite.addEventListener('click', () => toggleView());

    function setupEventListeners() {
        const eventMarkers = document.querySelectorAll('.event-marker');
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalImage = document.getElementById('modal-image');
        const modalPeriode = document.getElementById('modal-periode');
        const modalDate = document.getElementById('modal-date');
        const modalLien = document.getElementById('modal-lien');
        const closeModal = document.querySelector('.close');

        eventMarkers.forEach(marker => {
            marker.addEventListener('click', () => {
                const eventId = marker.dataset.eventId;
                const event = events.find(e => e.id === eventId);

                if (event) {
                    modalImage.src = event.image;
                    modalTitle.textContent = event.title;
                    modalDescription.textContent = event.description;
                    modalLien.href = event.lien;
                    modalPeriode.textContent = event.periode;
                    modalDate.textContent = event.date
                    modal.style.display = 'block';
                }
            });
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    const toggleButton = document.querySelector('.toggle-button');
    const navbarLinks = document.querySelector('.navbar-links');
    const homeLink = document.querySelector('.home-link');

    toggleButton.addEventListener('click', () => {
        navbarLinks.classList.toggle('active');
    });

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        const pageIntro = document.querySelector('.pageIntro');
        const pageFrise = document.querySelector('.pageFrise');

        pageFrise.style.display = 'none';
        pageIntro.style.display = 'flex';
        pageIntro.classList.remove('fade-out');
        pageFrise.classList.remove('fade-in', 'visible');

        if (navbarLinks.classList.contains('active')) {
            navbarLinks.classList.remove('active');
        }
    });
});

