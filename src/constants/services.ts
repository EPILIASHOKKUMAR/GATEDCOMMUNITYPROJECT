import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

export type PropertyService = {
  title: string;
  description: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
};

export const propertyServices: PropertyService[] = [
  { title: 'Protect My Property', description: 'Keep your property safe with monitoring, site visits and regular updates.', icon: 'shield-half-full' },
  { title: 'Legal', description: 'Get guidance on property documents, legal verification and counsel.', icon: 'scale-balance' },
  { title: 'Registration Help', description: 'Understand the documents and steps involved in property registration.', icon: 'file-document-outline' },
  { title: 'Financial Help', description: 'Explore loans and financing guidance for your property journey.', icon: 'currency-inr' },
];
