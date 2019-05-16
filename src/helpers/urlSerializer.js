/* eslint-disable quote-props */
import slugify from 'slugify';

slugify.extend({
// Arabic
'ء': 'e',
'آ': 'a',
'أ': 'a',
'ؤ': 'w',
'إ': 'i',
'ئ': 'y',
'ا': 'a',
'ب': 'b',
'ة': 't',
'ت': 't',
'ث': 'th',
'ج': 'j',
'ح': 'h',
'خ': 'kh',
'د': 'd',
'ذ': 'dh',
'ر': 'r',
'ز': 'z',
'س': 's',
'ش': 'sh',
'ص': 's',
'ض': 'd',
'ط': 't',
'ظ': 'z',
'ع': 'e',
'غ': 'gh',
'ـ': '_',
'ف': 'f',
'ق': 'q',
'ك': 'k',
'ل': 'l',
'م': 'm',
'ن': 'n',
'ه': 'h',
'و': 'w',
'ى': 'a',
'ي': 'y',
'َ‎': 'a',
'ُ': 'u',
'ِ‎': 'i',
'٠': '0',
'١': '1',
'٢': '2',
'٣': '3',
'٤': '4',
'٥': '5',
'٦': '6',
'٧': '7',
'٨': '8',
'٩': '9',

// Persian / Farsi
'چ': 'ch',
'ک': 'k',
'گ': 'g',
'پ': 'p',
'ژ': 'zh',
'ی': 'y',
'۰': '0',
'۱': '1',
'۲': '2',
'۳': '3',
'۴': '4',
'۵': '5',
'۶': '6',
'۷': '7',
'۸': '8',
'۹': '9',

// Pashto
'ټ': 'p',
'ځ': 'z',
'څ': 'c',
'ډ': 'd',
'ﺫ': 'd',
'ﺭ': 'r',
'ړ': 'r',
'ﺯ': 'z',
'ږ': 'g',
'ښ': 'x',
'ګ': 'g',
'ڼ': 'n',
'ۀ': 'e',
'ې': 'e',
'ۍ': 'ai',

// Urdu
'ٹ': 't',
'ڈ': 'd',
'ڑ': 'r',
'ں': 'n',
'ہ': 'h',
'ھ': 'h',
'ے': 'e',
});

const pathSlicer = (str, type) => {
  const path = str.split('/');

  if (type === 'Post') {
    const title = path[1].slice(0, -25);
    return {
      title,
    };
  } if (type === 'Comment') {
    const author = path[1].slice(1);
    const content = path[2].slice(0, -25).slice(0, 100);

    return {
      content,
      author,
    };
  }
  return false;
};

export default (obj) => {
  if (typeof obj !== 'object') throw Error('urlSerielizer needs object as argument');
  const {
    type,
    id,
    username,
    text,
    pathname = null,
  } = obj;

  const titleSlugify = {
    title: null,
    valid: {
      title: false,
    },
  };
  const contentSlugify = {
    content: null,
    valid: {
      username: false,
      content: false,
    },
  };
  if (text.title) {
    const path = pathname ? pathSlicer(pathname, 'Post') : false;
    titleSlugify.title = slugify(text.title, {
      lower: true,
      remove: /[^a-zA-Z\d\s:]/,
    });
    titleSlugify.valid.title = !type.post ? null : titleSlugify.title === path.title;
  } else if (text.content) {
    const path = pathname ? pathSlicer(pathname, 'Comment') : false;
    contentSlugify.content = slugify(text.content.slice(0, 100), {
      lower: true,
      remove: /[^a-zA-Z\d\s:]/,
    });
    contentSlugify.content = contentSlugify.content === '' ? contentSlugify.content = '-' : contentSlugify.content;

    contentSlugify.valid.username = !type.comment ? null : path.author === username;
    contentSlugify.valid.content = !type.comment ? null : contentSlugify.content === path.content;
  }

  const postUrl = type.post && titleSlugify.title ? `/${titleSlugify.title}-${id}` : false;
  const commentUrl = type.comment && username && contentSlugify.content ? `/@${username}/${contentSlugify.content}-${id}` : false;

  return {
    post: {
      url: postUrl,
      valid: titleSlugify.valid,
    },
    comment: {
      url: commentUrl,
      valid: contentSlugify.valid,
    },
  };
};
