export const REDIRECTS = [
    // "/test*" to the root site
    {
      from: '/test*',
      to: '',
    },
    // "/api*" to "/api-echo/index.html"
    {
      from: '/api*',
      to: '/api-echo',
    },
  ];