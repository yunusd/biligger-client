import slugify from '@sindresorhus/slugify';

const pathSlicer = (str, type) => {
  const path = str.split('/');

  if (type === 'Post') {
    const title = path[1].slice(0, -25);
    return {
      title,
    };
  } if (type === 'Comment') {
    const author = path[1].slice(1);
    const content = path[2].slice(0, 100);
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
    titleSlugify.title = slugify(text.title, { decamelize: false });
    titleSlugify.valid.title = !type.post ? null : titleSlugify.title === path.title;
  } else if (text.content) {
    const path = pathname ? pathSlicer(pathname, 'Comment') : false;
    contentSlugify.content = slugify(text.content.slice(0, 100), { decamelize: false });
    contentSlugify.valid.username = !type.comment ? null : path.author === username;
    contentSlugify.valid.content = !type.comment ? null : contentSlugify.content === path.content;
  }

  const postUrl = type.post && titleSlugify.title ? `/${titleSlugify.title}-${id}` : false;
  const commentUrl = type.comment && username && contentSlugify.content ? `/@${username}/${contentSlugify.content}/${id}` : false;
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
