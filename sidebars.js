// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'README',
    'why',
    'start',
    {
      type: 'category',
      label: 'Define API',
      link: { type: 'doc', id: 'define/index' },
      items: ['define/fsd', 'define/swagger'],
    },
    {
      type: 'category',
      label: 'Generate Code',
      link: { type: 'doc', id: 'generate/index' },
      items: [
        'generate/tools',
        'generate/csharp',
        'generate/aspnet',
        'generate/javascript',
        'generate/markdown',
      ],
    },
    'contribute',
  ],
};

export default sidebars;
