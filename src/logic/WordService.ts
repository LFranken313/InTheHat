import * as FileSystem from 'expo-file-system';
import {Word} from '../models/Word';

const CUSTOM_WORDS_PATH = FileSystem.documentDirectory + 'custom_words.json';
const STATIC_WORDS: Word[] = require('../assets/PresetWords.json');

export class WordService {
    private words: Word[];

    constructor() {
        this.words = [...STATIC_WORDS];
    }

    findByCategory(category: string): Word[] {
        return this.words.filter(
            w => w.category.toLowerCase() === category.toLowerCase()
        );
    }

    async saveCustomWords(words: string[]): Promise<void> {
        const wordObjects: Word[] = words.map(name => ({
            name,
            category: 'Custom',
        }));
        await FileSystem.writeAsStringAsync(CUSTOM_WORDS_PATH, JSON.stringify(wordObjects));
    }

    async loadCustomWords(): Promise<Word[]> {
        try {
            const json = await FileSystem.readAsStringAsync(CUSTOM_WORDS_PATH);
            return JSON.parse(json) as Word[];
        } catch {
            return [];
        }
    }

    getAllCategories(): string[] {
        const categories = new Set<string>();
        this.words.forEach(word => categories.add(word.category));
        return Array.from(categories);
    }
}