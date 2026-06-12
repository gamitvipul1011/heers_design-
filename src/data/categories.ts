export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount?: number;
}

export const defaultCategories: Category[] = [
  {
    id: 'saree',
    name: 'Sarees',
    slug: 'saree',
    description: 'Traditional handwoven sarees from across India',
    image: 'https://images.pexels.com/photos/4048041/pexels-photo-4048041.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
  },
  {
    id: 'lehenga',
    name: 'Lehengas',
    slug: 'lehenga',
    description: 'Bridal and festive lehengas with intricate embroidery',
    image: 'https://images.pexels.com/photos/13661851/pexels-photo-13661851.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
  },
  {
    id: 'evening',
    name: 'Evening Wear',
    slug: 'evening',
    description: 'Elegant gowns and dresses for special occasions',
    image: 'https://images.pexels.com/photos/1655844/pexels-photo-1655844.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
  },
  {
    id: 'bridal',
    name: 'Bridal Collection',
    slug: 'bridal',
    description: 'Exquisite bridal ensembles for your special day',
    image: 'https://images.pexels.com/photos/12792006/pexels-photo-12792006.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600',
  },
];
