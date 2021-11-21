import ApiSearch from './js/api-search';
import photoCardTpl from './templates/photo-card.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import './sass/main.scss';

const refs = {
  searchForm: document.querySelector('#search-form'),
  divGallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const apiSearch = new ApiSearch();
let totalHits = 0;

refs.loadMoreBtn.setAttribute('disabled', true);

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();

  refs.loadMoreBtn.setAttribute('disabled', true);

  const searchWord = event.currentTarget.elements.searchQuery.value;
  if (searchWord.trim() === '') {
    return Notify.failure('Please enter something.');
  } else {
    apiSearch.query = searchWord.trim();
  }

  apiSearch.resetPage();
  apiSearch
    .searchPhotos()
    .then(searchedPhotos => {
      totalHits = searchedPhotos.totalHits - apiSearch.per_page;

      clearCardMarkup();
      appendCardMarkup(searchedPhotos.hits);

      Notify.info(`Hooray! We found ${searchedPhotos.totalHits} images.`);

      refs.loadMoreBtn.classList.remove('is-hidden');
      refs.loadMoreBtn.removeAttribute('disabled');

      let gallery = new SimpleLightbox('.gallery a');
    })
    .catch(() =>
      Notify.failure('Sorry, there are no images matching your search query. Please try again.'),
    );
}

function onLoadMore() {
  apiSearch.searchPhotos().then(searchedPhotos => {
    totalHits = totalHits - apiSearch.per_page;

    appendCardMarkup(searchedPhotos.hits);
    if (totalHits < 0) {
      refs.loadMoreBtn.setAttribute('disabled', true);

      return Notify.failure("We're sorry, but you've reached the end of search results.");
    }
    let gallery = new SimpleLightbox('.gallery a');
  });
}

function appendCardMarkup(searchedPhotos) {
  refs.divGallery.insertAdjacentHTML('beforeend', photoCardTpl(searchedPhotos));
}

function clearCardMarkup() {
  refs.divGallery.innerHTML = '';
}
