// contexts/UserContext.tsx
import React, { createContext, useState, ReactNode } from "react";

export interface UserData {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  freeTime: number;
  daysWeek: number;
  goalType: string;
  goalDuration: number;
  fitnessLevel: string;
  preferredLocation: string;
  preferredWorkoutType: string;
  dietRestrictions: string[];
  allergies: string[];
  mealPrepTime: number;       
  mealsPerDay: number;        
  varietyPreferences: string[]; 
}

interface UserContextProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
}

export const UserContext = createContext<UserContextProps>({
  userData: {
    name: "",
    age: 0,
    gender: "",
    height: 0,
    weight: 0,
    activityLevel: "",
    freeTime: 0,
    daysWeek: 0,
    goalType: "",
    goalDuration: 0,
    fitnessLevel: "",
    preferredLocation: "",
    preferredWorkoutType: "",
    dietRestrictions: [],
    allergies: [],
    mealPrepTime: 0,
    mealsPerDay: 0,
    varietyPreferences: [],
  },
  setUserData: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    age: 0,
    gender: "",
    height: 0,
    weight: 0,
    activityLevel: "",
    freeTime: 0,
    daysWeek: 0,
    goalType: "",
    goalDuration: 0,
    fitnessLevel: "",
    preferredLocation: "",
    preferredWorkoutType: "",
    dietRestrictions: [],
    allergies: [],
    mealPrepTime: 0,
    mealsPerDay: 0,
    varietyPreferences: [],
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}