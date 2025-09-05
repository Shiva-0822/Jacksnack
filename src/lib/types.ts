
export interface Product {
  id: string;
  name: string;
  imageURL: string;
  quantity: number;
  price: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  review: string;
  imageURL: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageURL: string;
}
