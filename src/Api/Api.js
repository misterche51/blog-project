
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class API {
  BASE_URL = 'https://conduit.productionready.io/api';
  authorizationHeader = null;

  getResource = async (url) => {
    const body = { method: 'GET' };
    if (this.authorizationHeader) {
      body.headers = {};
      body.headers.Authorization = this.authorizationHeader;
    }

    const res = await fetch(`${this.BASE_URL}${url}`, body);

    if (!res.ok) {
      console.log('Could not fetch');
      throw new Error('Could not fetch');
    }
    return res.json();
  };

  postResource = async (url, body) => {
    const headers = { 'Content-Type': 'application/json;charset=utf-8' };
    if (this.authorizationHeader) {
      headers.Authorization = this.authorizationHeader;
    }

    const res = await fetch(`${this.BASE_URL}${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return res.json();
  };

  putResource = async (url, body) => {
    const headers = { 'Content-Type': 'application/json;charset=utf-8' };
    if (this.authorizationHeader) {
      headers.Authorization = this.authorizationHeader;
    }

    const res = await fetch(`${this.BASE_URL}${url}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.log('Could not put');
      throw new Error('Could not put');
    }
    return res.json();
  };

  deleteResource = async (url) => {
    const headers = { 'Content-Type': 'application/json;charset=utf-8' };
    if (this.authorizationHeader) {
      headers.Authorization = this.authorizationHeader;
    }

    const res = await fetch(`${this.BASE_URL}${url}`, {
      method: 'DELETE',
      headers,
    });

    return res.json();
  }

  makeLike = async (slug) => {
    const res = await this.postResource(`/articles/${slug}/favorite`);
    return res;
  }

  deleteLike = async (slug) => {
    const res = await this.deleteResource(`/articles/${slug}/favorite`);
    return res;
  }

  authentication = async (email, password) => {
  const token = cookies.get('token');
  if (token) {
    this.authorizationHeader = `Token ${token}`;
    return this.getCurrentUser();
  }

  if (!email || !password) {
    return 'empty';
  }
  const body = {
    user: {
      email,
      password,
    },
  };
    const res = await this.postResource('/users/login', body);
    if (res.user) {
      this.authorizationHeader = `Token ${res.user.token}`;
      cookies.set('token', res.user.token, { sameSite: 'strict' });
    }
  return res;
  };

  getCurrentUser = async () => {
    const res = await this.getResource('/user');
    return res;
  };

  updateUserInfo = async (user) => {
    const res = await this.putResource('/user', user);
    return res;
  }

   logOutUser = () => {
    cookies.remove('token');
    this.authorizationHeader = null;
  };

  createArticle = async (article) => {
    const res = await this.postResource(`/articles`, article);
    return res;
  };

  updateArticle = async (article, slug) => {
    const res = await this.putResource(`/articles/${slug}`, article);
    return res;
  }

  registration = async (username, email, password) => {
    const body = {
      user: {
        username,
        email,
        password,
      },
    };

    const res = await this.postResource('/users', body);
    return res;
  };

  fetchArticlesList = async (perPage, currentPage) => {
    const offset = (currentPage - 1) * perPage;
    const res = await this.getResource(`/articles?limit=${perPage}&offset=${offset}`);
    return res
  }

  fetchSingleArticle = async (slug) => {
    const res = await this.getResource(`/articles/${slug}`);
    return res
  }

  deleteArticle = async (slug) => {
    const res = await this.deleteResource(`/articles/${slug}`);
    return res;
  }
}

const Api = new API();

export default Api;