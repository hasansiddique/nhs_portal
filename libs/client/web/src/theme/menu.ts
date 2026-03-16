const menus = [
  {
    id: 2,
    name: 'Browse Appointments',
    links: '/appointments',
  },
  {
    id: 3,
    name: 'Discover',
    links: '#',
    namesub: [
      {
        id: 1,
        sub: 'Book appointment',
        links: '/appointments/book',
      },
      {
        id: 2,
        sub: 'My appointments',
        links: '/appointments',
      },
    ],
  },
];

export default menus;
