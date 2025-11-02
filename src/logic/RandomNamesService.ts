import namesData from '../assets/RandomNames.json';

export class RandomNamesService {
    static getRandomNames(count: number): string[] {
        const names: string[] = namesData.names;
        const shuffled = [...names].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
}