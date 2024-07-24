document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.link-converter input');
  const button = document.querySelector('#shorten-button');
  const resultContainer = document.querySelector('.result-container');
  const errorMessage = document.querySelector('#error-message');
  const bitlyToken = 'ab0f9ffa8ed9dad51704ce51da76f14e1cee5ee4'; 
  

  const menuIcon = document.getElementById("menu-icon");
  const mobileNav = document.getElementById("mobile-nav");

  menuIcon.addEventListener("click", function() {
    mobileNav.classList.toggle("active");
  });


  // Fonction pour vérifier si l'URL est valide
  function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Fonction pour raccourcir l'URL
  async function shortenURL(url) {
    const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bitlyToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ long_url: url })
    });
    const data = await response.json();
    if (response.ok) {
      return data.link;
    } else {
      throw new Error(data.message || 'Unable to shorten URL');
    }
  }

  // Fonction pour afficher le lien raccourci
  function displayShortenedLink(shortURL, originalURL) {
    const shortenedLinkDiv = document.createElement('div');
    shortenedLinkDiv.classList.add('shortened-link');

    const originalLink = document.createElement('p');
    originalLink.classList.add('original-link');
    originalLink.textContent = originalURL;

    const Hr = document.createElement('hr');

    const shortLink = document.createElement('a');
    shortLink.classList.add('short-link');
    shortLink.href = shortURL;
    shortLink.textContent = shortURL;
    shortLink.target = '_blank';

    const copyButton = document.createElement('button');
    copyButton.classList.add('copy-button');
    copyButton.textContent = 'Copy';
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(shortURL).then(() => {
          copyButton.textContent = 'Copied!';
          copyButton.classList.add('clicked'); // Ajoute la classe
          setTimeout(() => {
              copyButton.textContent = 'Copy';
              copyButton.classList.remove('clicked'); // Retire la classe après 5 secondes
          }, 5000);
      });
  });


    shortenedLinkDiv.appendChild(originalLink);
    shortenedLinkDiv.appendChild(Hr);
    shortenedLinkDiv.appendChild(shortLink);
    shortenedLinkDiv.appendChild(copyButton);

    resultContainer.appendChild(shortenedLinkDiv);
    resultContainer.classList.remove('hidden');
  }

  // Événement de clic sur le bouton de raccourcissement
  button.addEventListener('click', async () => {
    const url = input.value.trim();
    if (!isValidURL(url)) {
      input.classList.add('input-error');
      errorMessage.classList.remove('hidden');
    } else {
      input.classList.remove('input-error');
      errorMessage.classList.add('hidden');
      try {
        const shortURL = await shortenURL(url);
        displayShortenedLink(shortURL, url);
        input.value = '';
      } catch (error) {
        console.error('Error shortening URL:', error);
      }
    }
  });
});
