import ApiSearch from './js/api-search';
import photoCardTpl from './templates/photo-card.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/main.scss';

const refs = {
  searchForm: document.querySelector('#search-form'),
  divGallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const apiSearch = new ApiSearch();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();

  refs.loadMoreBtn.classList.add('is-hidden');

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
      clearCardMarkup();
      appendCardMarkup(searchedPhotos.hits);

      Notify.info(`Hooray! We found ${searchedPhotos.totalHits} images.`);

      refs.loadMoreBtn.classList.remove('is-hidden');

      let gallery = new SimpleLightbox('.gallery a');
    })
    .catch(() =>
      Notify.failure('Sorry, there are no images matching your search query. Please try again.'),
    );
}

function onLoadMore() {
  refs.loadMoreBtn.classList.add('is-hidden');
  apiSearch.searchPhotos().then(searchedPhotos => {
    appendCardMarkup(searchedPhotos.hits);
    if (searchedPhotos.totalHits < refs.divGallery.children.length) {
      refs.loadMoreBtn.classList.add('is-hidden');

      return Notify.failure("We're sorry, but you've reached the end of search results.");
    }
    refs.loadMoreBtn.classList.remove('is-hidden');
    let gallery = new SimpleLightbox('.gallery a');
  });
}

function appendCardMarkup(searchedPhotos) {
  refs.divGallery.insertAdjacentHTML('beforeend', photoCardTpl(searchedPhotos));
}

function clearCardMarkup() {
  refs.divGallery.innerHTML = '';
}
