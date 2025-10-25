document.addEventListener('DOMContentLoaded', () => {

    const cardContainer = document.getElementById('cardContainer');
    const loader = document.getElementById('loader');
    const searchInput = document.getElementById('searchInput'); // Referencia a la barra de búsqueda
    const API_URL = 'https://dog.ceo/api/breeds/list/all';

    // Variable para guardar todos los datos de las razas una vez cargados
    let allBreedsData = [];

    const toggleLoader = (show) => {
        loader.classList.toggle('show', show);
    };

    /**
     * Carga todas las razas de la API y las guarda localmente.
     */
    const loadAllBreeds = async () => {
        toggleLoader(true);
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            const breeds = Object.keys(data.message);

            const imagePromises = breeds.map(async (breed) => {
                const imgResponse = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
                const imgData = await imgResponse.json();
                return { name: breed, image: imgData.message };
            });

            // Guardamos todos los resultados en nuestra variable global
            allBreedsData = await Promise.all(imagePromises);
            
            // Mostramos todas las tarjetas la primera vez
            displayBreeds(allBreedsData);

        } catch (error) {
            cardContainer.innerHTML = `<p>Hubo un error al cargar las imágenes.</p>`;
            console.error("Error fetching dog breeds:", error);
        } finally {
            toggleLoader(false);
        }
    };

    /**
     * Muestra las tarjetas de las razas en el DOM.
     * @param {Array} breeds - El array de razas a mostrar (puede ser el completo o el filtrado).
     */
    const displayBreeds = (breeds) => {
        cardContainer.innerHTML = '';

        if (breeds.length === 0) {
            cardContainer.innerHTML = '<p>No se encontraron razas con ese nombre.</p>';
            return;
        }
        
        // Ya no hay .slice(), simplemente mostramos lo que recibimos
        breeds.forEach(breed => {
            const breedCardHTML = `
                <article class="card">
                    <div class="card-img-container">
                        <img src="${breed.image}" alt="Foto de un ${breed.name}">
                    </div>
                    <div class="card-body">
                        <h3>${breed.name}</h3>
                    </div>
                </article>
            `;
            cardContainer.innerHTML += breedCardHTML;
        });
    };

    // Evento que se dispara cada vez que el usuario escribe en la barra
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase().trim();

        // Filtramos el array que ya tenemos guardado en memoria
        const filteredBreeds = allBreedsData.filter(breed => 
            breed.name.toLowerCase().includes(searchTerm)
        );

        // Volvemos a llamar a displayBreeds, pero solo con los resultados filtrados
        displayBreeds(filteredBreeds);
    });

    // Inicia la carga de datos al abrir la página
    loadAllBreeds();
});