export default class Permission {

  constructor(win) {
    this._win = win;
    this.DEFAULT = 'default';
    this.GRANTED = 'granted';
    this.DENIED = 'denied';
    this._permissions = [
      this.GRANTED,
      this.DEFAULT,
      this.DENIED
    ];
  }

  /**
   * Requests permission for desktop notifications
   * @param {Function} onGranted - Function to execute once permission is granted
   * @param {Function} onDenied - Function to execute once permission is denied
   * @return {void}
   */
  request(onGranted, onDenied) {
    const existing = this.get();

    /* Permissions already set */
    if (existing !== this.DEFAULT) {
      if (existing === this.GRANTED || existing === 0) {
        if (onGranted) onGranted();
      } else if (onDenied) onDenied();
    }
    /* Safari 6+, Chrome 23+ */
    else if (this._win.Notification && this._win.Notification.requestPermission) {
      this._win.Notification.requestPermission().then(callback).catch(function () {
        if (onDenied) onDenied();
      });
    }
    /* Legacy webkit browsers */
    else if (this._win.webkitNotifications && this._win.webkitNotifications.checkPermission)
      this._win.webkitNotifications.requestPermission(callback);
    /* Let the user continue by default */
    else if (onGranted) onGranted();
  }

  /**
   * Returns whether Push has been granted permission to run
   * @return {Boolean}
   */
  has() {
    return this.get() === this.GRANTED;
  }

  /**
   * Gets the permission level
   * @return {Permission} The permission level
   */
  get() {
    let permission;

    /* Safari 6+, Chrome 23+ */
    if (this._win.Notification && this._win.Notification.permission)
      permission = this._win.Notification.permission;

    /* Legacy webkit browsers */
    else if (this._win.webkitNotifications && this._win.webkitNotifications.checkPermission)
      permission = this._permissions[this._win.webkitNotifications.checkPermission()];

    /* Firefox Mobile */
    else if (navigator.mozNotification)
      permission = this.GRANTED;

    /* IE9+ */
    else if (this._win.external && this._win.external.msIsSiteMode)
      permission = this._win.external.msIsSiteMode() ? this.GRANTED : this.DEFAULT;

    else
      permission = this.GRANTED;

    return permission;
  }
}
