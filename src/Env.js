class Env {
  constructor() {
    const env = process.env.NODE_ENV || "development";

    this.FetchOptions =
      env === "development"
        ? {
            mode: "cors",
            credentials: "include"
          }
        : {};

    this.DropboxClientID = "fub6552as6wm1wa";
    this.DropboxRedirectPath = "finish_dbx_auth";
    this.DropboxRedirectUrl = `http://localhost:3000/${
      this.DropboxRedirectPath
    }`;
    this.DropboxAuthorizeUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${
      this.DropboxClientID
    }&response_type=code&redirect_uri=${this.DropboxRedirectUrl}`;
    this.DropboxAccessTokenUrl = `http://localhost:3333/accessToken?authorizationCode=`;
  }
}

export const env = new Env();
