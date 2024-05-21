/**
 * Description:
 * This file contains utility functions for common operations.
 */

import { customAlphabet } from 'nanoid';
import xmlFormat from 'xml-formatter';

const isInvalidString = (str) => {
  return !str || !str.length || typeof str !== 'string';
};

const formatRelativeDateInPlural = (difference, unit) => {
  return `${difference} ${unit}${difference > 1 ? 's' : ''} ago`;
};

// a customized version of nanoid without using _ and -
export const uuid = () => {
  // https://github.com/ai/nanoid/blob/main/url-alphabet/index.js
  const urlAlphabet = 'useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict';
  const customNanoId = customAlphabet(urlAlphabet, 21);

  return customNanoId();
};

export const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36);
};

export const waitForNextTick = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 0);
  });
};

export const safeParseJSON = (str) => {
  if (isInvalidString(str)) {
    return str;
  }
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
};

export const safeStringifyJSON = (obj, indent = false) => {
  if (obj === undefined) {
    return obj;
  }
  try {
    if (indent) {
      return JSON.stringify(obj, null, 2);
    }
    return JSON.stringify(obj);
  } catch (e) {
    return obj;
  }
};

export const convertToCodeMirrorJson = (obj) => {
  try {
    return JSON5.stringify(obj).slice(1, -1);
  } catch (e) {
    return obj;
  }
};

export const safeParseXML = (str, options) => {
  if (isInvalidString(str)) {
    return str;
  }
  try {
    return xmlFormat(str, options);
  } catch (e) {
    return str;
  }
};

// Remove any characters that are not alphanumeric, spaces, hyphens, or underscores
export const normalizeFileName = (name) => {
  if (!name) {
    return name;
  }

  const validChars = /[^\w\s-]/g;
  const formattedName = name.replace(validChars, '-');

  return formattedName;
};

export const getContentType = (headers) => {
  const headersArray = typeof headers === 'object' ? Object.entries(headers) : [];
  const jsonContentTypeRegex = /^[\w\-]+\/([\w\-]+\+)?json/;
  const xmlContentTypeRegex = /^[\w\-]+\/([\w\-]+\+)?xml/;

  if (headersArray.length > 0) {
    let contentType = headersArray
      .filter((header) => header[0].toLowerCase() === 'content-type')
      .map((header) => {
        return header[1];
      });
    if (contentType && contentType.length) {
      if (typeof contentType[0] == 'string' && jsonContentTypeRegex.test(contentType[0])) {
        return 'application/ld+json';
      } else if (typeof contentType[0] == 'string' && xmlContentTypeRegex.test(contentType[0])) {
        return 'application/xml';
      }

      return contentType[0];
    }
  }

  return '';
};

export const startsWith = (str, search) => {
  if (isInvalidString(str)) {
    return false;
  }

  if (isInvalidString(search)) {
    return false;
  }

  return str.substr(0, search.length) === search;
};

export const pluralizeWord = (word, count) => {
  return count === 1 ? word : `${word}s`;
};

export const relativeDate = (dateString) => {
  const date = new Date(dateString);
  const currentDate = new Date();

  const difference = currentDate - date;
  const secondsDifference = Math.floor(difference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);
  const weeksDifference = Math.floor(daysDifference / 7);
  const monthsDifference = Math.floor(daysDifference / 30);

  if (secondsDifference < 60) {
    return 'Few seconds ago';
  } else if (minutesDifference < 60) {
    return formatRelativeDateInPlural(minutesDifference, 'minute');
  } else if (hoursDifference < 24) {
    return formatRelativeDateInPlural(hoursDifference, 'hour');
  } else if (daysDifference < 7) {
    return formatRelativeDateInPlural(daysDifference, 'day');
  } else if (weeksDifference < 4) {
    return formatRelativeDateInPlural(weeksDifference, 'week');
  } else {
    return formatRelativeDateInPlural(monthsDifference, 'month');
  }
};

export const humanizeDate = (dateString) => {
  // See this discussion for why .split is necessary
  // https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
  const date = new Date(dateString.split('-'));
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
