import { Item } from './models';

export const MODE_PREFERENCE_STORAGE_KEY = 'modePreference';
export const DARK_MODE_CLASS_NAME = 'app-dark-mode';
export const LIGHT_MODE_CLASS_NAME = 'app-light-mode';
export const PREFERS_COLOR_SCHEME_DARK = '(prefers-color-scheme: dark)';

export const PRESETS: Record<string, Item[]> = {
  'Daily Routine': [
    { description: 'Wake up early (6:00 AM)', done: false },
    { description: 'Drink a glass of water', done: false },
    { description: 'Morning exercise or stretching', done: false },
    { description: 'Have a healthy breakfast', done: false },
    { description: 'Check emails and messages', done: false },
    { description: 'Plan tasks for the day', done: false },
    { description: 'Take a short walk or break', done: false },
    { description: 'Complete work/study tasks', done: false },
    { description: 'Prepare and eat lunch', done: false },
    { description: 'Wind down and relax before bed', done: false },
  ],
  'Travel Preparation': [
    { description: 'Book flights and accommodation', done: false },
    { description: 'Pack suitcase (clothing, toiletries, etc.)', done: false },
    { description: 'Charge phone and pack chargers', done: false },
    { description: 'Print/download travel documents', done: false },
    { description: 'Notify bank of travel (if needed)', done: false },
    { description: 'Arrange transportation to the airport', done: false },
    {
      description: 'Pack snacks and entertainment for the journey',
      done: false,
    },
    { description: 'Confirm travel itinerary with companions', done: false },
    { description: 'Check weather forecast for the destination', done: false },
    { description: 'Set out-of-office email response', done: false },
  ],
};
