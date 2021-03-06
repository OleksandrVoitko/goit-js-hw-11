import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';

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
        return;
      }

      this.incrementPage();

      return query.data;
    });
  }

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
