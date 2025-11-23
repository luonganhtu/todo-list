/**
 * Utility functions for managing cookies
 */

/**
 * Set a cookie
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Number of days until expiration (default: 7)
 */
export const setCookie = (
  name: string,
  value: string,
  days: number = 7
): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
};

/**
 * Remove a cookie
 * @param name - Cookie name
 */
export const removeCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
};
