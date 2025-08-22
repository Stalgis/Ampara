
export type Role = "FAMILY" | "NURSE";

export interface Person {
  id: string;
  name: string;
  role: Role;
  avatarUrl?: string;
}

export const mockFamily: Person[] = [
  {
    id: "f1",
    name: "John Doe",
    role: "FAMILY",
  },
  {
    id: "f2",
    name: "Jane Doe",
    role: "FAMILY",
  },
];

export const mockNurses: Person[] = [
  {
    id: "n1",
    name: "Nurse Kate",
    role: "NURSE",
  },
  {
    id: "n2",
    name: "Nurse Tom",
    role: "NURSE",
  },
];
