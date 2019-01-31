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

    this.DropboxRedirectUrl = `${process.env.PUBLIC_URL}/${
      process.env.REACT_APP_DROPBOX_REDIRECT_PATH
    }`;

    this.DropboxAuthorizeUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${
      process.env.REACT_APP_DROPBOX_CLIENT_ID
    }&response_type=code&redirect_uri=${this.DropboxRedirectUrl}`;

    this.DropboxAccessTokenUrl = `${
      process.env.REACT_APP_BACKEND_URL
    }/accessToken?authorizationCode=`;

    this.DropboxNotifications = `${
      process.env.REACT_APP_BACKEND_URL
    }/notifications`;
  }
}

export const env = new Env();
