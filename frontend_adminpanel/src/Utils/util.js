class util {

    setToken = (token) => {
        window.localStorage.setItem('token', token);
    }

    getToken = () => {
        let list = window.localStorage['token'];
        if (list) {
            return list;
        }
        else {
            return null;
        }
    }

    isLogged = () => {
        if (typeof window.localStorage['token'] !== "undefined" && window.localStorage['token'] !== '') {
            return true;
        }
        return false;
    }

    logout = (e) => {
        if (e) e.preventDefault();
        window.localStorage.clear();
    }
}
export default new util();