const shoppingListData = [
  {
    id: 'generated',
    name: 'Ma_liste_1',
    createdAt: new Date(),
  },
  {
    id: 'generated',
    name: 'Ma_liste_2',
    createdAt: new Date(),
  },
  {
    id: 'generated',
    name: 'Ma_liste_3',
    createdAt: new Date(),
  },
  {
    id: 'generated',
    name: 'Ma_liste_4',
    createdAt: new Date(),
  },
  {
    id: 'generated',
    name: 'Ma_liste_5',
    createdAt: new Date(),
  },
  {
    id: 'generated',
    name: 'Ma_liste_6',
    createdAt: new Date(),
  },
  {
    id: 'generated',
    name: 'Ma_liste_7',
    createdAt: new Date(),
  },
];

export async function getShoppingListDataForSeed() {
  return shoppingListData;
}

export const shoppingListSeed = {
  getShoppingListDataForSeed,
};
