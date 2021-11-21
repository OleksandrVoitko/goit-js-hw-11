import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.baseURL = 'https://pixabay.com/api';

const refs = {
  loadMoreBtn: document.querySelector('.load-more'),
};

export default class ApiSearch {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async searchPhotos() {
    const url = `?key=24435359-4fe3fd99e7e91c25a1144d667&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`;

    return await axios.get(url).then(query => {
      if (query.data.total === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      }

      this.incrementPage();

      refs.loadMoreBtn.removeAttribute('disabled');
      return query.data;
    });
  }

  totalHits() {}

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
