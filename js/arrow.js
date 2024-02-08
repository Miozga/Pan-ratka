document.addEventListener('DOMContentLoaded', function () {
  // Pobierz elementy strzałki i kontenera
  var arrowContainer = document.getElementById('arrow-container');
  var scrollToTopLink = document.querySelector('.scroll-to-top');

  // Dodaj obsługę zdarzenia kliknięcia
  scrollToTopLink.addEventListener('click', function (event) {
    event.preventDefault();
    // Przewiń do góry strony z animacją
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // Pokaż lub ukryj strzałkę na podstawie pozycji przewinięcia
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      arrowContainer.style.display = 'block';
    } else {
      arrowContainer.style.display = 'none';
    }
  });
});
